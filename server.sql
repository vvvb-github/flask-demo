/*
Navicat MySQL Data Transfer

Source Server         : server
Source Server Version : 80026
Source Host           : localhost:3306
Source Database       : server

Target Server Type    : MYSQL
Target Server Version : 80026
File Encoding         : 65001

Date: 2021-10-19 17:04:27
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for files
-- ----------------------------
DROP TABLE IF EXISTS `files`;
CREATE TABLE `files` (
  `filename` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `filetype` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `date` datetime NOT NULL,
  `subject` varchar(1023) DEFAULT NULL,
  `owner` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`filename`),
  KEY `owner` (`owner`) USING BTREE,
  CONSTRAINT `owner` FOREIGN KEY (`owner`) REFERENCES `user` (`account`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of files
-- ----------------------------
INSERT INTO `files` VALUES ('测试文件.txt', 'txt', '2021-09-28 11:51:44', '数据上传于2021-09-28-11-51-09', 'Wang');

-- ----------------------------
-- Table structure for info
-- ----------------------------
DROP TABLE IF EXISTS `info`;
CREATE TABLE `info` (
  `senderID` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `receiverID` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `keyID` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `sendDate` datetime NOT NULL,
  `content` varchar(1023) NOT NULL,
  `result` int NOT NULL,
  `remark` varchar(1023) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  PRIMARY KEY (`keyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of info
-- ----------------------------
INSERT INTO `info` VALUES ('Shen', 'Wang', '#0', '2021-01-06 10:49:38', '人员流失情况~', '2', '不详细', '人员信息');
INSERT INTO `info` VALUES ('Shen', 'Wang', '#1', '2021-01-06 15:22:22', '2134', '1', '', '人员信息');
INSERT INTO `info` VALUES ('Shen', 'Wang', '#3', '2021-01-06 15:29:24', '12421515', '0', '', '人员信息');
INSERT INTO `info` VALUES ('Shen', 'Wang', '#4', '2021-01-06 15:31:37', '135141 safd ', '0', '', '人员信息');
INSERT INTO `info` VALUES ('Shen', 'Wang', '#5', '2021-01-06 15:39:41', 'qwdscacac', '0', '', '人员信息');
INSERT INTO `info` VALUES ('Shen', 'Wang', '#6', '2021-01-06 15:40:27', '124sadasd', '0', '', '人员信息');
INSERT INTO `info` VALUES ('Shen', 'Wang', '#7', '2021-01-06 15:44:52', '25367qw', '0', '', '人员信息');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `account` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `emailAddress` varchar(255) DEFAULT NULL,
  `department` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `permission` int NOT NULL DEFAULT '0',
  `authorityLevel` varchar(255) NOT NULL,
  `status` int NOT NULL,
  `date` datetime NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `chosenFile` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('flandre', '测试用户1', '1919810', '114514@esu.com', 'Koumokan', '123', '1', '2', '0', '2020-12-07 16:23:20', null, null);
INSERT INTO `user` VALUES ('remilia', '测试用户2', '11451400000', '1919810@esu.com', 'Koumokan', '123', '1', '2', '0', '2020-12-01 16:23:24', null, null);
INSERT INTO `user` VALUES ('Shen', '神岑溪', '', '', '暂定', '123456', '0', '0', '0', '2021-01-05 21:12:44', '无', null);
INSERT INTO `user` VALUES ('Wang', '汪宇晖', '15207111970', '220191783@seu.edu.cn', '无', '123', '2', '2', '0', '2020-12-01 16:23:28', null, 'Ey3MsDSU8AU3577.jpg');
