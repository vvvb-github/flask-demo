#!/usr/bin/env python 
# -*- coding:utf-8 -*-
import random

import numpy as np
from concurrent.futures import ThreadPoolExecutor, as_completed
from algorithm.FileHelper import FileHelper
from algorithm.Evapduct import evap_duct
from algorithm.Evapduct_SST import evap_duct_SST
from algorithm.xb_M import xuankong, biaomian
from algorithm.Utils import Interplot, generate_data
from algorithm.ElectroPro import dianciLoss
from algorithm.trapFrequency import getTrap
class Algorithm:
    def __init__(self, fileRoot="", max_workers=4, max_num=299, interplot_kind="cubic"):
        self.fileHelper = FileHelper(fileRoot)
        self.max_num = max_num
        self.interplot_kind = interplot_kind

    # 从csv文件中获取时间 和 蒸发波导高度信息
    def getCSV2Line(self, filePath):
        time, dataset = self.fileHelper.ReadCSV(filePath, 99999.9)
        altitude = []
        for data in dataset:
            altitude.append(evap_duct_SST(data[0], data[1], data[2], data[3], data[4]))
        return time, altitude

    # 从ddb3文件中获取时间 和 蒸发波导高度信息
    def getDDB2Line(self, filePath):
        time, dataset = self.fileHelper.ReadDDB3(filePath)
        altitude = []
        for data in dataset:
            altitude.append(evap_duct_SST(data))
        return time, altitude

    # 从TPU文件中获取各类波导高度信息

    def getTPU2Bar(self, filePath):
        dataset = self.fileHelper.ReadTPU(filePath, 3000)
        return self.calInformation(dataset)

    # 从数字文件(kind)获取悬空波导高度或表面波导高度
    def getNUM2Bar(self, filePath):
        dataset = self.fileHelper.ReadTKData(filePath)
        return self.calInformation(dataset)

    def getTXT2Bar(self, filePath):
        dataset = self.fileHelper.ReadTxt(filePath, 3000)
        return self.calInformation(dataset)

    # 返回底高，高度，电磁波损失
    def calInformation(self, dataset):
        ref, h = generate_data(dataset)

        def calcu_duct(etype):
            # 类型为蒸发波导
            if etype == "Z":
                # self.lock.acquire()
                val = evap_duct(ref, h)
                # self.lock.release()
            # 类型为悬空波导和表面波导
            # val = [[悬空波导], [表面波导]]
            # lens(val[0])=8, 只有后面四个值可以用，分别是波导顶高，波导底高，波导强度，波导厚度
            # lens(val[1])=5, 只有后面两个值可以用，分别是波导厚度，波导强度
            elif etype == "X":
                val = xuankong(ref, h)
            elif etype == "B":
                val = biaomian(ref, h)
            else:
                val = dianciLoss(ref, h)
            return val
        bottom = [0, 0, 0]
        altitude = [0, 0, 0]
        resB = calcu_duct("B")
        resX = calcu_duct("X")
        trapFreq, cutOff = getTrap(resX, resB)
        altitude[0] = resB[3][0] * 1000
        bottom[1], altitude[1] = resX[5][0], (resX[4]-resX[5])[0] * 1000
        if isinstance(calcu_duct("Z"), int):
            altitude[2] = calcu_duct("Z") * 1000
        else:
            altitude[2] = calcu_duct("Z")[0] * 1000
        loss = calcu_duct("E").tolist()
        Electron = []
        for i in range(200):
            for j in range(200):
                if loss is None:
                    Electron.append([i, j, random.randint(0, 200)])
                else:
                    Electron.append([i, j, np.float(loss[i][j])])
        return bottom, altitude, Electron, trapFreq, cutOff

