-- ---------------------User----------------------
-- --------------------用户表---------------------
-- ID: int  -- 用户ID **主键**
-- account: varchar(255)  -- 账号
-- password: varchar(255)   -- 密码
-- permission: int   -- 权限
-- registerTime: datetime   -- 注册时间
-- nickname: varchar(255)   -- 用户名
-- identity: varchar(255)   -- 身份
-- -----------------------------------------------

drop table if exists Data;
drop table if exists Diary;
drop table if exists User;
create table User (
    ID int not null auto_increment,
    account varchar(255) not null,
    password varchar(255) not null,
    permission int not null default 0,
    registerTime datetime not null,
    nickname varchar(255) not null,
    identity varchar(255) not null,
    primary key (ID)
);


-- ----------------------Diary----------------------
-- ------------------用户操作日志------------------
-- ID: int  -- 操作ID **主键**
-- operationTime: datetime  -- 操作时间
-- operatorID: int  -- 操作人ID，外键关联User:ID
-- operationRecord: text  -- 操作记录
-- -----------------------------------------------

create table Diary (
    ID int not null auto_increment,
    operationTime datetime not null,
    operatorID int not null,
    operationRecord text not null,
    primary key (ID),
    foreign key (operatorID) references User(ID)
);


-- --------------------Data------------------------
-- -----------------数据申报记录--------------------
-- ID: int  -- 申报ID **主键**
-- declareTime: datetime   -- 申报时间
-- examTime: datetime   -- 审批时间
-- declareID: int   -- 申报人ID，外键关联User:ID
-- examID: int  -- 审批人ID
-- declareContent: text   -- 申报内容
-- ------------------------------------------------

create table Data (
    ID int not null auto_increment,
    declareTime datetime not null,
    examTime datetime not null,
    declareID int not null,
    examID int not null,
    declareContent text not null,
    primary key (ID),
    foreign key (declareID) references User(ID)
);


-- ----------------------DW---------------------------
-- --------------------悬空波导------------------------
-- time: datetime   -- 时间 **主键**
-- height: float    -- 高度
-- longitude: float -- 经度
-- latitude: float  -- 纬度
-- ---------------------------------------------------

drop table if exists DW;
create table DW (
    time datetime not null,
    height float not null,
    longitude float not null,
    latitude float not null,
    primary key (time)
);


-- ----------------------SW----------------------------
-- -------------------表面波导--------------------------
-- time: datetime   -- 时间 **主键**
-- height: float    -- 高度
-- longitude: float -- 经度
-- latitude: float  -- 纬度
-- ---------------------------------------------------

drop table if exists SW;
create table SW (
    time datetime not null,
    height float not null,
    longitude float not null,
    latitude float not null,
    primary key (time)
);


-- ----------------------EW----------------------------
-- -------------------蒸发波导--------------------------
-- time: datetime   -- 时间 **主键**
-- height: float    -- 高度
-- longitude: float -- 经度
-- latitude: float  -- 纬度
-- predictEps: float    -- 预测差
-- ---------------------------------------------------

drop table if exists SW;
create table SW (
    time datetime not null,
    height float not null,
    longitude float not null,
    latitude float not null,
    predictEps float not null,
    primary key (time)
);


-- ---------------------AWS----------------------------
-- -----------------自动气象站数据----------------------
-- time: datetime   -- 时间 **主键**
-- longitude: float -- 经度
-- latitude: float  -- 纬度
-- temperature: float   -- 温度
-- humidity: float  -- 湿度
-- pressure: float  -- 压强
-- windSpeed: float -- 风速
-- ----------------------------------------------------

drop table if exists AWS;
create table AWS (
    time datetime not null,
    longitude float not null,
    latitude float not null,
    temperature float not null,
    humidity float not null,
    pressure float not null,
    windSpeed float not null,
    primary key (time)
);


-- ---------------------SB----------------------------
-- ------------------探空气球--------------------------
-- time: datetime   -- 时间 **主键**
-- longitude: float -- 经度
-- latitude: float  -- 纬度
-- temperature: float   -- 温度
-- humidity: float  -- 湿度
-- pressure: float  -- 压强
-- windSpeed: float -- 风速
-- ----------------------------------------------------

drop table if exists SB;
create table SB (
    time datetime not null,
    longitude float not null,
    latitude float not null,
    temperature float not null,
    humidity float not null,
    pressure float not null,
    windSpeed float not null,
    primary key (time)
);


-- ---------------------MR----------------------------
-- -----------------微波辐射器-------------------------
-- time: datetime   -- 时间 **主键**
-- longitude: float -- 经度
-- latitude: float  -- 纬度
-- temperature: float   -- 温度
-- humidity: float  -- 湿度
-- pressure: float  -- 压强
-- ----------------------------------------------------

drop table if exists MR;
create table MR (
    time datetime not null,
    longitude float not null,
    latitude float not null,
    temperature float not null,
    humidity float not null,
    pressure float not null,
    primary key (time)
);
