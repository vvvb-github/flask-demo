import random
import json
import os


root_path = ''


# 设置项目根路径
def rootPath(app):
    global root_path
    root_path = app.root_path


# 处理自动气象站数据
def dealData(data):
    # 处理结果
    pass

    json = {
        'time': data['time'],
        'longitude': data['longitude'],
        'latitude': data['latitude'],
        'height': random.random()*300,
        'predict_height': random.random()*100-50
    }
    return json


# 修正大气指数
def atmModify():
    '''
    修正大气折射指数算法模拟为0-300m，0.5m为一次数据，一共记录600个数据进行传输，每个数据两个属性，分别是高度和修正折射指数
    :return:
    '''
    global root_path
    file = open(os.path.join(root_path, 'json', 'atm.json'), 'w', encoding='utf-8')
    atmData = []

    # modify修正值0——1
    for i in range(600):
        atmData.append({'height': 0.5*i, 'modify': random.random()})

    json.dump(atmData, file, indent=2, sort_keys=True, ensure_ascii=False)


# 电磁波传播损耗
def elecLoss():
    '''
    电磁波传播损耗算法模拟为0-300m，0.5m为一次数据，一共记录600个数据进行传输，每个数据三个属性，分别是，高度(m)，距离(km)，单程传播损失(db)
    :return:
    '''
    global root_path
    file = open(os.path.join(root_path, 'json', 'elec.json'), 'w', encoding='utf-8')
    elecData = []

    # distance距离0——10km，loss单程传播损失0——30dB
    for i in range(600):
        elecData.append({'height': i*0.5, 'distance': random.random()*10, 'loss': random.random()*30})

    json.dump(elecData, file, indent=2, sort_keys=True, ensure_ascii=False)


# 雷达探测损耗
def radarLoss():
    '''
    15m高度雷达探测损失（一段数据），100m高度雷达门限（一段数据）分别得到，距离（km）和电磁波传播损耗（dB），距离从100km到160km，0.5km为一次数
    据，记录120个数据，每个数据包含两个属性，分别是距离(km)和电磁波传播损耗(dB)
    :return:
    '''
    global root_path
    file = open(os.path.join(root_path, 'json', 'radar.json'), 'w', encoding='utf-8')
    radarData = []

    # loss电磁传播损耗0——30dB
    for i in range(120):
        radarData.append({'distance': 100+0.5*i, 'loss':random.random()*30})

    json.dump(radarData, file, indent=2, sort_keys=True, ensure_ascii=False)
