#!/usr/bin/env python 
# -*- coding:utf-8 -*-
import csv
import sqlite3
import re
from datetime import datetime

from algorithm.Utils import is_number


# 该类专门负责解析气象数据文件
# 目前的问题在于本地文件的所在位置如何定位 fileRootPath和filePath又怎么定义比较好？
# 读取文件类型包括：
# tpu文件
# 数字后缀文件
# txt文件
# ASC（包含TPC与HPC）文件
# csv文件
class FileHelper:

    def __init__(self, fileRoot=""):
        self.fileRootPath = fileRoot

    # 读取TPU格式的文件
    # 读取snd_2144102019.tpu文件格式的代码 为[序号，温度，湿度，气压，GPS测高，气压反算高度]
    # 得到的最后结果，取前10000m的[alt(高度), tem(温度), pre(压强), hum(湿度)]
    # 高度限制有何作用？
    # filepath: 文件路径
    # limit: 高度限制
    # headSpace：跳过文件头行
    def ReadTPU(self, filepath, limit=10000, headSpace=4):
        filepath = self.fileRootPath + filepath
        flag = headSpace
        dataset = []
        with open(filepath, "r") as f:
            for line in f.readlines():
                line = line.strip('\n').split()
                if flag > 0:
                    flag -= 1
                    continue
                alt = float(line[5])
                if alt > limit:
                    break
                tem = float(line[1])
                hum = float(line[2])
                pre = float(line[3])
                dataset.append([alt, tem, pre, hum])
        return dataset

    # 读取数字后缀的探空数据
    # 文件格式A****.[0-9] 内部格式为[时间 温度 气压 湿度 高度 经度 纬度 风向 风速]
    # 读取时要注意文件的编码格式是ANSI还是utf-8
    def ReadTKData(self, filepath, headSpace=14, encoding='ANSI'):
        filepath = self.fileRootPath + filepath
        flag = headSpace
        dataset = []
        with open(filepath, "r", encoding=encoding) as f:
            for line in f.readlines():
                line = line.strip('\n')
                if flag > 0:
                    flag -= 1
                    continue
                # 对tab键进行分割
                temp = line.split('\t')
                temperature = float(temp[1])
                press = float(temp[2])
                humidity = float(temp[3])
                altitude = float(temp[4])
                direction = float(temp[7])
                wind = float(temp[8])
                dataset.append([temperature, press, humidity, altitude, direction, wind])
        return dataset

    # 更正：直接使用正则表达式来剔除字符串中的空字符
    # 返回组合为[高度、气温、压强、风速、湿度、风向]
    def ReadTxt(self, filepath, limit=3000, headSpace=2):
        filepath = self.fileRootPath + filepath
        flag = headSpace
        dataset = []
        with open(filepath, "r") as f:
            for line in f.readlines():
                line = line.strip('\n')
                if flag > 0:
                    flag -= 1
                    continue
                temp = re.split(r"\s+", line)
                altitude = float(temp[7])
                if altitude > limit:
                    break
                press = float(temp[3])
                temperature = float(temp[2])
                humidity = float(temp[4])
                wind = float(temp[6])
                direction = float(temp[5])
                dataset.append([altitude, temperature, press, wind, humidity, direction])
        return dataset

    # 读取csv文件 csv文件是以逗号作为分隔的
    # exceptVal有什么用？是为了防止出现无效数据吗？但是在给出的csv文件中并没有出现无效数据？如果是无效数据那后面的代码是什么意思？
    # 数据中哪些数据是有效的？海温 红外海温 测量的温压风湿均有三个不同的数据，应该怎么选取？
    # 返回两个list：时间， 数据[温度、海温、湿度、风速、气压]
    def ReadCSV(self, filepath, exceptVal=9999.9):
        filepath = self.fileRootPath + filepath
        # 数据时间
        times = []
        # 温度1（2、3）、海面温度（红外海温）、湿度1（2、3）、真实风速1（2、3）、大气压力
        dataset = []
        rowNum = 0
        with open(filepath, 'r') as f:
            reader = csv.reader(f)
            for row in reader:
                if rowNum == 0:
                    rowNum += 1
                    continue
                datas = [exceptVal, exceptVal, exceptVal, exceptVal, exceptVal]
                times.append(row[0])
                for i in range(len(row)):
                    if i == 5 or i == 12 or i == 19:
                        # 处理异常值
                        # 这里直接选取了第一个值 这么做对不对？
                        if datas[0] == exceptVal and row[i] != '':
                            datas[0] = float(row[i])
                    if i == 1 or i == 2:
                        if datas[1] == exceptVal and row[i] != '':
                            datas[1] = float(row[i])
                    if i == 6 or i == 13 or i == 20:
                        if datas[2] == exceptVal and row[i] != '':
                            datas[2] = float(row[i])
                    if i == 10 or i == 17 or i == 24:
                        if datas[3] == exceptVal and row[i] != '':
                            datas[3] = float(row[i])
                    if i == 3:
                        if datas[4] == exceptVal and row[i] != '':
                            datas[4] = float(row[i])
                dataset.append(datas)
        return times, dataset

    # 读取HPC与TPC文件函数
    def ReadHPC_TPC(self, filepath, headSpace=9):
        filepath = self.fileRootPath + filepath
        minimum_value = None # 最小值
        maximum_value = None # 最大值
        sample_count = None # 文件中的样本数量（以时间作为基准）
        altitude = [] # 每一组样本中包含的海拔高度
        time = [] # 样本时间
        hum_tem = [] # 样本数据（内部每个元素为一个list,代表了随着海拔变化高度/湿度的变化
        l = 0
        with open(filepath, "r", encoding='utf-8') as f:
            for line in f.readlines():
                line = line.strip('\n')
                if l == 1:
                    sample_count = float(line.split('#')[0].split()[0])
                if l == 2:
                    minimum_value = float(line.split('#')[0].split()[0])
                if l == 3:
                    maximum_value = float(line.split('#')[0].split()[0])
                if l == 6:
                    altitude_count = int(line.split('#')[0].split()[0])
                if l == 7:
                    # 使用正则表达式对字符串进行分割
                    temp = re.split(r'[\s,]+', line)
                    for t in range(altitude_count):
                        altitude.append(float(temp[t]))
                if 8 < l <= sample_count + 8:
                    temp = re.split(r'[\s,]+', line)
                    year = int('20' + temp[0])
                    month = int(temp[1])
                    day = int(temp[2])
                    hour = int(temp[3])
                    minute = int(temp[4])
                    second = int(temp[5])
                    temp_date = datetime(year, month, day, hour, minute, second)
                    time.append(temp_date)
                    temp_list = []
                    for i in range(7, altitude_count):
                        # 需要相对湿度还是绝对湿度？
                        temp_list.append(float(temp[i]))
                    hum_tem.append(temp_list)
                l = l + 1
        return time, altitude, hum_tem

    # 读取DDB3文件，获取其中的时间和气温、海温、相对湿度、风速、压强
    def ReadDDB3(self, filepath):
        conn = sqlite3.connect(filepath)
        c = conn.cursor()
        c.execute("SELECT Time,Temperature1,Humidity1,TemperatureSeaIR,Pressure,WinspeedR1 from 实时数据")
        result = c.fetchall()
        times = []
        dataset = []
        for i in range(len(result)):
            if (result[i][0] != None and result[i][1] != None and result[i][2] != None and result[i][3] != None and
                    result[i][4] != None and result[i][5] != None):
                times.append(result[i][0])
                dataset.append([result[i][1], result[i][3], result[i][2], result[i][5], result[i][4]])
        return times, dataset
