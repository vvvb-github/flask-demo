#!/usr/bin/env python 
# -*- coding:utf-8 -*-
import math

# 陷获频率与截至波长
#悬空波导陷获频率和截止波长计算
#input M_top M_bottom,d单位km
#output f陷获频率 单位GHz m截止波长单位m
def xkTrap(M_top,M_bottom,d):
    f = 79.4945/(math.sqrt(M_bottom-M_top)*d*1000)
    m = 2.9979*math.pow(10, 8)/f
    return float(f), float(m)

#表面波导陷获频率和截止波长计算
#input M_0 M_top,d单位km
#output f陷获频率 单位GHz m截止波长单位m
def bmTrap(M_0,M_top,d):
    f = 119.2417 / (math.sqrt(M_0 - M_top) * d * 1000)
    m = 2.9979*math.pow(10, 8)/f
    return float(f), float(m)

def getTrap(xResult, bResult):
    if xResult[0][0] != 0:
        return xkTrap(xResult[0][2], xResult[0][3], xResult[0][7])
    elif bResult[0][0] != 0:
        return bmTrap(bResult[1][1], bResult[1][2], bResult[1][3])
    else:
        return None, None