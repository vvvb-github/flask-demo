-- ---------------------User----------------------
-- --------------------用户表---------------------
-- account: varchar(255)  -- 账号 **主键**
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
    account varchar(255) not null,
    password varchar(255) not null,
    permission int not null default 0,
    registerTime datetime not null,
    nickname varchar(255) not null,
    identity varchar(255) not null,
    primary key (account)
);


-- ----------------------Diary----------------------
-- ------------------用户操作日志------------------
-- ID: varchar  -- 操作ID **主键**
-- operationTime: datetime  -- 操作时间
-- operatorAccount: varchar  -- 操作人帐号，外键关联User:account
-- operationRecord: text  -- 操作记录
-- -----------------------------------------------

create table Diary (
    ID varchar(255) not null,
    operationTime datetime not null,
    operatorAccount varchar(255) not null,
    operationRecord text not null,
    primary key (ID),
    foreign key (operatorAccount) references User(account)
);


-- --------------------Data------------------------
-- -----------------数据申报记录--------------------
-- ID: varchar  -- 申报ID **主键**
-- declareTime: datetime   -- 申报时间
-- examTime: datetime   -- 审批时间
-- declareAccount: varchar   -- 申报人帐号，外键关联User:account
-- examAccount: varchar  -- 审批人帐号
-- declareContent: text   -- 申报内容
-- ------------------------------------------------

create table Data (
    ID varchar(255) not null,
    declareTime datetime not null,
    examTime datetime not null,
    declareAccount varchar(255) not null,
    examAccount varchar(255) not null,
    declareContent text not null,
    primary key (ID),
    foreign key (declareAccount) references User(account)
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
-- predictHeight: float    -- 预测高度
-- ---------------------------------------------------

drop table if exists EW;
create table EW (
    time datetime not null,
    height float not null,
    longitude float not null,
    latitude float not null,
    predictHeight float not null,
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


-- ---------------------Page--------------------------
-- ------------------页面数据--------------------------
-- time: datetime   -- 时间 **主键**
-- longitude: float -- 经度
-- latitude: float  -- 纬度
-- temperature: float   -- 温度
-- humidity: float  -- 湿度
-- pressure: float  -- 压强
-- windSpeed: float -- 风速
-- ----------------------------------------------------

drop table if exists Page;
create table Page (
    time datetime not null,
    longitude float not null,
    latitude float not null,
    temperature float not null,
    humidity float not null,
    pressure float not null,
    windSpeed float not null,
    primary key (time)
);
