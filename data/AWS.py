import requests
import time
import datetime
import random


class Param:
    def __init__(self, value, offset, min_val, max_val):
        self.value = value
        self.offset = offset
        self.min_val = min_val
        self.max_val = max_val

    def disturb(self):
        self.value = self.value + (random.random()*2-1)*self.offset
        if self.value < self.min_val:
            self.value = self.min_val
        if self.value > self.max_val:
            self.value = self.max_val
        return self.value


url = 'http://localhost:8085/'

longitude = Param(119, 0.5, 115, 125)  # 经度
latitude = Param(31, 0.5, 25, 35)  # 纬度
temperature = Param(19, 0.3, 15, 25)  # 温度
sea_temperature = Param(24, 0.3, 20, 30)  # 海温
pressure = Param(1015, 5, 1000, 1030)  # 压强
humidity = Param(90, 1, 80, 100)  # 相对湿度
wind_speed = Param(3, 0.3, 1, 5)  # 风速


# 生成数据
def generate_data():
    new_data = {
        'longitude': longitude.disturb(),
        'latitude': latitude.disturb(),
        'temperature': temperature.disturb(),
        'sea_temperature': sea_temperature.disturb(),
        'pressure': pressure.disturb(),
        'humidity': humidity.disturb(),
        'wind_speed': wind_speed.disturb(),
        'time': datetime.datetime.now()
    }
    return new_data


if __name__=='__main__':
    # 清空数据库
    # res = requests.get(url=url+'clearDB')
    # data = res.json()
    # print(data['message'])

    while True:
        # 模拟间隔一段时间，这里为1——5 s
        time.sleep(random.randint(1, 5))

        # post请求发送数据
        data = requests.post(url=url+'aws', data=generate_data()).json()
        print(data['message'])
