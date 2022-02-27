    /**
 * 用户信息验证规则模块
 */
const joi = require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

//用户名验证规则
const username = joi.string().alphanum().min(1).max(10).required() //alphanum() 值只能是包含 a-zA-Z0-9 的字符串
//密码验证规则
// /^[\S]{6,12}$/ 匹配一个{6，12}个的非空格的字符
const password = joi.string().pattern(/^[\S]{6,12}$/).required()


//定义id,nickname,email验证规则
const id = joi.number().integer().min(1).required()//定义一个最小为1的数字且为整数，值一定为必传的参数的id验证规则
const nickname = joi.string().required()
const email = joi.string().email().required()//定义一个符合为字符串，符合邮箱验证规则且值一定为必传的参数的Email验证规则

// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
//新头像，base64格式的字符串
const avatar=joi.string().dataUri().required()

/**
 * 挂载一个自定义属性reg_login_schema，
 */
//验证规则对象 - 登录
exports.reg_login_schema = {
    //只针对req.body里面的数据进行验证
    body: {
        username,
        password
    },
}

//验证规则对象 - 更新用户信息
exports.update_userinfo_schema = {
    body: {
        id,
        nickname,
        email
    }
}

//验证规则对象 - 重置密码
/**
 * 核心验证思路：旧密码与新密码，必须符合密码的验证规则，并且新密码不能与旧密码一致！
 */
exports.update_password_schema={
    body:{
        //使用 password 这个规则，验证 req.body.oldPwd 的值
        oldPwd:password,
        // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
        newPwd:joi.not(joi.ref('oldPwd')).concat(password)
    }
}

// 验证规则对象 - 更新头像
exports.update_avatar_schema={
    body:{
        avatar
    }
}