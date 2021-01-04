import random
import datetime
from flask import Flask, request, url_for, flash, session, blueprints
from flask_cors import *
from sqlalchemy import or_
from flask_sqlalchemy import SQLAlchemy
from config import *
from datetime import *
from algorithm import api
from flask_socketio import *
from flask import render_template, redirect, abort
from flask_login import LoginManager, login_required, login_user, current_user, logout_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators
from wtforms.validators import DataRequired, EqualTo, InputRequired, Email
import json

app = Flask(__name__)

# 解决跨域问题
CORS(app, supports_credentials=True)

# 设置数据库
app.config['SQLALCHEMY_DATABASE_URI'] = \
    'mysql+pymysql://' + mysql_user + ':' + mysql_pass + '@' + mysql_host + ':' + str(
        mysql_port) + '/' + mysql_name + '?charset=utf8'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

# 缓存1秒，用来解决静态文件不刷新
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = timedelta(seconds=1)

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
    name = db.Column(db.String(255))
    phoneNumber = db.Column(db.String(255))
    emailAddress = db.Column(db.String(255))
    department = db.Column(db.String(255))
    password = db.Column(db.String(255))
    permission = db.Column(db.Integer)
    authorityLevel = db.Column(db.Integer)
    status = db.Column(db.Integer)
    date = db.Column(db.DateTime)

    def __init__(self, account, name, phone_number, email_address, department, password, permission, authority_level,
                 status, date):
        self.account = account
        self.name = name
        self.phoneNumber = phone_number
        self.emailAddress = email_address
        self.department = department
        self.password = password
        self.permission = permission
        self.authorityLevel = authority_level
        self.status = status
        self.date = date

    def __repr__(self):
        return '<User %r %r %r %r %r %r %r %r %r>' % \
               (self.account, self.name, self.phoneNumber, self.emailAddress, self.department, self.password,
                self.permission, self.authorityLevel, self.status)

    # flask-login 需要的方法，获得用户的主键
    def get_id(self):
        return self.account

    # flask-login 需要的方法，查看用户是否有权限
    def is_authenticated(self):
        if self.permission == 1:
            return True
        else:
            return False

    # flask-login 需要的方法，查看用户是否激活
    def is_active(self):
        return True

    # 登录需要的方法，校验密码
    def verify_password(self, password):
        if self.password != password:
            return False
        else:
            return True

    # 静态方法，flask-login需要的方法，从表中查找当前session中所在的用户（如果session为空则将此用户注册到session中）
    @staticmethod
    def get(user_account):
        if not user_account:
            return None
        query_result = User.query.filter_by(account=user_account).first()
        print(query_result)
        if query_result is not None:
            return query_result

    @staticmethod
    def get_user_byaccount(user_account):
        if not user_account:
            return None
        user_account = ".*" + user_account + "*"
        query_result = User.query.filter(User.account == user_account).all()
        print(query_result)


class Info(db.Model):
    __tablename__ = 'Info'  # 信息报表

    keyID = db.Column(db.String(255), primary_key=True)
    senderID = db.Column(db.String(255))
    receiverID = db.Column(db.String(255))
    sendDate = db.Column(db.DateTime)
    result = db.Column(db.Integer)
    content = db.Column(db.String(1023))
    subject = db.Column(db.String(255))
    remark = db.Column(db.String(1023))

    def __init__(self, key_id, sender_id, receiver_id, send_date, result_parm, content_parm, subject_parm, remark_parm):
        self.keyID = key_id
        self.senderID = sender_id
        self.receiverID = receiver_id
        self.sendDate = send_date
        self.result = result_parm
        self.content = content_parm
        self.subject = subject_parm
        self.remark = remark_parm

    def __repr__(self):
        return '<Info %r %r %r %r %r %r %r %r' % \
               (self.keyID, self.senderID, self.receiverID, self.sendDate, self.result, self.content,
                self.subject, self.remark)


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
               (self.time, self.longitude, self.latitude, self.temperature, self.humidity, self.pressure,
                self.windSpeed)


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


# 对表单进行定义
# 登录所用表单
class LoginForm(FlaskForm):
    username = StringField('用户名', validators=[DataRequired()])
    password = PasswordField('密码', validators=[DataRequired()])


# 修改个人信息所用表单
class EditProfileForm(FlaskForm):
    name = StringField('姓名', validators=[InputRequired()])
    emailAddress = StringField('邮件地址', validators=[Email()])
    phoneNumber = StringField('电话号码', validators=[InputRequired()])
    level = StringField('权限级别')
    department = StringField('隶属部门')


# 修改密码所用表单
class EditPasswordForm(FlaskForm):
    old_password = PasswordField('旧密码', validators=[InputRequired()])
    new_password = PasswordField('新密码', validators=[InputRequired()])
    repeat = PasswordField('重复密码', [validators.EqualTo('new_password', message="两次输入的密码不一致")])


class ManageSearchForm(FlaskForm):
    attribution = StringField('属性')
    content = StringField('内容')


# 对登录管理对象的实例化
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'  # 若未登录将会重定向至login页面


@login_manager.user_loader
def load_user(user_account):
    return User.get(user_account)


# 登录页面
@app.route('/')
@login_required
def direct_index():
    return render_template('index.html')


# 登录逻辑
@app.route('/login', methods=['POST', 'GET'])
def login():
    form = LoginForm()
    message = None
    if form.validate_on_submit():
        user_name = form.username.data
        pass_word = form.password.data
        temp_user = User.query.filter_by(account=user_name).first()
        if temp_user is not None:
            if temp_user.verify_password(pass_word) is True:
                temp_user.status = 1
                login_user(temp_user)
                print(current_user)
                return redirect(url_for('index'))
            else:
                message = "密码错误"
        else:
            message = "用户不存在"
    else:
        message = "请登录"
    return render_template("login.html", message=message, form=form)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    if session.get('was_once_logged_in'):
        del session['was_once_logged_in']
    return redirect(url_for('login'))


# 用户查询
@app.route('/user-management', methods=['POST', 'GET'])
@login_required
def user_management_page():
    all_user = User.query.order_by(User.account.desc()).all()
    Infor = []
    for i in all_user:
        j = {
            'account': i.account,
            'name': i.name,
            'phoneNumber': i.phoneNumber,
            'emailAddress': i.emailAddress,
            'department': i.department,
            'password': i.password,
            'permission': i.permission,
            'authorityLevel': i.authorityLevel,
            'status': i.status,
            'date': i.date.strftime("%Y-%m-%d %H:%M:%S")
        }
        Infor.append(j)
    print(Infor)
    return render_template('user-management.html', Infor=Infor)


# 删除用户
@app.route('/user/delete/<userID>')
@login_required
def delete_user(userID):
    temp_user = User.query.filter_by(account=userID).first()
    if temp_user is None:
        flash("用户未找到，请刷新重试")
        return redirect(url_for('user_management_page'))
    else:
        if temp_user.authorityLevel >= current_user.authorityLevel:
            flash("您的权限不够")
            return redirect(url_for('user_management_page'))
        else:
            db.session.delete(temp_user)
            db.session.commit()
    flash("删除成功")
    return redirect(url_for('user_management_page'))


# 编辑用户
@app.route('/user/edit', methods=['POST'])
@login_required
def edit_user():
    account = request.form['account']
    name = request.form['name']
    password = request.form['password']
    confirm = request.form['confirm']
    level = request.form['level']
    print(account)
    print(level)
    temp_user = User.query.filter_by(account=account).first()
    if temp_user is None:
        flash("用户未找到，请刷新重试")
        return redirect(url_for('user_management_page'))
    else:
        if temp_user.authorityLevel >= current_user.authorityLevel:
            flash("您的权限不够")
            return redirect(url_for('user_management_page'))
        else:
            temp_user.name = name
            temp_user.password = password
            temp_user.authorityLevel = level
            db.session.commit()
    flash("修改成功")
    return redirect(url_for('user_management_page'))




# 主页逻辑
@app.route('/index')
@login_required
def index():
    return render_template('index.html')


@app.route('/evaporation')
@login_required
def evaporation_page():
    return render_template('evaporation.html')


@app.route('/future-height')
@login_required
def futureheight_page():
    return render_template('futureheight.html')


@app.route('/surface-evaporation')
@login_required
def sufaceevaporation_page():
    return render_template('surfaceevaporation.html')


@app.route('/profile', methods=['POST', 'GET'])
@login_required
def profile_page():
    temp_level = None
    if current_user.authorityLevel == 0:
        temp_level = "普通用户"
    elif current_user.authorityLevel == 1:
        temp_level = "管理员"
    elif current_user.authorityLevel == 2:
        temp_level = "超级管理员"
    user = {
        "name": current_user.name,
        "emailAddress": current_user.emailAddress,
        "phoneNumber": current_user.phoneNumber,
        "department": current_user.department,
        "level": temp_level
    }

    profile_form = EditProfileForm()
    password_form = EditPasswordForm()
    if profile_form.validate_on_submit():
        current_user.name = profile_form.name.data
        current_user.emailAddress = profile_form.emailAddress.data
        current_user.phoneNumber = profile_form.phoneNumber.data
        temp = User.query.filter_by(account=current_user.account).first()
        temp.name = profile_form.name.data
        temp.emailAddress = profile_form.emailAddress.data
        temp.phoneNumber = profile_form.phoneNumber.data
        db.session.commit()
        print(User.query.filter_by(account=current_user.account).first())
        flash("修改成功")
        return redirect(url_for('profile_page'))
    else:
        if (bool(profile_form.errors)) and (len(profile_form.errors) != 3):
            flash("修改失败，请检查输入信息（如邮箱）格式后重试")
        print(profile_form.errors)

    if password_form.validate_on_submit():
        if current_user.verify_password(password_form.old_password.data) is True:
            current_user.password = password_form.new_password.data
            temp = User.query.filter_by(account=current_user.account).first()
            temp.password = password_form.new_password.data
            db.session.commit()
            print(User.query.filter_by(account=current_user.account).first())
            logout_user()
            return redirect(url_for('login', message="请重新登录"))
        else:
            flash("密码不正确")
            return render_template('profile.html', user=user, profile_form=profile_form, password_form=password_form)
    else:
        if (bool(password_form.errors)) and (len(password_form.errors) != 2):
            flash("请检查重复输入的两次密码是否一致")
        print(password_form.errors)

    return render_template('profile.html', user=user, profile_form=profile_form, password_form=password_form)


@app.route('/profile/<userID>')
@login_required
def other_profile_page(userID):
    temp_level = None
    temp_user = User.query.filter_by(account=userID).first()
    if temp_user is None:
        abort(404)
    if temp_user.authorityLevel == 0:
        temp_level = "普通用户"
    elif temp_user.authorityLevel == 1:
        temp_level = "管理员"
    elif temp_user.authorityLevel == 2:
        temp_level = "超级管理员"
    user = {
        "name": temp_user.name,
        "emailAddress": temp_user.emailAddress,
        "phoneNumber": temp_user.phoneNumber,
        "department": temp_user.department,
        "level": temp_level
    }
    if userID != current_user.account:
        return render_template('profile-other.html', user=user)
    else:
        return redirect(url_for('profile_page'))


@app.route('/report')
@login_required
def invoice_page():
    report = Info.query.filter(
        or_(Info.receiverID == current_user.account, Info.senderID == current_user.account)).order_by(Info.keyID.desc())
    infos = []
    for i in report:
        j = {
            "name": i.senderID,
            "KeyID": i.keyID,
            "sendData": i.sendDate,
            "subject": i.subject,
            "content": i.content,
            "result": i.result,
            "remark": i.remark
        }
        infos.append(j)
    print(infos)
    return render_template('report.html', Infor=infos)


@app.route('/report/pass/<reportID>')
@login_required
def pass_report(reportID):
    current_report = Info.query.filter_by(keyID=reportID).first()
    if current_report is None:
        flash("请求对象不存在，请刷新后重试！")
    current_report.result = 1
    db.session.commit()
    flash("操作成功")
    return redirect(url_for('invoice_page'))


@app.route('/report/reject', methods=['POST'])
@login_required
def reject_report():
    rejectID = request.form['reportID']
    rejectReason = request.form['rejectReason']
    current_report = Info.query.filter_by(keyID=rejectID).first()
    if current_report is None:
        flash("请求对象不存在，请刷新后重试！")
    current_report.result = 2
    current_report.remark = rejectReason
    db.session.commit()
    flash("操作成功")
    return redirect(url_for('invoice_page'))


@app.route('/report/delete/<reportID>')
@login_required
def delete_report(reportID):
    current_report = Info.query.filter_by(keyID=reportID).first()
    if current_report is None:
        flash("请求对象不存在，请刷新后重试！")
    db.session.delete(current_report)
    db.session.commit()
    flash("操作成功")
    return redirect(url_for('invoice_page'))


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
    db.session.add(SB(data['time'], data['longitude'], data['latitude'], data['temperature'], data['humidity'],
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
    db.session.add(MR(data['time'], data['longitude'], data['latitude'], data['temperature'], data['humidity'],
                      data['pressure']))
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


# 客户端用户通告自己在线
# socket事件：客户端通告在线，并请求报表信息
# socket响应：获取当前于用户信息，并更新用户状态，并发送报表信息
@socket_io.on('info')
def user_status_update():
    current_user.status = 1


# socket事件：新的客户端切换页面至主页
# socket响应：建立连接并发送主表历史数据至客户端
# 参数：历史数据的多少 historical_index_data_count
@socket_io.on('index')
def index_init():
    historical_index_data_count = 80
    global upper_page_data
    # 按照时间先后排序，选择最近的 count 个数据
    temp_data = Page.query.order_by(Page.time.desc()).limit(historical_index_data_count).all()
    this_data = []
    i = 1
    while i <= historical_index_data_count:  # 按照时间递增顺序传递数据（倒序赋值）
        this_data.append({
            'time': temp_data[historical_index_data_count - i].time.strftime("%Y/%m/%d %H:%M:%S"),
            'tem': temp_data[historical_index_data_count - i].temperature,
            'hum': temp_data[historical_index_data_count - i].humidity,
            'wind': temp_data[historical_index_data_count - i].windSpeed,
            'press': temp_data[historical_index_data_count - i].pressure,
            'direction': random.randint(100, 300)
        })
        i = i + 1
    emit('historical_index_data', this_data)


# socket事件：客户端请求新"主页"数据
# socket响应：发送最新的一条数据至客户端，无论数据库是否更新
@socket_io.on('request_index_data')
def send_new_index_data():
    current = Page.query.order_by(Page.time.desc()).first()  # 选择最新的一条数据
    # 此处将判断数据库最新数据是否更新的逻辑转移到了客户端，服务端只需拿到数据库最新的一条数据发过去即可
    new_data = {
        'time': current.time.strftime("%Y/%m/%d %H:%M:%S"),
        'tem': current.temperature,
        'hum': current.humidity,
        'wind': current.windSpeed,
        'press': current.pressure,
        'direction': random.randint(100, 300)
    }
    print("page table has an update,will send new data to client")
    emit('new_index_data', new_data)


# socket事件：客户端切换页面至"蒸发波导诊断(evaporation)"
# socket响应：发送最新的一则主表数据至客户端，并同时发送蒸发波导的历史数据至客户端
# 参数：历史数据的多少 historical_evp_data_count
# 对应DB表格：EW
@socket_io.on('evaporation')
def evaporation_init():
    historical_evp_data_count = 50


# socket事件：客户端请求新"蒸发波导诊断"数据
# socket响应：发送最新的一条蒸发波导高度数据至客户端，同时附带有最新的Page表数据，至于是否更新视图，交给客户端判断
# 对应DB表格：EW（仅发送实际值）
@socket_io.on('request_evp_data')
def send_new_evp_data():
    # 填充
    a = 20


# socket事件：客户端切换页面至"表面波导与悬空波导诊断(surface-evaporation)"
# socket响应：发送最新的一则主表数据至客户端，并同时发送表面波导与悬空波导的历史数据至客户端
# 参数：历史数据量 historical_sfe_data_count
# 对应DB表格：DW与SW
@socket_io.on('surface_evaporation')
def surface_evp_init():
    historical_sfe_data_count = 50


# socket事件：客户端请求新"表面波导与悬空波导诊断"数据
# socket响应：发送最新的一条表面波导数据至客户端，同时附带有最新的Page表数据，至于是否更新视图，交给客户端判断
# 对应DB表格:DW与SW
@socket_io.on('request_sfe_data')
def send_new_sfe_data():
    # 填充
    a = 20


# socket事件：客户端切换页面至"未来波导高度预测(future-height-prediction)"
# socket响应：发送最新的一则主表数据至客户端，并同时发送"蒸发波导"的预测信息
# 参数：历史数据量 historical_fhp_data_count
# 对应DB表格：EW（发送实际值与预测值）
@socket_io.on('future_height_prediction')
def fhp_init():
    historical_fhp_data_count = 50


# socket事件：客户端请求新"蒸发波导"预测数据
# socket响应：发送最新的一条蒸发波导预测数据与实际数据至客户端，同时附带有最新的Page表数据，至于是否更新视图，交给客户端判断
# 对应DB表格:EW（发送实际值与预测值）
@socket_io.on('request_fhp_data')
def send_new_fhp_data():
    # 填充
    a = 20


# socket事件：客户端切换页面至"电磁波传播损耗计算(electromagnetic)"
# socket响应：发送存储在js文件内的一组数据至客户端，客户端负责更新表格
# 此处有一个问题：事件模型最好使用轮询的方式，但是socket无法维护具体某一个客户端，无法知道某个客户端拥有的是旧数据还是新数据
# 设想的解决方案：客户端每次轮询时会顺便将自己所拥有信息的时间戳发送过来，服务端判断客户端时间戳就知道是否应该回复此条信息
# 使用此方法可以防止每次都要传输完整的一组数据，节省流量
# 对应js文件：elec.json
@socket_io.on('request_ele_data')
def send_new_ele_data(client_time):
    # 填充
    print(client_time)


# socket异常处理
@socket_io.on_error_default
def default_error_handler(e):
    print(request.event['message'])
    print(request.event['args'])


# ----------------------------------------------------------------------------------------------------------------------


if __name__ == '__main__':
    api.rootPath(app)
    socket_io.run(app, debug=True, host='10.201.255.10', port=8085)
