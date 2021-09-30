#!/usr/bin/env python 
# -*- coding:utf-8 -*-
import numpy as np
from concurrent.futures import ThreadPoolExecutor, as_completed
from algorithm.FileHelper import FileHelper
from algorithm.Evapduct import evap_duct
from algorithm.Evapduct_SST import evap_duct_SST
from algorithm.xb_M import xuankong, biaomian
from algorithm.Utils import Interplot, generate_data


class Algorithm:
    def __init__(self, fileRoot="", max_workers=4, max_num=299, interplot_kind="cubic"):
        self.fileHelper = FileHelper(fileRoot)
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        self.max_num = max_num
        self.interplot_kind = interplot_kind

    # 从csv文件中获取时间 和 蒸发波导高度信息
    def getSCV2Line(self, filePath):
        time, dataset = self.fileHelper.ReadCSV(filePath, 99999.9)
        altitude = []
        for data in dataset:
            altitude.append(evap_duct_SST(data))
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
        dataset = self.fileHelper.ReadTPU(filePath, 10000)
        start = dataset[0][0]
        end = dataset[len(dataset) - 1][0]
        data = Interplot(dataset, start, end, self.max_num, self.interplot_kind)
        ref, h = generate_data(data)

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
            elif etype == 'X':
                val = xuankong(ref, h)
            else:
                val = biaomian(ref, h)
            return val

        task1 = self.executor.submit(calcu_duct, "Z")
        task2 = self.executor.submit(calcu_duct, "X")
        task3 = self.executor.submit(calcu_duct, "B")
        # 波导底高、波导厚度
        bottom = [0, 0, 0]
        altitude = [0, 0, 0]
        obj_list = [task1, task2, task3]
        for future in as_completed(obj_list):
            res = future.result()
            # 表面波导
            if len(res) == 5:
                altitude[0] = res[3]
            elif len(res) == 8:
                bottom[1] = res[5]
                altitude[1] = res[4] - res[5]
            else:
                altitude[2] = res[0]
        return bottom, altitude

    # 从数字文件1获取悬空波导高度或表面波导高度
    def getNUM2Bar(self, filePath, kind):
        if kind == 1:
            dataset = self.fileHelper.ReadGaokong1(filePath, 3000)
        elif kind == 2:
            dataset = self.fileHelper.ReadGaokong2(filePath, 3000)
        else:
            dataset = self.fileHelper.ReadGaokong3(filePath, 3000)
        start = dataset[0][0]
        end = dataset[len(dataset) - 1][0]
        data = Interplot(dataset, start, end, self.max_num, self.interplot_kind)
        ref, h = generate_data(data)

        def calcu_duct(etype):
            if etype == 'X':
                val = xuankong(ref, h)
            else:
                val = biaomian(ref, h)
            return val

        task1 = self.executor.submit(calcu_duct, "X")
        task2 = self.executor.submit(calcu_duct, "B")
        # 波导底高、波导厚度
        bottom = [0, 0, 0]
        altitude = [0, 0, 0]
        obj_list = [task1, task2]
        for future in as_completed(obj_list):
            res = future.result()
            # 表面波导
            if len(res) == 5 and res[0] == 1:
                altitude[0] = res[3]
            elif len(res) == 8 and res[0] == 1:
                bottom[1] = res[5]
                altitude[1] = res[4] - res[5]
        return bottom, altitude