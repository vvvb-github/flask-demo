# FLASK后端

### 开发环境
- [PyCharm](https://www.jetbrains.com/pycharm/download/#section=windows) 比较推荐的IDE，插件多，项目配置等自动搭建，非常省事。专业版需要付费，但可以用edu邮箱注册可免费使用好几年。
- [Postman](https://www.postman.com/) 后端开发测试神器，可以模拟http请求用于测试后端API，官网注册账户即可免费使用，可以选择下载客户端也可直接使用网页版。
- [Navicat](https://www.yudouyudou.com/ziyuanxiazai/gongjuchajian/1474.html) 远程数据库连接工具，支持可视化编辑数据库，告别命令行。正版需付费，这里给出一篇破解版的博客，内含相关资源。

### 学习资料
- [Flask教程](https://www.w3cschool.cn/flask/flask_overview.html) w3Cschool教程，感觉还可。
- [SQLAlchemy](http://www.pythondoc.com/flask-sqlalchemy/quickstart.html) 一个flask对mysql数据库进行ORM封装的库，可以比较便捷得进行数据库操作。
- [Flask-SocketIO](https://flask-socketio.readthedocs.io/en/latest/) 基于flask的websocket通信库

### 开始
- **请执行以下命令安装相应模块**\
`pip install flask-sqlalchemy`\
`pip install flask-cors`\
`pip install pymysql`\
`pip install flask-socketio`\
`pip install gevent`\
`pip install gevent-websocket`
`pip install flask_login`
`pip install flask_wtf`
`pip install wtforms
- **项目结构说明**
```
-src
    - data      数据采集模拟
    - algorithm 算法模块
    - websocket_client_demo 一个websocket网页客户端实例
    - static    静态文件，通常用于存放网页文件，本项目作为纯后端不需要关注
    - template  模板文件，用于存放网页渲染模板，同样无需关注
    - venv      venv环境文件，无需关注
    - app.py    主要文件，未来所有代码将在这里编写
    - config.py 配置文件，进行数据库、服务器等相关参数配置
```
- **开发简要说明**

    开发主要工作在app.py中，分为两部分。一部分为在Entities区域中编写实体类，每个实体类对应一张数据库表；另一部分为在API区域中编写视图函数，用于响应前端各请求。
    
    开发具体细节请学习参考Flask教程和SQLALchemy文档
    


- **edit by wxy**

    登录模块数据库连接已经通畅，请使用用户名与密码"remilia""123"来进行登录；index的图表更新也基本完成，剩余就是继续填充其余页面的更新函数即可
  
- ************Dataset*************
    信息表（Info）
    发信人（senderID）、收信人（receiverID）、编号（KeyID）、日期（sendData）、内容（content）、结果（result：{0：未审核；1：已通过；2未通过}）、备注（remark）、主题（subject）

    用户表（User）
    账号（account）、名称（name）、电话号码（phoneNumber）、邮箱（emailAddress）、部门（department）、密码（password）、身份（permission：{0：普通用户；1：部门管理员；2：超级管理       员}）、级别（authirityLevel）、状态（status：{0：离线；1：在线}）

