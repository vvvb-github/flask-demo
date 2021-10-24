#!/usr/bin/env python 
# -*- coding:utf-8 -*-
import numpy as np
from algorithm import SP

def generate_data_diancichuanbo(ref, h):
    pre_data = np.zeros((5, ref.shape[1]))
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
    for i in range(0, ref.shape[1]):
        for j in range(0, flag1.shape[0]):
            if (flag1[j][i] == 1):
                # 发生蒸发波导
                c1 = 0
                zb = 0
                for k in range(0, tidu1.shape[0]):
                    if (tidu1[k][i] != 0):
                        m = tidu1[k][i]
                        break
                for k in range(0, hh1.shape[0]):
                    if (hh1[k][i] != 0):
                        zt = hh1[k][i]
                        q=zt
                        break
                pre_data[0][i]=m
                pre_data[1][i] = zt
                pre_data[2][i] = c1
                pre_data[3][i]=zb
                pre_data[4][i]=q
                break
            elif(flag1[j][i] == 2):
                #发生表面波导1
                zb=0
                q=0
                c1=0
                for k in range(0, tidu1.shape[0]):
                    if (tidu1[k][i] != 0):
                        m = tidu1[k][i]
                        break
                for k in range(0, hh1.shape[0]):
                    if (hh1[k][i] != 0):
                        zt = hh1[k][i]
                        break
                pre_data[0][i] = m
                pre_data[1][i] = zt
                pre_data[2][i] = c1
                pre_data[3][i] = zb
                pre_data[4][i] = q
                break
        for j in range(0, flag2.shape[0]):
            if(flag2[j][i] == 3):
                #发生了悬空波导
                m=0
                zt=0
                c1=0
                zb=0
                q=0
                for k in range(0, tidu2.shape[0]):
                    if (tidu2[k][i] != 0):
                        m = tidu2[k][i]
                        break
                for k in range(0, hh2.shape[0]):
                    if (hh2[k][i] != 0):
                        zt = hh2[k][i]
                        break
                for k in range(0, cc1.shape[0]):
                    if (cc1[k][i] != 0):
                        c1 = cc1[k][i]
                        break
                for k in range(0, g2.shape[0]):
                    if (g2[k][i] != 0):
                        zb = g2[k][i]
                        break
                pre_data[0][i] = m
                pre_data[1][i] = zt
                pre_data[2][i] = c1
                pre_data[3][i] = zb
                pre_data[4][i] = q
                break
            elif(flag2[j][i] == 4):
                #发生表面波导2
                q=0
                c1=0
                zb=0
                for k in range(0, tidu2.shape[0]):
                    if (tidu2[k][i] != 0):
                        m = tidu2[k][i]
                        break
                for k in range(0, hh2.shape[0]):
                    if (hh2[k][i] != 0):
                        zt = hh2[k][i]
                        break
                for k in range(0, g2.shape[0]):
                    if (g2[k][i] != 0):
                        zb = g2[k][i]
                        break
                pre_data[0][i] = m
                pre_data[1][i] = zt
                pre_data[2][i] = c1
                pre_data[3][i] = zb
                pre_data[4][i] = q
                break
    return pre_data

def dianciLoss(ref, h):
    pre_data = generate_data_diancichuanbo(ref, h)
    loss = SP.spe(pre_data[0][0], pre_data[1][0], pre_data[2][0], pre_data[3][0], pre_data[4][0])
    # SP.spe(0.137, 100.0, -0.043, 300, 0, loss)
    loss = np.array(loss)
    return loss
