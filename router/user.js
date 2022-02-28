/**
 * 此文件负责存放客户端请求与路由的映射关系
 */
const express = require('express')
//创建路由对象
const router = express.Router()

//导入路由处理函数
const userHandler = require('../router_handler/user')

//
const expressJoi = require('@escook/express-joi')
//

//要获取schema的user.js的body的值 需要
const { reg_login_schema } = require('../schema/user')

//注册新用户
router.post('/reguser', expressJoi(reg_login_schema), userHandler.regUser)

//登录
router.post('/login', expressJoi(reg_login_schema), userHandler.login)

module.exports = router