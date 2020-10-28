from time import sleep
from flask import Flask, request, url_for
from flask_cors import *
from flask_sqlalchemy import SQLAlchemy
from config import *
from datetime import *
from algorithm import api
from flask_socketio import *
from flask import render_template, redirect
from flask_login import LoginManager, login_required, login_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, EqualTo

app = Flask(__name__)

# 解决跨域问题
CORS(app, supports_credentials=True)

# 设置数据库
app.config['SQLALCHEMY_DATABASE_URI'] = \
    'mysql+pymysql://' + mysql_user + ':' + mysql_pass + '@' + mysql_host + ':' + str(
        mysql_port) + '/' + mysql_name + '?charset=utf8'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

# 创建数据库对象
db = SQLAlchemy(app=app)
db.create_all()

# 初始化socketIO
app.config['SECRET_KEY'] = 'secret!'
socket_io = SocketIO(app, cors_allowed_origins='*')


# --------------------------------------------------- Entities ---------------------------------------------------------


class User(db.Model):
    __tablename__ = 'User'  # 用户

    account = db.Column(db.String(255), primary_key=True)
    password = db.Column(db.String(255))
    permission = db.Column(db.Integer)
    registerTime = db.Column(db.DateTime)
    nickname = db.Column(db.String(255))
    identity = db.Column(db.String(255))

    def __init__(self, account, password, permission, register_time, nickname, identity):
        self.account = account
        self.password = password
        self.permission = permission
        self.registerTime = register_time
        self.nickname = nickname
        self.identity = identity

    def __repr__(self):
        return '<User %r %r %r %r %r %r>' % \
               (self.account, self.password, self.permission, self.registerTime, self.nickname, self.identity)

    # flask_login 需要的方法与接口

    # 用户是否通过验证
    def is_authenticated(self, password):
        if password == self.password:
            return True
        else:
            return False

    # 用户是否有权限
    def if_has_permission(self):
        if self.permission == 1:
            return True
        else:
            return False

    # 获得用户id
    def get_id(self):
        return self.identity


class Diary(db.Model):
    __tablename__ = 'Diary'  # 用户操作日志

    ID = db.Column(db.String(255), primary_key=True)
    operationTime = db.Column(db.DateTime)
    operatorAccount = db.Column(db.String(255), db.ForeignKey('User.account'))
    operationRecord = db.Column(db.Text)

    def __init__(self, id, operation_time, operator_account, operation_record):
        self.ID = id
        self.operationTime = operation_time
        self.operatorAccount = operator_account
        self.operationRecord = operation_record

    def __repr__(self):
        return '<Diary %r %r %r %r>' % \
               (self.ID, self.operationTime, self.operatorAccount, self.operationRecord)


class Data(db.Model):
    __tablename__ = 'Data'  # 数据申报记录

    ID = db.Column(db.String(255), primary_key=True)
    declareTime = db.Column(db.DateTime)
    examTime = db.Column(db.DateTime)
    declareAccount = db.Column(db.String(255), db.ForeignKey('User.account'))
    examAccount = db.Column(db.String(255))
    declareContent = db.Column(db.Text)

    def __init__(self, id, declare_time, exam_time, declare_account, exam_account, declare_content):
        self.ID = id
        self.declareTime = declare_time
        self.examTime = exam_time
        self.declareAccount = declare_account
        self.examAccount = exam_account
        self.declareContent = declare_content

    def __repr__(self):
        return '<Data %r %r %r %r %r %r>' % \
               (self.ID, self.declareTime, self.examTime, self.declareAccount, self.examAccount, self.declareContent)


class DW(db.Model):
    __tablename__ = 'DW'  # 悬空波导

    time = db.Column(db.DateTime, primary_key=True)
    height = db.Column(db.Float)
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)

    def __init__(self, time, height, longitude, latitude):
        self.time = time
        self.height = height
        self.longitude = longitude
        self.latitude = latitude

    def __repr__(self):
        return '<DW %r %r %r %r>' % (self.time, self.height, self.longitude, self.latitude)


class SW(db.Model):
    __tablename__ = 'SW'  # 表面波导

    time = db.Column(db.DateTime, primary_key=True)
    height = db.Column(db.Float)
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)

    def __init__(self, time, height, longitude, latitude):
        self.time = time
        self.height = height
        self.longitude = longitude
        self.latitude = latitude

    def __repr__(self):
        return '<SW %r %r %r %r>' % (self.time, self.height, self.longitude, self.latitude)


class EW(db.Model):
    __tablename__ = 'EW'  # 蒸发波导

    time = db.Column(db.DateTime, primary_key=True)
    height = db.Column(db.Float)
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    predictHeight = db.Column(db.Float)

    def __init__(self, time, height, longitude, latitude, predict_height):
        self.time = time
        self.height = height
        self.longitude = longitude
        self.latitude = latitude
        self.predictHeight = predict_height

    def __repr__(self):
        return '<EW %r %r %r %r %r>' % (self.time, self.height, self.longitude, self.latitude, self.predictHeight)


class AWS(db.Model):
    __tablename__ = 'AWS'  # 自动气象站数据

    time = db.Column(db.DateTime, primary_key=True)
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Float)
    pressure = db.Column(db.Float)
    windSpeed = db.Column(db.Float)

    def __init__(self, time, longitude, latitude, temperature, humidity, pressure, wind_speed):
        self.time = time
        self.longitude = longitude
        self.latitude = latitude
        self.temperature = temperature
        self.humidity = humidity
        self.pressure = pressure
        self.windSpeed = wind_speed

    def __repr__(self):
        return '<AWS %r %r %r %r %r %r %r>' % \
               (
                   self.time, self.longitude, self.latitude, self.temperature, self.humidity, self.pressure,
                   self.windSpeed)


class SB(db.Model):
    __tablename__ = 'SB'  # 探空气球

    time = db.Column(db.DateTime, primary_key=True)
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Float)
    pressure = db.Column(db.Float)
    windSpeed = db.Column(db.Float)

    def __init__(self, time, longitude, latitude, temperature, humidity, pressure, wind_speed):
        self.time = time
        self.longitude = longitude
        self.latitude = latitude
        self.temperature = temperature
        self.humidity = humidity
        self.pressure = pressure
        self.windSpeed = wind_speed

    def __repr__(self):
        return '<SB %r %r %r %r %r %r %r>' % \
               (
                   self.time, self.longitude, self.latitude, self.temperature, self.humidity, self.pressure,
                   self.windSpeed)


class MR(db.Model):
    __tablename__ = 'MR'  # 微波辐射器

    time = db.Column(db.DateTime, primary_key=True)
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Float)
    pressure = db.Column(db.Float)

    def __init__(self, time, longitude, latitude, temperature, humidity, pressure):
        self.time = time
        self.longitude = longitude
        self.latitude = latitude
        self.temperature = temperature
        self.humidity = humidity
        self.pressure = pressure

    def __repr__(self):
        return '<MR %r %r %r %r %r %r>' % \
               (self.time, self.longitude, self.latitude, self.temperature, self.humidity, self.pressure)


class Page(db.Model):
    __tablename__ = 'Page'  # 探空气球

    time = db.Column(db.DateTime, primary_key=True)
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Float)
    pressure = db.Column(db.Float)
    windSpeed = db.Column(db.Float)

    def __init__(self, time, longitude, latitude, temperature, humidity, pressure, wind_speed):
        self.time = time
        self.longitude = longitude
        self.latitude = latitude
        self.temperature = temperature
        self.humidity = humidity
        self.pressure = pressure
        self.windSpeed = wind_speed

    def __repr__(self):
        return '<Page %r %r %r %r %r %r %r>' % \
               (self.time, self.longitude, self.latitude, self.temperature, self.humidity, self.pressure, self.windSpeed)


# ----------------------------------------------------------------------------------------------------------------------


# --------------------------------------------- FUNCTIONS & VARIABLES --------------------------------------------------


client_num = 0  # 客户端socket连接数量
page_data = {
    'longitude': 0,
    'latitude': 0,
    'temperature': 0,
    'pressure': 0,
    'humidity': 0,
    'wind_speed': 0,
    'time': datetime.now()
}  # Page表数据


# 清空给定数据表
def clearTable(table):
    record_list = table.query
    for record in record_list:
        db.session.delete(record)


# 更新Page表
def updatePage(data: dict):
    global page_data
    keys = data.keys()
    # 大坑，这里keys必须按顺序，否则迭代对象会把遍历过的舍弃
    if 'temperature' in keys:
        page_data['temperature'] = data['temperature']
    if 'pressure' in keys:
        page_data['pressure'] = data['pressure']
    if 'humidity' in keys:
        page_data['humidity'] = data['humidity']
    if 'wind_speed' in keys:
        page_data['wind_speed'] = data['wind_speed']
    page_data['time'] = data['time']
    page_data['longitude'] = data['longitude']
    page_data['latitude'] = data['latitude']
    db.session.add(Page(page_data['time'], page_data['longitude'], page_data['latitude'], page_data['temperature']
                        , page_data['humidity'], page_data['pressure'], page_data['wind_speed']))
    return page_data


# ----------------------------------------------------------------------------------------------------------------------


# ------------------------------------------------------ PAGE & LOGIN --------------------------------------------------

# 创建一个模拟表
USERS = [
    {

    }
]


# 对表单进行定义
class LoginForm(FlaskForm):
    username = StringField('用户名', validators=[DataRequired()])
    password = PasswordField('密码', validators=[DataRequired()])


# 对登录管理对象的实例化
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'  # 若未登录将会重定向至login页面\


@login_manager.user_loader
def load_user(user_account):
    return [{
        "account": "remilia",
        "password": "123",
        "permission": 1,
    }]


# 登录页面
@app.route('/')
# @login_required
def index():
    return render_template('index.html')


# 登录逻辑
@app.route('/login', methods=['POST', 'GET'])
def login():
    form = LoginForm()
    message = None
    if form.validate_on_submit():
        user_name = form.username.data
        pass_word = form.password.data
        print(user_name)
        print(pass_word)
        if user_name == 'remilia':
            if pass_word == '123':
                login_user(User('remilia', '123', 1, None, None, None))
                return redirect(url_for('index'))
            else:
                message = "密码错误"
        else:
            message = "用户不存在"
    return render_template("login.html", message=message, form=form)


# ----------------------------------------------------------------------------------------------------------------------


# ------------------------------------------------------ API -----------------------------------------------------------


# 清空数据库
@app.route('/clearDB', methods=['GET'])
def clearDB():
    # 清空全部数据表
    clearTable(Diary)
    clearTable(Data)
    clearTable(User)
    clearTable(DW)
    clearTable(SW)
    clearTable(EW)
    clearTable(AWS)
    clearTable(SB)
    clearTable(MR)
    clearTable(Page)
    db.session.commit()

    json = {
        'message': '成功清空数据库！'
    }
    return json


# 接收新的自动气象站数据
@app.route('/aws', methods=['POST'])
def awsData():
    data = request.form

    # 更新Page并算法加工采集到的数据
    res = api.dealData(updatePage(data))
    api.atmModify()
    api.elecLoss()
    api.radarLoss()

    # 数据库存取
    db.session.add(AWS(data['time'], data['longitude'], data['latitude'], data['temperature'], data['humidity'],
                       data['pressure'], data['wind_speed']))
    db.session.add(EW(res['time'], res['height'], res['longitude'], res['latitude'], res['predict_height']))
    db.session.commit()

    # 传输数据

    json = {
        'message': '已处理新数据！'
    }
    return json


# 接收新的探空气球数据
@app.route('/sb', methods=['POST'])
def sbData():
    data = request.form

    # 更新Page并算法加工采集到的数据
    res = api.dealData(updatePage(data))
    api.atmModify()
    api.elecLoss()
    api.radarLoss()

    # 数据库存取
    db.session.add(AWS(data['time'], data['longitude'], data['latitude'], data['temperature'], data['humidity'],
                       data['pressure'], data['wind_speed']))
    db.session.add(EW(res['time'], res['height'], res['longitude'], res['latitude'], res['predict_height']))
    db.session.commit()

    # 传输数据

    json = {
        'message': '已处理新数据！'
    }
    return json


# 接收新的微波辐射器数据
@app.route('/mr', methods=['POST'])
def mrData():
    data = request.form

    # 更新Page并算法加工采集到的数据
    res = api.dealData(updatePage(data))
    api.atmModify()
    api.elecLoss()
    api.radarLoss()

    # 数据库存取
    db.session.add(AWS(data['time'], data['longitude'], data['latitude'], data['temperature'], data['humidity'],
                       data['pressure'], data['wind_speed']))
    db.session.add(EW(res['time'], res['height'], res['longitude'], res['latitude'], res['predict_height']))
    db.session.commit()

    # 传输数据

    json = {
        'message': '已处理新数据！'
    }
    return json


# 接收新的客户端连接
@socket_io.on('connect')
def connect():
    global client_num
    client_num += 1
    print('新的连接：' + str(client_num))


# 客户端断开连接
@socket_io.on('disconnect')
def disconnect():
    global client_num
    client_num -= 1
    print('断开连接：' + str(client_num))


# event test
@socket_io.on('event1')
def myEvent1(json):
    print('new data:' + str(json))
    emit('event1', json)


# index information
@socket_io.on('index')
def index_init():
    print('this is index, will send some information')
    this_data = [
        {
            'date': '2009/8/1 0:00',
            'tem': 20,
            'hum': 25,
            'wind': 26,
            'press': 27
        },
        {
            'date': '2009/8/1 1:00',
            'tem': 20,
            'hum': 25,
            'wind': 26,
            'press': 27
        },
        {
            'date': '2009/8/1 2:00',
            'tem': 20,
            'hum': 25,
            'wind': 26,
            'press': 27
        }
    ]
    emit('historical_data', this_data)
    while True:
        new_data = {
                'date': '2009/8/1 3:00',
                'tem': 20,
                'hum': 25,
                'wind': 26,
                'press': 27
         }
        print("---------------------new data--------------------")
        sleep(5)
        emit('new_data', new_data)


# socket异常处理
@socket_io.on_error_default
def default_error_handler(e):
    print(request.event['message'])
    print(request.event['args'])


# ----------------------------------------------------------------------------------------------------------------------


if __name__ == '__main__':
    api.rootPath(app)
    socket_io.run(app, debug=True, host='localhost', port=8085)
