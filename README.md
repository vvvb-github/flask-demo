# FLASK后端

### 开发环境
- [PyCharm](https://www.jetbrains.com/pycharm/download/#section=windows) 比较推荐的IDE，插件多，项目配置等自动搭建，非常省事。专业版需要付费，但可以用edu邮箱注册可免费使用好几年。
- [Postman](https://www.postman.com/) 后端开发测试神器，可以模拟http请求用于测试后端API，官网注册账户即可免费使用，可以选择下载客户端也可直接使用网页版。
- [Navicat](https://www.yudouyudou.com/ziyuanxiazai/gongjuchajian/1474.html) 远程数据库连接工具，支持可视化编辑数据库，告别命令行。正版需付费，这里给出一篇破解版的博客，内含相关资源。

### 学习资料
- [Flask教程](https://www.w3cschool.cn/flask/flask_overview.html) w3Cschool教程，感觉还可。
- [SQLAlchemy](http://www.pythondoc.com/flask-sqlalchemy/quickstart.html) 一个flask对mysql数据库进行ORM封装的库，可以比较便捷得进行数据库操作。

### 开始
- **请执行以下命令安装相应模块**\
`pip install flask-sqlalchemy`\
`pip install flask-cors`\
`pip install pymysql`
- **项目结构说明**
```
-src
    - static    静态文件，通常用于存放网页文件，本项目作为纯后端不需要关注
    - template  模板文件，用于存放网页渲染模板，同样无需关注
    - venv      venv环境文件，无需关注
    - app.py    主要文件，未来所有代码将在这里编写
    - config.py 配置文件，进行数据库、服务器等相关参数配置
```
- **开发简要说明**

    开发主要工作在app.py中，分为两部分。一部分为在Entities区域中编写实体类，每个实体类对应一张数据库表；另一部分为在API区域中编写视图函数，用于响应前端各请求。
    
    开发具体细节请学习参考Flask教程和SQLALchemy文档
