#!/usr/bin/env python 
# -*- coding:utf-8 -*-

# 已完成matlab -> python 的转化，已测试通过，可以投入使用
# 无海温情况下的蒸发波导情况

import numpy as np
from algorithm.Utils import generate_data, Interplot

def evap_duct(ref, h):
    flag1 = np.zeros((400, ref.shape[1]))
    flag2 = np.zeros((400, ref.shape[1]))
    hh1 = np.zeros((400, ref.shape[1]))
    hh2 = np.zeros((400, ref.shape[1]))
    tidu1 = np.zeros((400, ref.shape[1]))
    tidu2 = np.zeros((400, ref.shape[1]))
    g1 = np.zeros((400, ref.shape[1]))
    g2 = np.zeros((400, ref.shape[1]))
    delm2 = np.zeros((400, ref.shape[1]))
    ddm1 = np.zeros((400, ref.shape[1]))
    cc1 = np.zeros((400, ref.shape[1]))
    ddm2 = np.zeros((400, ref.shape[1]))
    r = None
    for i in range(ref.shape[1]):
        if r is None:
            r = [np.gradient(ref[:, i], h[:, i])]
        else:
            r.append(np.gradient(ref[:, i], h[:, i]))
    r = np.array(r).transpose(1, 0)
    print(r.shape)
    # 折点计算
    # g1为波导点到非波导点高度，g2为非波导点到波导点高度，判断波导类型
    n = 0
    k = 0
    # 因为用法都是一条廓线，这里不在设置多条的情况
    for i in range(ref.shape[1]):
        for j in range(ref.shape[0]-1):
            if r[j, i] <= 0 and r[j+1, i] > 0 and r[0, i] < 0:
                hh1[n, i] = h[j, i]
                g1[n, i] = h[j, i]
                ddm1[n, i] = ref[0, i]-ref[j, i]
                tidu1[n, i] = ddm1[n, i]/hh1[n, i]
                if g1[n, i] < 40:
                    flag1[n, i] = 1
                else:
                    flag1[n, i] = 2
                n += 1
            elif r[j+1, i] <= 0 and r[j, i] > 0 and r[0, i] > 0:
                delm2[k, i] = ref[j, i]
                for ss in range(ref.shape[0]-j-1):
                    if r[j+ss, i] <=0 and  r[j+ss+i, i] > 0:
                        if ref[j+ss, i] > ref[0, i]:
                            flag2[k, i] = 3
                            g2[k, i] = h[j, i]
                            ddm2[k, i] = ref[j+ss, i]-delm2[k ,i]
                            for b in range(j-1):
                                if np.abs(h[b, i]- h[j, i]) < 0.1:
                                    hh2[k, i] = h[j+ss, i] - g2[k, i]
                                    tidu2[k, i] = ddm2[k, i]/hh2[k, i]
                    elif ref[j+ss, i] < ref [0, i]:
                        flag2[k, i] = 4
                        ddm2[k, i] = ref[j+ss, i] - delm2[k, i]
                        hh2[k, i] = h[j+ss, i] - h[j, i]
                        tidu2[k, i] = delm2[k, i]/g2[k, i]
                cc1[k, i] =delm2[k, i]/g2[k, i]
                k += 1
    res = np.zeros((2, ref.shape[1]))
    count = 0
    for i in range(0, flag1.shape[1]):
        for j in range(0, flag1.shape[0]):
            if (flag1[j][i] == 1):
                # 判定发生了蒸发波导，输出蒸发波导高度
                for k in range(0, g1.shape[0]):
                    if (g1[k][i] != 0):
                        res[0][count]=i+1
                        res[1][count]=g1[k][i]
                        count=count+1
                        break
                break
    if(count!=0):
        return res[1]
    else:
        return []