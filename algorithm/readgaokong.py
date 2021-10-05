from math import exp

import numpy as np
from scipy.interpolate import interp1d


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


def smooth(a, WSZ=5):
    # a: NumPy 1-D array containing the data to be smoothed
    # WSZ: smoothing window size needs, which must be odd number,
    # as in the original MATLAB implementation
    a = np.array(a).flatten()
    out0 = np.convolve(a, np.ones(WSZ, dtype=int), 'valid') / WSZ
    r = np.arange(1, WSZ - 1, 2)
    start = np.cumsum(a[:WSZ - 1])[::2] / r
    stop = (np.cumsum(a[:-WSZ:-1])[::2] / r)[::-1]
    return np.concatenate((start, out0, stop))


def xuankong(array, H):
    xuankong = np.zeros(shape=8)
    MM = smooth(array)
    a = np.diff(MM)
    for i in range(3, 154):
        if a[i] < 0 and a[i + 1] < 0 and a[i + 2] < 0 and a[i - 1] > 0 and a[i - 2] > 0 and a[i - 3] > 0 and (
                a[i] + a[i + 1] + a[i + 2]) < -3:
            for ii in range(i + 1, 154):
                if a[ii] > 0 and MM[ii] > MM[0]:
                    xuankong[0] = 1  # 表示发生了悬空波导
                    xuankong[1] = MM[0]  # 波导最低处的M值
                    xuankong[2] = MM[ii]  # 波导顶高度处的M值
                    xuankong[3] = MM[i]  # 波导底高度出的M值
                    xuankong[4] = H[ii]  # 波导顶高度
                    xuankong[5] = H[i]  # 波导底高度
                    xuankong[6] = abs(xuankong[3] - xuankong[2])  # 波导强度
                    xuankong[7] = abs(xuankong[5] - xuankong[4])  # 波导厚度
                    break
            break
    xuankong = xuankong.reshape((-1, 1))
    return xuankong


# 判断表面波导
def biaomian(array, H):
    biaomian = np.zeros(shape=5)
    MM = smooth(array)
    a = np.diff(MM)
    for i in range(0, 16):
        if a[0] < -3:
            for ii in range(1, 17):
                if a[ii] > 0:
                    biaomian[0] = 1  # 表示发生了表面波导
                    biaomian[1] = MM[0]  # 波导最低处的M值
                    biaomian[2] = MM[ii]  # 波导顶高度出的M值
                    biaomian[3] = H[ii]  # 波导顶高度，对于表面波导，波导顶高度即为波导厚度
                    biaomian[4] = abs(biaomian[2] - biaomian[1])  # 波导强度
                    break
            break
    biaomian = biaomian.reshape((-1, 1))
    return biaomian


def xk_bmM(ref, h, engine=None):
    x_m = xuankong(ref, h)
    b_m = biaomian(ref, h)
    if ((x_m[0] != 0) & (b_m[0] != 0)):
        return x_m, b_m
    elif ((x_m[0] != 0) & (b_m[0] == 0)):
        return x_m, []
    elif ((x_m[0] == 0) & (b_m[0] != 0)):
        return [], b_m
    else:
        return [], []


def Interplot(data, start=50, end=3000, nums=296, kind="cubic"):
    data = np.array(data)
    newdata = []
    xnew = np.linspace(start, end, nums, endpoint=True)
    newdata.append(xnew)
    for i in range(data.shape[1]):
        if i == 0:
            continue
        line = interp1d(data[:, 0], data[:, i], kind=kind)
        ynew = line(xnew)
        newdata.append(ynew)
    data = np.array(newdata).transpose()
    return data


# p气压 t温度，shidu相对湿度，z高度,计算得到某一高度的大气折射率
def zheshelv(t, p, shidu, z):
    # e为饱和水汽压
    e = 6.112 * exp(17.67 * t / (t + 243.5))
    e = e * shidu
    M = 77.6 * p / t + 3.73 * pow(10, 5) * e / (t * t) + 0.157 * z
    return M.real


# 输入data，生成其他算法需要的廓线和高度数据
# axis = [Temp, Press, Hum, H]
def generate_data(data, axis=[1, 2, 3, 0]):
    # data=np.load('gaokong.npy')
    h = np.zeros((data.shape[0], 1))
    ref = np.zeros((data.shape[0], 1))
    for i in range(0, data.shape[0]):
        h[i][0] = data[i][axis[3]]
        ref[i][0] = zheshelv(data[i][axis[0]], data[i][axis[1]], data[i][axis[2]], data[i][axis[3]])
    return ref, h


def generate_interpolation_data(dataset, nums=299, kind="cubic"):
    start = dataset[0][0]
    end = dataset[len(dataset) - 1][0]
    # print(start)
    data = Interplot(dataset, start, end, nums, kind)
    ref, h = generate_data(data)
    return ref, h


def readgaokong(dataset):
    ref, h = generate_interpolation_data(dataset)
    xk, bm = xk_bmM(ref, h)
    return xk, bm


def ReadGaokong1(filepath, limit=3000):
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
                dataset.append([altitude, temperature, press, humidity, wind, direction])
            l = l + 1
    xk, bm = readgaokong(dataset)
    return xk, bm


# 高空数据文件夹2
def ReadGaokong2(filepath, limit=3000):
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
                dataset.append([altitude, temperature, press, humidity, wind, direction])
            l = l + 1
    xk, bm = readgaokong(dataset)
    return xk, bm


def ReadGaokong3(filepath, limit=3000):
    dataset = []
    l = 0
    with open(filepath, "r", encoding='utf-8') as f:
        for line in f.readlines():
            line = line.strip('\n')

            if (l >= 3):
                temp = line.split()
                if is_number(temp[1]) and is_number(temp[2]) and is_number(temp[3]) and is_number(temp[5]):
                    temperature = float(temp[1])
                    press = float(temp[3])
                    humidity = float(temp[2])
                    altitude = float(temp[5])
                    if altitude > limit:
                        break
                    dataset.append([altitude, temperature, press, humidity])
            l = l + 1
    xk, bm = readgaokong(dataset)
    return xk, bm
