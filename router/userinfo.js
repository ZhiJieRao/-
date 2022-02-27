/**
 * 初始化路由模块
 * 获取用户的基本信息,更新用户的基本信息
 */
const express = require('express')
//创建路由对象
const router = express.Router()

//导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')

//导入用户信息处理函数模块
const userinfo_handler = require('../router_handler/userinfo')
//必须要解构赋值来接收
// const { update_userinfo_schema } = require('../schema/user')下面定义了，这个就要注释掉
//
const { update_userinfo_schema, update_password_schema } = require('../schema/user')

//
const { update_avatar_schema } = require('../schema/user')

//获取用户信息
router.get('/userinfo', userinfo_handler.getUserInfo)

//更新用户信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

//重置密码
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)

//更换用户头像
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)

//向外共享对象
module.exports = router