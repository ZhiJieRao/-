/**
 * 此文件负责处理路由的处理函数
 */
const express = require('express')

//导入bcrypt对用户的密码进行加密
const bcrypt = require('bcryptjs')

//导入数据库模块
const db = require('../db/index')

//导入生成token字符串的包
const jwt = require('jsonwebtoken')

//导入密钥
const config = require('../config')

//注册处理函数
exports.regUser = (req, res) => {
    const userinfo = req.body
    //检测用户名和密码是否为空
    // console.log(req.body);
    //这里的是否为空是指的什么都不输入，不是指空格
    if (!req.body.username || !req.body.password) {
        return res.cc('用户名或密码不能为空')
    }
    //检测用户名是否被占用
    const sql = 'select * from ev_users where username=?'//向表中增删改查数据时，如果数据对象的每个属性和数据表的字段一一对应
    //只有一个占位符的情况，数组是可以省略的
    db.query(sql, [userinfo.username], (err, results) => {
        //如果执行的是查询语句，则results是一个数组
        /**
         * results的内容根据常量sql决定，这是result数组存储的id=10的用户信息
         * [
         * RowDataPacket {
                                    id: 10,
                                    username: '1234',
                                    password: '$2a$10$yo3O4829k5MbcqVq3kpCuu5gkLaDZHg9U4eumWu3G1ejJD3o0aGwq',
                                    nickname: null,
                                    email: null,
                                    user_pic: null
                            }
            ]
*/
        // console.log(results.length)
        // console.log(results[1]);
        //执行sql语句失败
        if (err) {
            return res.cc(err)
        }
        //如果用户名被占用
        if (results.length > 0) {//results.length==0说明数组为空，即数据库没有查询到注册的新用户名，反之，results.length>0,说明数组里面有数值，即有用户名
            return res.cc('用户名被占用，请换一个')
        }
        /**
         * 为了保证密码的安全性，不建议密码在数据库以明文的形式进行存储，推荐数据库的密码进行加密存储
         */
        //对用户的密码,进行 bcrypt 加密，返回值是加密之后的密码字符串,加密过后无法被逆向破解
        //同一明文密码多次加密，得到的加密结果各不相同，保证了安全性

        userinfo.password = bcrypt.hashSync(userinfo.password, 10)//第一个参数为要加密的字符串，第二个参数为盐的长度，默认为10
        /**
         * 所谓加盐，就是在加密的基础上再加点“佐料”。这个“佐料”是系统随机生成的一个随机值，并且以随机的方式混在加密之后的密码中。
         * 由于“佐料”是系统随机生成的，相同的原始密码在加入“佐料”之后，都会生成不同的字符串。
         *  这样就大大的增加了破解的难度
         */

        //插入新用户
        // 向表中新增数据时，如果数据 对象 的每个属性 和 数据表的字段 一一对应,则可以用如下快捷方式
        const sql = 'insert into ev_users set ?'
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            // 注意：如果执行的是插入语句，则results的一个对象
            // console.log(results);
            //插入sql语句失败
            if (err) {
                return res.cc(err)
            }
            /**
             * 判断插入成功的条件是 results.affectedRows==1 受影响的行数等于1
             */
            //受影响的行数不等于1
            if (results.affectedRows !== 1) {
                return res.cc('注册用户失败，请稍后再试')
            }
            //注册成功
            // res.send({
            //     status:0,
            //     message:'注册成功'
            // })
            res.cc('注册成功', 0)
        })
    })

}

//登录处理函数
exports.login = (req, res) => {
    /**
     * 根据用户名查询用户的数据
     */
    const userinfo = req.body
    //执行用户语句，查询用户数据
    const sql = `select * from ev_users where username=?`
    db.query(sql, userinfo.username, (err, results) => {
        //执行sql语句失败
        if (err) { return res.cc(err) }
        //执行SQL语句成功，但是查询到的数据条数不等于1
        if (results.length !== 1) { return res.cc('登录失败!') }
        /**
         * 判断用户输入的登录密码是否和数据库中的密码一致
         * 调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致
         *返回值是布尔值（true 一致、false 不一致）
         */
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)//第一个参数为用户提交的密码，第二个参数为数据库密码
        //如果对比的结果等于 false, 则证明用户输入的密码错误
        if (!compareResult) {
            return res.cc('登录失败!')
        }
        /* 
        使用Token的目的: Token的目的是为了验证用户登录情况以及减轻服务器的压力,
        减少频繁的查询数据库,使服务器更加健壮
        */
        /**
         *  登录成功，生成 JWT的Token 字符串
         */
        //注意：为了保证用户信息的安全性，千万不要把用户的密码和头像存储成token字符串，因为token字符串是存储在浏览器的，如果存储了密码和头像，有可能会变的不安全
        const user = { ...results[0], password: '', user_pic: '' }//剔除password和user_pic

        //生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, //第一个参数是要加密的用户参数，第二个参数是加密的时候要用到的jwtSecretKey的值，第三个参数是指定token有效期的
            // {expiresIn:'10h'}
            { expiresIn: config.expiresIn }//token有效期为10h
        )
        /**
         * 登录成功，将token字符串响应给客户端
         */
        res.send({
            status: 0,
            message: '登录成功！',
            //为了方便客户端使用token，在tokenStr前拼接Bearer
            token: 'Bearer ' + tokenStr
        })

    })
}
