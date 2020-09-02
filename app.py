from flask import Flask, request
from flask_cors import *
from flask_sqlalchemy import SQLAlchemy
from config import *

app = Flask(__name__)

# 解决跨域问题
CORS(app, supports_credentials=True)

# 设置数据库
app.config['SQLALCHEMY_DATABASE_URI'] = \
    'mysql+pymysql://'+mysql_user+':'+mysql_pass+'@'+mysql_host+':'+str(mysql_port)+'/'+mysql_name+'?charset=utf8'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

# 创建数据库对象
db = SQLAlchemy(app=app)
db.create_all()

# --------------------------------------------------- Entities ---------------------------------------------------------


class User(db.Model):
    # 表名
    __tablename__ = 'User'
    # 列对象
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(255))
    password = db.Column(db.String(255))

    # 构造函数
    def __init__(self, username, password):
        self.username = username
        self.password = password

    # 规定输出格式，debug用
    def __repr__(self):
        return '<User %r %r %r>' % (self.id, self.username, self.password)


# ----------------------------------------------------------------------------------------------------------------------


# --------------------------------------------------- API --------------------------------------------------------------


# GET请求demo
@app.route('/getdemo', methods=['GET'])
def get_demo():
    # 业务处理
    # get请求参数获取稍繁琐，不建议get请求携带参数，需要发送参数建议使用post请求
    # 返回json数据，在python中json对应dict
    json = {
        'status': True,
        'info': 'get请求成功！'
    }
    return json


# POST请求demo
@app.route('/postdemo', methods=['POST'])
def post_demo():
    # 业务处理
    print(request.form)
    # 返回json数据，在python中json对应dict
    json = {
        'info': '成功收到：' + request.form['info']
    }
    return json


# 测试数据库共一张表，表名为User，字段名分别为id, username, password

# 数据库增
@app.route('/newuser', methods=['POST'])
def new_user():
    username = request.form['username']
    password = request.form['password']
    user = User(username, password)
    db.session.add(user)
    db.session.commit()
    json = {
        'info': '添加用户' + username + '成功！'
    }
    return json


# 数据库删
@app.route('/deleteuser', methods=['POST'])
def delete_user():
    username = request.form['username']
    user = User.query.filter_by(username=username).first()
    db.session.delete(user)
    db.session.commit()
    json = {
        'info': '删除用户' + username + '成功'
    }
    return json


# 数据库查
@app.route('/selectuser', methods=['POST'])
def select_user():
    username = request.form['username']
    user = User.query.filter_by(username=username).first()
    json = {
        'username': user.username,
        'password': user.password
    }
    return json


# 数据库改
@app.route('/updateuser', methods=['POST'])
def update_user():
    username = request.form['username']
    newpass = request.form['password']
    user = User.query.filter_by(username=username).first()
    user.password = newpass
    db.session.commit()
    json = {
        'info': '修改用户' + username + '密码成功'
    }
    return json


# ----------------------------------------------------------------------------------------------------------------------


if __name__ == '__main__':
    app.run(debug=True)
