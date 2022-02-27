const express = require('express')
//创建路由对象
const router = express.Router()

//导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
//导入文章的验证模块
const { add_article_schema } = require('../schema/article')
//导入根据id删除文章的模块
const { delete_article_schema } = require('../schema/article')
//导入根据id获取文章数据的模块
const { get_article_schema } = require('../schema/article')
//导入根据id更新文章数据的模块
const { update_article_schema } = require('../schema/article')

/**
 * 注意：使用 express.urlencoded() 中间件无法解析 multipart/form-data 格式的请求体数据。
 * 当前项目，推荐使用 multer 来解析 multipart/form-data 格式的表单数据
 */
//导入解析formdata格式表单数据的包
const multer = require('multer')
//导入处理路径的核心模块
const path = require('path')

//导入multer的实例对象，通过dest属性指定文件的存放路径
const uploads = multer({ dest: path.join(__dirname, '../uploads') })

//导入文章的路由处理模块
const article_handler = require('../router_handler/article')


//发布新文章
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
/**
 * 注意：在当前的路由中，先后使用了两个中间件：
        先使用 multer 解析表单数据
        再使用 expressJoi 对解析的表单数据进行验证
 */
router.post('/add', uploads.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)

//获取文章列表数据
router.get('/list', article_handler.getArticleList)

//根据ID删除文章数据
router.get('/delete/:id', expressJoi(delete_article_schema), article_handler.deleteArticleId)

//根据ID获取文章详情
router.get('/:id', expressJoi(get_article_schema), article_handler.getArticlesById)

//根据 Id 更新文章信息
router.post('/edit',uploads.single('cover_img'), expressJoi(update_article_schema), article_handler.updateArticlesById)



//向外共享路由对象
module.exports = router