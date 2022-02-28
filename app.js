//创建express服务器实例
const express = require('express')
const app = express()

//导入数据校验模块
const joi = require('joi')

//导入配置文件
const config = require('./config')

//解析token的中间件
const expressJWT = require('express-jwt')

//托管静态资源文件
app.use('/uploads', express.static('/uploads'))

//配置cors中间件 解决跨域问题
const cors = require('cors')
app.use(cors())

//配置用来解析服务器提交的 urlencoded格式的数据的中间件
/* 
    解析body不是node.js默认提供的，你需要载入body-parser中间件才可以使用req.body
*/
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

//一定要在路由之前配置res.cc()函数
app.use(function (req, res, next) {
    res.cc = function (err, status = 1) {
        res.send({
            status,//status默认值为1
            //判断err是 错误对象 还是 字符串
            //instanceof 判断err是不是构造函数Error的实例
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})
/**
 * 客户端每次在访问那些有权限接口的时候，都需要主动通过请求头中的 Authorization 字段，
 * 将 Token 字符串发送到服务器进行身份认证。
 */
//服务器可以通过express-jwt这个中间件，自动将客户端发送过来的token解析成JSON对象
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))//unless指定哪些接口不需要进行token身份认证

//导入获取用户信息模块
const userinfoRouter = require('./router/userinfo')
//注意：以/my开头的接口，都是有权限的接口，需要进行token认证
//将userinfoRouter注册为全局模块
app.use('/my', userinfoRouter)

//注意:除了错误级别中间件，其他中间件必须配置在路由之前，否则会报错！！！！！！！
//导入并注册路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

/**
 * 一定要注意路由的顺序啊！！！
 * 先有artCateRouter,在有articleRouter
 * 如果写反，则会报错 id is required
 */

//导入文章分类路由模块
const artCateRouter = require('./router/artcate')
//为路由挂载统一的路径前缀
app.use('/my/article', artCateRouter)

//导入文章的路由模块
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

//定义全局错误中间件
//注意：在express中，不能调用两次res.send()，否则会报错
app.use(function (err, req, res, next) {
    if (err instanceof joi.ValidationError) {
        return res.cc(err)
    }
    // //捕获身份认证失败
    if (err.name === 'UnauthorizedError') {
        return res.cc('身份认证失败!')
    }

    //未知错误
    res.cc(err)
    next()
})

app.listen(3007, function () {
    console.log('http://127.0.0.1:3007');
})