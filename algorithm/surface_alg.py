#!/usr/bin/env python 
# -*- coding:utf-8 -*-
import math
import time
import threading
import pandas
import numpy as np
from cmath import exp
import matlab.engine
from scipy.interpolate import interp1d



# 可以优化的部分
# -----------------------------------
# 计算下面部分的耗时，如果耗时比较久，则可以优化
# engine = matlab.engine.start_matlab()

# 结果：
# 通过计算结果可得知，上部分代码耗费的时间为5.5s左右，有极大的优化价值
# -----------------------------------

def getEngine():
    engine = matlab.engine.start_matlab()
    return engine

# 说明：字符位置11-16为气压，19-23为高度，26-31为气温，34-38为湿度，48-50为风向，53-57为风速，
# 组合为[高度、气温、压强、风速、湿度、风向]
def ReadTxt(filepath="gaokong.txt", limit=3000):
    flag = True
    dataset = []
    with open(filepath, "r") as f:
        for line in f.readlines():
            line = line.strip('\n')
            if flag:
                flag = False
                continue
            altitude = float(line[18:23])
            if altitude > limit:
                break
            press = float(line[10:16])
            temperature = float(line[25:31])
            humidity = float(line[33:38])
            wind = float(line[52:57])
            direction = float(line[47:50])
            dataset.append([altitude, temperature, press, wind, humidity, direction])
    return dataset


# 插值方法，开始高度为50，结束高度为3000，插值后数目为296，插值方法为cubic
def Interplot(data, start=50, end=3000, nums=296, kind="cubic"):
    data = np.array(data)
    newdata = []
    xnew = np.linspace(start, end, nums, endpoint=True)
    newdata.append(xnew)
    for i in range(data.shape[1]):
        if i == 0:
            continue
        line = interp1d(data[:, 0], data[:, i], kind=kind)
        ynew = line(xnew)
        newdata.append(ynew)
    data = np.array(newdata).transpose()
    return data

#p气压 t温度，shidu相对湿度，z高度,计算得到某一高度的大气折射率
def zheshelv(t,p,shidu,z):
    #e为饱和水汽压
    e=6.112*exp(17.67*t/(t+243.5))
    e=e*shidu
    M=77.6*p/t+3.73*pow(10,5)*e/(t*t)+0.157*z
    return M.real

#输入data，生成其他算法需要的廓线和高度数据
def generate_data(data):
# data=np.load('gaokong.npy')
    h=np.zeros((data.shape[0],1))
    ref=np.zeros((data.shape[0],1))
    for i in range(0,data.shape[0]):
        h[i][0]=data[i][0]
        ref[i][0]=zheshelv(data[i][1],data[i][2],data[i][4],data[i][0])
    return ref,h

# 输出表面和悬空波导信息
# selected = "n"表示用gaokong.txt格式的数据
# selected = "s"表示用snd*.tpu格式的数据
def xk_bmM(ref, h, engine=None):
    if engine is None:
        engine = matlab.engine.start_matlab()
    #ref, h = engine.loaddata(nargout=2)
    #ref = np.array(ref)
    #h = np.array(h)
    ref = matlab.double(ref.tolist())
    h = matlab.double(h.tolist())
    xuankongM, biaomianM = engine.xbM(ref, h, nargout=2)
    xuankongM = np.array(xuankongM)
    biaomianM = np.array(biaomianM)
    if((xuankongM[0][0]!=0)&(biaomianM[0][0]!=0)):
        return xuankongM,biaomianM
    elif((xuankongM[0][0]!=0)&(biaomianM[0][0]==0)):
        return xuankongM,[]
    elif((xuankongM[0][0]==0)&(biaomianM[0][0]!=0)):
        return [], biaomianM
    else:
        return [], []

if __name__ == "__main__":
    # 读取数据文件
    data = ReadTxt("..\\data\\gaokong.txt")
    # 插值
    data = Interplot(data)
    # 计算大气折射率和高度
    ref, h = generate_data(data)
    # 初始化matlab的engine
    engine = getEngine()
    # 得到悬空波导和表面波导
    X, B = xk_bmM(ref, h, engine)
    # 悬空波导顶高、底高、强度
    print("悬空波导", X[4:-1])
    # 表面波到厚度、轻度
    print("表面波导", B[3:])
