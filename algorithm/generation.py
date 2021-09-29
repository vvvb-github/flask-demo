#!/usr/bin/env python 
# -*- coding:utf-8 -*-
import os
import random

from concurrent.futures import ThreadPoolExecutor, as_completed
import numpy as np
import sys

sys.path.append('..')


# 判断字符串是否为数字
def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        pass

    try:
        import unicodedata
        unicodedata.numeric(s)
        return True
    except (TypeError, ValueError):
        pass

    return False


# 读取湿度HPC文件
def ReadHPC(filepath):
    height = []
    humidity_re = []
    time_re = []
    l = 0
    with open(filepath, "r", encoding='utf-8') as f:
        for line in f.readlines():
            line = line.strip('\n')
            if (l == 3):
                temp = line.split('#')
                temp = temp[0].split()
                humidity_max = float(temp[0])
            if (l == 7):
                temp = line.split(',')
                for i in range(len(temp) - 1):
                    height.append(float(temp[i]))
                h = temp[len(temp) - 1].split('#')
                height.append(float(h[0]))
            if (l > 8):
                humidity = []
                time = []
                temp = line.split(',')
                year = float(temp[0])
                month = float(temp[1])
                day = float(temp[2])
                hour = float(temp[3])
                min = float(temp[4])
                second = float(temp[5])
                RainFlag = int(temp[6])
                time.append(year)
                time.append(month)
                time.append(day)
                time.append(hour)
                time.append(min)
                time.append(second)
                time_re.append(time)
                for i in range(7, len(temp)):
                    # 相对湿度计算
                    humidity.append(float(temp[i]) / humidity_max)
                humidity_re.append(humidity)
            l = l + 1
    return height, humidity_re, time_re


# 读取温度廓线文件TPC
def ReadTPC(filepath):
    height = []
    temperature_re = []
    time_re = []
    l = 0
    with open(filepath, "r", encoding='utf-8') as f:
        for line in f.readlines():
            line = line.strip('\n')
            if (l == 7):
                temp = line.split(',')
                for i in range(len(temp) - 1):
                    height.append(float(temp[i]))
                h = temp[len(temp) - 1].split('#')
                height.append(float(h[0]))
            if (l > 8):
                temperature = []
                time = []
                temp = line.split(',')
                year = float(temp[0])
                month = float(temp[1])
                day = float(temp[2])
                hour = float(temp[3])
                min = float(temp[4])
                second = float(temp[5])
                RainFlag = int(temp[6])
                time.append(year)
                time.append(month)
                time.append(day)
                time.append(hour)
                time.append(min)
                time.append(second)
                time_re.append(time)
                for i in range(7, len(temp)):
                    temperature.append(float(temp[i]))
                temperature_re.append(temperature)
            l = l + 1
    return height, time_re, temperature_re

# generate temperature, humidity, pressure, wind, direction, time, position
class Generation():
    # 缓存中的基本气象数据信息<300
    database = []
    # 缓存中的蒸发波导高度信息
    evap_duct = []
    # 缓存中的未来波导高度信息
    # futu_duct = []
    # 缓存中的表面波导高度信息
    surface_duct = [0, 0]
    # 缓存中的悬空波导高度信息
    elevated_duct = [0, 0, 0]
    # 缓存中的电磁波损耗信息
    elec = None
    # 缓存中的雷达有效探测距离信息
    radar = None
    # 用于物理计算的线程池
    executor = ThreadPoolExecutor(max_workers=6)

    def generate_elec(self, loss=None):
        self.elec = []
        for i in range(200):
            for j in range(200):
                if loss is None:
                    self.elec.append([i, j, random.randint(0, 200)])
                else:
                    self.elec.append([i, j, np.float(loss[i][j])])

    # 说明：字符位置11-16为气压，19-23为高度，26-31为气温，34-38为湿度，48-50为风向，53-57为风速，
    # 组合为[高度、气温、压强、风速、湿度、风向]
    def ReadTxt(self, filepath="gaokong.txt", limit=3000):
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

    # 读取高空数据1文件夹下的数据
    def ReadGaokong1(self, filepath, limit=3000):
        dataset = []
        l = 0
        with open(filepath, "r", encoding='ANSI') as f:
            for line in f.readlines():
                line = line.strip('\n')
                if (l >= 2):
                    temp = line.split()
                    temperature = float(temp[2])
                    press = float(temp[3])
                    humidity = float(temp[4])
                    altitude = float(temp[7])
                    direction = float(temp[5])
                    wind = float(temp[6])
                    if altitude > limit:
                        break
                    dataset.append([altitude, temperature, press, wind, humidity, direction])
                l = l + 1
        print("end read txt!")
        return dataset

    # 高空数据文件夹2
    def ReadGaokong2(self, filepath, limit):
        dataset = []
        l = 0
        with open(filepath, "r", encoding='utf-8') as f:
            for line in f.readlines():
                line = line.strip('\n')
                if (l >= 14):
                    temp = line.split()
                    temperature = float(temp[1])
                    press = float(temp[2])
                    humidity = float(temp[3])
                    altitude = float(temp[4])
                    direction = float(temp[7])
                    wind = float(temp[8])
                    if altitude > limit:
                        break
                    dataset.append([altitude, temperature, press, wind, humidity, direction])
                l = l + 1
        return dataset

    # 读取高空文件夹3
    def ReadGaokong3(self, filepath, limit):
        dataset = []
        l = 0
        with open(filepath, "r", encoding='utf-8') as f:
            for line in f.readlines():
                line = line.strip('\n')

                if (l >= 3):
                    temp = line.split()
                    if (is_number(temp[1]) and is_number(temp[2]) and is_number(temp[3]) and is_number(temp[5])):
                        temperature = float(temp[1])
                        press = float(temp[3])
                        humidity = float(temp[2])
                        altitude = float(temp[5])
                        # print(temperature)
                        # print(press)
                        # print(humidity)
                        # print(altitude)
                        if altitude > limit:
                            break
                        dataset.append([altitude, temperature, press, humidity])
                l = l + 1
        return dataset

    def ReadNpy(self, filepath="snd.npy", limit=3000):
        data = np.load(filepath)
        dataset = []
        for i in range(data.shape[0]):
            altitude = data[i][0]
            temperature = data[i][1]
            press = data[i][2]
            humidity = data[i][3]
            if altitude > limit:
                break
            dataset.append([altitude, temperature, press, humidity])
        return dataset
