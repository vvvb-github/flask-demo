import random
import datetime
from flask import Flask, request, url_for, flash, session, send_file
from flask_cors import *
from sqlalchemy import or_
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename

from config import *
from datetime import *
from algorithm import api
from flask_socketio import *
from flask import render_template, redirect, abort
from flask_login import LoginManager, login_required, login_user, current_user, logout_user
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, PasswordField, validators, SubmitField
from wtforms.validators import DataRequired, EqualTo, InputRequired, Email
import time
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

# 设置上传文件夹
# 用户头像保存文件夹
app.config['AVATAR_FOLDER'] = '/static/assets/img/profiles'
# 数据上传文件夹
app.config['UPLOAD_FOLDER'] = '/upload'


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
    remark = db.Column(db.String(255))

    def __init__(self, account, name, phone_number, email_address, department, password, permission, authority_level,
                 status, date, remark):
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
        self.remark = remark

    def __repr__(self):
        return '<User %r %r %r %r %r %r %r %r %r %r>' % \
               (self.account, self.name, self.phoneNumber, self.emailAddress, self.department, self.password,
                self.permission, self.authorityLevel, self.status, self.remark)

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


class Files(db.Model):
    __tablename__ = 'files'  # 数据组表

    filename = db.Column(db.String(255), primary_key=True)
    filetype = db.Column(db.String(255))
    date = db.Column(db.DateTime)
    subject = db.Column(db.String(1023))
    owner = db.Column(db.String(255))

    def __init__(self, name, ftype, create_date, subject, owner):
        self.filename = name
        self.filetype = ftype
        self.date = create_date
        self.subject = subject
        self.owner = owner

    def __repr__(self):
        return '<Project %r %r %r %r %r' % \
               (self.filename, self.filetype, self.date, self.subject, self.owner)


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


class BasicMeteo(db.Model):
    __tablename__ = 'basic_meteo'  # 基本探空信息

    ID = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.DateTime)
    Temperature = db.Column(db.FLOAT)
    Press = db.Column(db.FLOAT)
    Wind = db.Column(db.FLOAT)
    Humidity = db.Column(db.FLOAT)
    Direction = db.Column(db.FLOAT)
    SST = db.Column(db.FLOAT)

    def __init__(self, id, basic_time, temperature, press, wind, humidity, direction, sst):
        self.ID = id
        self.time = basic_time
        self.Temperature = temperature
        self.Press = press
        self.Wind = wind
        self.Humidity = humidity
        self.Direction = direction
        self.SST = sst

    def __repr__(self):
        return '<BasicMeteo %r %r %r %r %r %r %r %r>' % \
               (self.ID, self.time, self.Temperature, self.Press, self.Wind, self.Humidity,
                self.Direction, self.SST)


class SeInfor(db.Model):
    __tablename__ = 'se_infor'  # 表面波导与悬空波导信息

    Id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.DateTime)
    surf_height = db.Column(db.FLOAT)
    surf_strength = db.Column(db.FLOAT)
    elev_bottom = db.Column(db.FLOAT)
    elev_top = db.Column(db.FLOAT)
    elev_strength = db.Column(db.FLOAT)

    def __init__(self, Id, meteo_time, surf_height, surf_strength, elev_bottom, elev_top, elev_strength):
        self.Id = Id
        self.time = meteo_time
        self.surf_height = surf_height
        self.surf_strength = surf_strength
        self.elev_top = elev_top
        self.elev_bottom = elev_bottom
        self.elev_strength = elev_strength

    def __repr__(self):
        return '<SeInfor %r %r %r %r %r %r %r>' % \
               (self.Id, self.time, self.surf_height, self.surf_strength, self.elev_bottom, self.elev_top,
                self.surf_strength)


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


# 获得当前用户信息
def get_current_user():
    user = {
        "name": current_user.name,
        "account": current_user.account,
        "emailAddress": current_user.emailAddress,
        "phoneNumber": current_user.phoneNumber,
        "department": current_user.department,
        "level": current_user.authorityLevel
    }
    return user


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


# 修改头像所用表单
class AvatarForm(FlaskForm):
    avatar = FileField(validators=[
        FileRequired(),
        FileAllowed(['jpg', 'png'], 'Images only!')
    ])


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


# 以下为get方法，获取静态页面
# 共包含六个不同的页面（登录、主页、表面波导悬空波导、用户管理、信息报表管理、个人资料（自己与他人））
# 登录页面(page)
@app.route('/')
@login_required
def direct_index():
    return redirect(url_for('index'))


# 默认主页逻辑(page)
@app.route('/index')
@login_required
def index_default():
    all_files = Files.query.order_by(Files.date.desc()).all()
    files = []
    for i in all_files:
        j = {
            'filename': i.filename,
            'filetype': i.filetype,
            'date': i.date.strftime("%Y-%m-%d %H:%M:%S"),
            'subject': i.subject,
            'owner': i.owner
        }
        files.append(j)
    user = get_current_user()
    print(files)
    return render_template('index.html', user=user, files=files, chart_data=None, current_file=None)


# 主页逻辑(page)
@app.route('/<filename>')
@login_required
def index(filename):
    user = get_current_user()
    # 声明主页图像所需要的数据Json
    chart_data = {
        # hpc 湿度廓线图
        'hpc_data': {
            'altitude': None,
            'humidity': None,
            'time': None,
        },
        # tpc 温度廓线图
        'tpc_data': {
            'altitude': None,
            'temperature': None,
            'time': None,
        },
        # 波导折线图
        'line_data': {
            'altitude': None,
            'time': None
        },
        # 波导柱形图
        'bar_data': {
            'bottom': None,
            'altitude': None,
        }
    }
    all_files = Files.query.order_by(Files.date.desc()).all()
    files = []
    for i in all_files:
        j = {
            'filename': i.filename,
            'filetype': i.filetype,
            'date': i.date.strftime("%Y-%m-%d %H:%M:%S"),
            'subject': i.subject,
            'owner': i.owner
        }
        files.append(j)

    temp_file = Files.query.filter_by(filename=filename).first()
    current_file = {
        'filename': temp_file.filename,
        'filetype': temp_file.filetype,
        'date': temp_file.date.strftime("%Y-%m-%d %H:%M:%S"),
        'subject': temp_file.subject,
        'owner': temp_file.owner
    }
    if current_file is not None:
        # 读取不同类型的文件
        pass
    else:
        return "没有该文件，请返回重试"
    return render_template('index.html', user=user, files=files, chart_data=chart_data, current_file=current_file)


# 表面波导与悬空波导界面（page）
# 需重写 现在还是随机数
@app.route('/surfaceevaporation')
@login_required
def surface_page():
    user = get_current_user()
    MeteoData = {
        "tem": random.random(),
        "hum": random.random(),
        "wind": random.random(),
        "press": random.random()
    }
    print("update")
    return render_template('surfaceevaporation.html', MeteoData=MeteoData, Refraction=[[1, random.random()],
                                                                                       [3, random.random()],
                                                                                       [5, random.random()],
                                                                                       [7, random.random()],
                                                                                       [9, random.random()]],
                           SD=[1, 3, 3],
                           ED=[2, 4, 8],
                           user=user,
                           word="update" + str(time.asctime(time.localtime(time.time()))))


# 个人资料界面（page）
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
    user = get_current_user()

    profile_form = EditProfileForm()
    password_form = EditPasswordForm()
    avatar_form = AvatarForm()
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
            return render_template('profile.html', user=user, profile_form=profile_form, password_form=password_form,
                                   avatar_form=avatar_form)
    else:
        if (bool(password_form.errors)) and (len(password_form.errors) != 2):
            flash("请检查重复输入的两次密码是否一致")
        print(password_form.errors)

    if avatar_form.validate_on_submit():
        filename = current_user.account + ".jpg"
        basedir = os.path.abspath(os.path.dirname(__file__))
        file_path = os.path.join(app.config['AVATAR_FOLDER'], filename)
        file_path = basedir + file_path
        file_path = file_path.replace('\\', '/')
        print(file_path)
        avatar_form.avatar.data.save(file_path)
        return redirect(url_for('profile_page'))
    else:
        if bool(avatar_form.errors):
            flash("文件格式不正确")

    return render_template('profile.html', user=user, profile_form=profile_form, password_form=password_form,
                           avatar_form=avatar_form)


# 他人用户界面(page)
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
    other_user = {
        "name": temp_user.name,
        "emailAddress": temp_user.emailAddress,
        "phoneNumber": temp_user.phoneNumber,
        "department": temp_user.department,
        "level": temp_level,
        "account": temp_user.account
    }
    user = get_current_user()
    if userID != current_user.account:
        return render_template('profile-other.html', other_user=other_user, user=user)
    else:
        return redirect(url_for('profile_page'))


# 数据组管理（文件管理）界面(project-management)
@app.route('/file-management')
@login_required
def file_management_page():
    user = get_current_user()
    all_files = Files.query.order_by(Files.date.desc()).all()
    files = []
    for i in all_files:
        j = {
            'filename': i.filename,
            'filetype': i.filetype,
            'date': i.date.strftime("%Y-%m-%d %H:%M:%S"),
            'subject': i.subject,
            'owner': i.owner
        }
        files.append(j)
    return render_template('file-management.html', files=files, user=user)


# 用户管理页面(page)
@app.route('/user-management', methods=['POST', 'GET'])
@login_required
def user_management_page():
    all_user = User.query.order_by(User.account.desc()).all()
    users = []
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
        users.append(j)
    user = get_current_user()
    return render_template('user-management.html', Users=users, user=user)


# 信息报表界面(page)
@app.route('/report')
@login_required
def report_page():
    report = Info.query.filter(
        or_(Info.receiverID == current_user.account, Info.senderID == current_user.account)).order_by(Info.keyID.desc())
    infos = []
    count = 0
    for i in report:
        sender_infor = User.query.filter_by(account=i.senderID).first()
        receiver_infor = User.query.filter_by(account=i.receiverID).first()
        j = {
            "sender_account": i.senderID,
            "receiver_account": i.receiverID,
            "sender_name": sender_infor.name,
            "receiver_name": receiver_infor.name,
            "KeyID": i.keyID,
            "sendData": i.sendDate,
            "subject": i.subject,
            "content": i.content,
            "result": i.result,
            "remark": i.remark
        }
        if i.result == 0:
            count += 1
        infos.append(j)
    user = get_current_user()
    print(infos)
    print(count)
    print(user)
    return render_template('report.html', Infor=infos, count=count, user=user)


# 登录逻辑(func&page)
@app.route('/login', methods=['POST', 'GET'])
def login():
    form = LoginForm()
    message = None
    if form.validate_on_submit():
        user_name = form.username.data
        print(user_name)
        pass_word = form.password.data
        print(pass_word)
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


# 以下方法可能为POST或直接重定向页面
# 登出逻辑(func)
@app.route('/logout')
@login_required
def logout():
    logout_user()
    if session.get('was_once_logged_in'):
        del session['was_once_logged_in']
    return redirect(url_for('login'))


# 上传文件(func)
@app.route('/upload', methods=["POST"])
@login_required
def upload_files():
    dataSubject = request.form['data-subject']
    fileData = request.files['file-data']

    tempType = fileData.filename.split(".")[-1]
    temp_file = Files.query.filter_by(filename=fileData.filename).first()
    if temp_file is not None and temp_file.filetype == tempType:
        return "文件名与文件类型重复，上传失败"

    basedir = os.path.abspath(os.path.dirname(__file__))
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], fileData.filename)
    file_path = basedir + file_path
    file_path = file_path.replace('\\', '/')
    fileData.save(file_path)

    db.session.add(Files(fileData.filename, tempType, time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()), dataSubject,
                         current_user.account))
    db.session.commit()
    return "上传成功"


# 下载文件(func)
@app.route('/download/<filename>', methods=["GET"])
@login_required
def download_file(filename):
    basedir = os.path.abspath(os.path.dirname(__file__))
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file_path = basedir + file_path
    file_path = file_path.replace('\\', '/')
    if os.path.isfile(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        temp_file = Files.query.filter_by(filename=filename).first()
        db.session.delete(temp_file)
        db.session.commit()
        return redirect(url_for('file_management_page'))


# 删除文件(func)
@app.route('/delete_file/<filename>', methods=["GET"])
@login_required
def delete_file(filename):
    basedir = os.path.abspath(os.path.dirname(__file__))
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file_path = basedir + file_path
    file_path = file_path.replace('\\', '/')
    if os.path.isfile(file_path):
        os.remove(file_path)
    temp_file = Files.query.filter_by(filename=filename).first()
    db.session.delete(temp_file)
    db.session.commit()
    return redirect(url_for('file_management_page'))


# 删除用户(func)
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


# 编辑用户(func)
@app.route('/user/edit', methods=['POST'])
@login_required
def edit_user():
    account = request.form['account']
    name = request.form['name']
    password = request.form['password']
    confirm = request.form['confirm']
    level = request.form['level']
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


# 添加用户(func)
@app.route('/user/add', methods=['POST', 'GET'])
@login_required
def add_user():
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
    account = request.form['account']
    name = request.form['name']
    password = request.form['password']
    confirm = request.form['confirm']
    level = request.form['level']
    date = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    remark = request.form['remark']
    print(account)
    print(name)
    print(password)
    print(date)
    print(remark)
    print(level)
    temp_user = User.query.filter_by(account=account).first()
    if temp_user is not None:
        flash("\"" + account + "\"：用户名已存在")
        return redirect(url_for('user_management_page'))
    else:
        if name == '':
            flash("用户名不能为空！")
            return redirect(url_for('user_management_page'))
        elif password == "" or len(password) < 6:
            flash("密码不能为空且不能小于6位！")
            return redirect(url_for('user_management_page'))
        elif confirm != password:
            flash("两次输入的密码不一致！")
            return redirect(url_for('user_management_page'))
        elif level == "":
            level = 1
        department = "暂定"
        if current_user.authorityLevel == 2:
            department = "暂定"
        elif current_user.authorityLevel == 1:
            department = current_user.department
        print(department)
        db.session.add(User(account, name, "", "", department, password, 0, level,
                            0, date, remark))
        db.session.commit()
        # def __init__(self, account, name, phone_number, email_address, department, password, permission,
        #              authority_level,
        #              status, date, remark):
        flash("新增用户成功！")
        return redirect(url_for('user_management_page'))


# 发送信息报表（func)
@app.route('/send_report', methods=['POST'])
@login_required
def send_report():
    user = {
        "name": current_user.name,
        "account": current_user.account,
    }
    sender_account = current_user.account
    receiver_account = request.form['receive']
    content = request.form['messages']
    subject = request.form['title']
    url_info = request.form['url_info']
    print(sender_account)
    print(receiver_account)
    print(content)
    print(subject)

    temp_user = User.query.filter_by(account=receiver_account).first()

    report_info = {
        "url_info": url_info,
        "valid": "error",
        "message": "接收人用户账号错误，请重新输入！",
    }
    if temp_user is None:
        return render_template('valid.html', Report_Info=report_info, user=user)
    else:
        print("receiver level:", temp_user.authorityLevel)
        if temp_user.authorityLevel < current_user.authorityLevel:
            report_info["message"] = "该用户无权限审批！"
            return render_template('valid.html', Report_Info=report_info, user=user)
        if temp_user.department != current_user.department and temp_user.authorityLevel != "2":
            report_info["message"] = "不隶属于该部门，该用户无权审批你的申请。"
            return render_template('valid.html', Report_Info=report_info, user=user)
        elif subject == "":
            report_info["message"] = "主题不能为空！"
            return render_template('valid.html', Report_Info=report_info, user=user)
        elif content == "":
            report_info["message"] = "内容不能为空！"
            return render_template('valid.html', Report_Info=report_info, user=user)
        num = Info.query.count()
        print("Infor:", num)
        Key_id = '#' + str(num)
        date = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        db.session.add(Info(Key_id, sender_account, receiver_account, date, 0, content, subject, ""))
        db.session.commit()
        report_info["valid"] = ""
        report_info["message"] = "信息申报提交成功"
        return render_template('valid.html', Report_Info=report_info, user=user)


# 通过信息报表(func)
@app.route('/report/pass/<reportID>')
@login_required
def pass_report(reportID):
    reportID = "#" + reportID
    print(reportID)
    current_report = Info.query.filter_by(keyID=reportID).first()
    if current_report is None:
        flash("请求对象不存在，请刷新后重试！")
    current_report.result = 1
    db.session.commit()
    # flash("操作成功")
    return redirect(url_for('report_page'))


# 拒绝信息报表(func)
@app.route('/report/reject', methods=['POST'])
@login_required
def reject_report():
    rejectID = request.form['reportID']
    print(rejectID)
    rejectReason = request.form['rejectReason']
    current_report = Info.query.filter_by(keyID=rejectID).first()
    if current_report is None:
        flash("请求对象不存在，请刷新后重试！")
    current_report.result = 2
    current_report.remark = rejectReason
    db.session.commit()
    # flash("操作成功")
    return redirect(url_for('report_page'))


# 删除信息报表(func)
@app.route('/report/delete/<reportID>')
@login_required
def delete_report(reportID):
    reportID = "#" + reportID
    current_report = Info.query.filter_by(keyID=reportID).first()
    if current_report is None:
        flash("请求对象不存在，请刷新后重试！")
    db.session.delete(current_report)
    db.session.commit()
    # flash("操作成功")
    return redirect(url_for('report_page'))


# ----------------------------------------------------------------------------------------------------------------------


# ------------------------------------------------------ API -----------------------------------------------------------


# 清空数据库
@app.route('/clearDB', methods=['GET'])
def clearDB():
    # 清空全部数据表
    clearTable(Diary)
    clearTable(Data)
    clearTable(User)
    db.session.commit()

    json = {
        'message': '成功清空数据库！'
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
    current_user.status = 0
    temp_user = User.query.filter_by(account=current_user.account).first()
    if temp_user is None:
        logout_user()
    else:
        temp_user.status = 0
        db.session.commit()
    print('断开连接：' + str(client_num))


# 客户端用户通告自己在线
# socket事件：客户端通告在线，并请求报表信息
# socket响应：获取当前于用户信息，并更新用户状态，并发送报表信息
@socket_io.on('online_info')
def user_status_update():
    current_user.status = 1
    temp_user = User.query.filter_by(account=current_user.account).first()
    if temp_user is None:
        logout_user()
    else:
        temp_user.status = 1
        db.session.commit()


# 客户端请求状态栏信息
# socket事件：用户切换页面，请求状态栏信息
# socket响应：获取当前用户信息，发送状态栏信息
@socket_io.on('state')
def send_state_information():
    report = Info.query.filter(
        or_(Info.receiverID == current_user.account, Info.senderID == current_user.account)).order_by(
        Info.sendDate.desc())
    infos = []
    infos_count = 4
    i = 1
    for r in report:
        temp = {
            'keyID': r.keyID,
            'senderID': r.senderID,
            'receiverID': r.receiverID,
            'sendDate': r.sendDate.strftime("%Y/%m/%d %H:%M:%S"),
            'result': r.result,
            'content': r.content,
            'subject': r.subject,
            'remark': r.remark
        }
        infos.append(temp)
        if i == infos_count:
            break
        i += 1
    emit('send_state', infos)


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


# socket异常处理
@socket_io.on_error_default
def default_error_handler(e):
    print(request.event['message'])
    print(request.event['args'])


# ----------------------------------------------------------------------------------------------------------------------


if __name__ == '__main__':
    api.rootPath(app)
    # 服务器地址可能更变
    socket_io.run(app, debug=True, host='0.0.0.0', port=8086)
