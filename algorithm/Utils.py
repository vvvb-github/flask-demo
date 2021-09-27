#!/usr/bin/env python
# -*- coding:utf-8 -*-
import numpy as np
from cmath import exp
from scipy.interpolate import interp1d

#p气压 t温度，shidu相对湿度，z高度,计算得到某一高度的大气折射率
def zheshelv(t,p,shidu,z):
    #e为饱和水汽压
    e=6.112*exp(17.67*t/(t+243.5))
    e=e*shidu
    M=77.6*p/t+3.73*pow(10,5)*e/(t*t)+0.157*z
    return M.real

#输入data，生成其他算法需要的廓线和高度数据
def generate_data(data):
    h=np.zeros((data.shape[0],1))
    ref=np.zeros((data.shape[0],1))
    for i in range(0,data.shape[0]):
        h[i][0]=data[i][0]
        ref[i][0]=zheshelv(data[i][1],data[i][2],data[i][4],data[i][0])
    return ref,h

# 主要服务于，使用.tpu的snd数据
# 数据格式为 [alt(高度), tem(温度), pre(压强), hum(湿度)]
def generate_datas(data):
    h = np.zeros((data.shape[0], 1))
    ref = np.zeros((data.shape[0], 1))
    for i in range(0, data.shape[0]):
        h[i][0] = data[i][0]
        ref[i][0] = zheshelv(data[i][2], data[i][1], data[i][3], data[i][0])
    return ref, h

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

