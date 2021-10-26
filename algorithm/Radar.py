#!/usr/bin/env python 
# -*- coding:utf-8 -*-
import time
import math
import os

basedir = os.path.abspath(os.path.dirname(__file__))
radar_path = os.path.join(basedir, os.path.pardir)
radar_path = os.path.join(radar_path, "radar_infor.txt")
radar_path.replace('\\', '/')

class Radar_Coe():
    # 雷达频率8000
    radar_fre = 8000
    # 雷达峰值频率160
    radar_top = 160
    # 天线高度 25 m
    antenna_high = 25
    # 天线增益30
    antenna_gain = 30
    # 波束宽度1.3
    beam_width = 1.3
    # 发射仰角1.5
    launch_ele = 1.5
    # 最小信噪比0-15.5
    min_noise = 12
    # 接收机带宽 85
    rec_width = 85
    # 系统综合损耗3.5
    sys_loss = 3.5
    # 接收机噪声系数14
    noise_coe = 14
    # 目标高度
    target_high = ""
    # 目标散射截面 200 - 1000
    rcs_radar = 300
    # 当前更新的时间
    this_time = ""
    # 保存LossFlag值
    LossFlag = None
    # 当前值是否可以用于计算雷达传播
    def __init__(self):
        radar_his = []
        with open(radar_path, "r") as f:
            for line in f.readlines():
                radar_his = line.strip("\n")
                radar_his = radar_his.split()
            f.close()
        if len(radar_his) != 0:
            self.radar_fre = float(radar_his[0])
            self.radar_top = float(radar_his[1])
            self.antenna_high = float(radar_his[2])
            self.antenna_gain = float(radar_his[3])
            self.beam_width = float(radar_his[4])
            self.launch_ele = float(radar_his[5])
            self.min_noise = float(radar_his[6])
            self.rec_width = float(radar_his[7])
            self.sys_loss = float(radar_his[8])
            self.noise_coe = float(radar_his[9])
            self.target_high = float(radar_his[10])
            self.rcs_radar = float(radar_his[11])
            self.this_time = radar_his[12]
            self.FLAG = True
            # 保存LossFlag值
            self.loss_cal()
    def updata(self, RF="", RT="", AH="", AG="", BW="", LE="",
               MN="", RW="", SL="", NC="", TH="", RR=""):
        if RF != "":
            self.radar_fre = RF
        if RT != "":
            self.radar_top = RT
        if AH != "":
            self.antenna_high = AH
        if AG != "":
            self.antenna_gain = AG
        if BW != "":
            self.beam_width = BW
        if LE != "":
            self.launch_ele = LE
        if MN != "":
            self.min_noise = MN
        if RW != "":
            self.rec_width = RW
        if SL != "":
            self.sys_loss = SL
        if NC != "":
            self.noise_coe = NC
        if TH != "":
            self.target_high = TH
        if RR != "":
            self.rcs_radar = RR
        self.this_time = time.strftime("%Y-%m-%d,%H:%M:%S")
        self.loss_cal()
        radar_now = [str(self.radar_fre), str(self.radar_top), str(self.antenna_high), str(self.antenna_gain), str(self.beam_width), str(self.launch_ele), str(self.min_noise),
                     str(self.rec_width), str(self.sys_loss), str(self.noise_coe), str(self.target_high), str(self.rcs_radar), str(self.this_time)]
        radar_now = " ".join(radar_now)
        with open("radar_infor.txt", "w") as f:
            f.writelines(radar_now)
            f.close()

    def get(self):
        radar_coefficients = {
            'RF': self.radar_fre,
            'RT': self.radar_top,
            'AH': self.antenna_high,
            'AG': self.antenna_gain,
            'BW': self.beam_width,
            'LE': self.launch_ele,
            'MN': self.min_noise,
            'RW': self.rec_width,
            'SL': self.sys_loss,
            'NC': self.noise_coe,
            'TH': self.target_high,
            'RR': self.rcs_radar,
            'TT': self.this_time
        }
        return radar_coefficients

    def loss_cal(self):
        if self.FLAG:
            Lossflag = 135.43 + 10 * math.log10(
            float(self.radar_top) * float(self.rcs_radar) * float(self.radar_fre) * float(self.radar_fre)) - 10 * math.log10(float(self.rec_width)) + 2 * float(
            self.antenna_gain) - float(self.sys_loss) - float(self.noise_coe) - 10 * math.log10(float(self.min_noise))
            self.Lossflag = Lossflag * 0.5
        else:
            self.LossFlag = None


if __name__ == "__main__":
    R = Radar_Coe()
    print(R.Lossflag)