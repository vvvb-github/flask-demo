import numpy as np
from cmath import exp

#实现python对悬空表面波导诊断
#p气压 t温度，shidu相对湿度，z高度,计算得到某一高度的大气折射率
# def zheshelv(t,p,shidu,z):
#     #e为饱和水汽压
#     e=6.112*exp(17.67*t/(t+243.5))
#     e=e*shidu
#     M=77.6*p/t+3.73*pow(10,5)*e/(t*t)+0.157*z
#     return M.real
#p气压 t温度，shidu相对湿度，z高度,计算得到某一高度的大气折射率
def zheshelv(t,p,shidu,z):
    #e为饱和水汽压
    e=6.112*exp(17.67*t/(t+243.5))
    e=e*shidu
    M=77.6*p/t+3.73*pow(10,5)*e/(t*t)+0.157*z
    return M.real

#输入data，生成其他算法需要的廓线和高度数据
def generate_data(data):
# data=np.load('gaokong.npy')
    h=np.zeros((data.shape[0],1))
    ref=np.zeros((data.shape[0],1))
    for i in range(0,data.shape[0]):
        h[i][0]=data[i][0]
        ref[i][0]=zheshelv(data[i][1],data[i][2],data[i][4],data[i][0])
    return ref,h

# data=np.load('gaokong.npy')
# # print(type(data))
# print(data.shape[0])
# h=np.zeros((data.shape[0],1))
# ref=np.zeros((data.shape[0],1))
# for i in range(0,data.shape[0]):
#     h[i][0]=data[i][0]
#     ref[i][0]=zheshelv(data[i][1],data[i][2],data[i][4],data[i][0])


# def smooth(a):
#     out = np.zeros((a.shape[0]))
#     for i in range(0,a.shape[0]):
#         if i==0:
#             out[i]=a[i]
#         elif i==1:
#             out[i]=(a[0]+a[1]+a[2])/3
#         elif(i==a.shape[0]-1):
#             out[i]=a[i]
#         elif(i==a.shape[0]-2):
#             out[i] = (a[i-1] + a[i] + a[i+1]) / 3
#         else:
#             out[i]=(a[i-2]+a[i-1]+a[i]+a[i+1]+a[i+2])/5
#     return out
def smooth(a,WSZ=5):
    # a: NumPy 1-D array containing the data to be smoothed
    # WSZ: smoothing window size needs, which must be odd number,
    # as in the original MATLAB implementation
    a = np.array(a).flatten()
    out0 = np.convolve(a,np.ones(WSZ,dtype=int),'valid')/WSZ
    r = np.arange(1,WSZ-1,2)
    start = np.cumsum(a[:WSZ-1])[::2]/r
    stop = (np.cumsum(a[:-WSZ:-1])[::2]/r)[::-1]
    return np.concatenate((  start , out0, stop  ))

# def diff(a):
#     out = np.zeros((a.shape[0] - 1))
#     for i in range(0,a.shape[0]-1):
#         out[i]=a[i+1]-a[i]
#     return out
#判断悬空波导
def xuankong(array,H):
    xuankong=np.zeros(shape=8)
    MM=smooth(array)
    a=np.diff(MM)
    for i in range(3,154):
        if a[i]<0 and a[i+1]<0 and a[i+2]<0 and a[i-1]>0 and a[i-2]>0 and a[i-3]>0 and (a[i]+a[i+1]+a[i+2])<-3:
            for ii in range(i+1,154):
                if a[ii]>0 and MM[ii]>MM[0]:
                    xuankong[0]=1#表示发生了悬空波导
                    xuankong[1]=MM[0]#波导最低处的M值
                    xuankong[2]=MM[ii]#波导顶高度处的M值
                    xuankong[3]=MM[i]#波导底高度出的M值
                    xuankong[4]=H[ii]#波导顶高度
                    xuankong[5]=H[i]#波导底高度
                    xuankong[6]=abs(xuankong[3]-xuankong[2])#波导强度
                    xuankong[7]=abs(xuankong[5]-xuankong[4])#波导厚度
                    break
            break
    xuankong=xuankong.reshape((-1, 1))
    return xuankong

#判断表面波导
def biaomian(array,H):
    biaomian=np.zeros(shape=5)
    MM=smooth(array)
    a=np.diff(MM)
    for i in range(0,16):
        if a[0] < -3:
            for ii in range(1,17):
                if a[ii]>0:
                    biaomian[0] = 1#表示发生了表面波导
                    biaomian[1]=MM[0]#波导最低处的M值
                    biaomian[2]=MM[ii]#波导顶高度出的M值
                    biaomian[3]=H[ii]#波导顶高度，对于表面波导，波导顶高度即为波导厚度
                    biaomian[4]=abs(biaomian[2]-biaomian[1])#波导强度
                    break
            break
    biaomian=biaomian.reshape((-1, 1))
    return biaomian

if __name__ == "__main__":
    data = np.load("../data/gaokong.npy")
    ref,h=generate_data(data)
    x_M = xuankong(ref, h)
    b_M = biaomian(ref, h)
    print(x_M)
    print(b_M)