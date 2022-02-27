/**
 * 获取文章分类列表 - 初始化路由模块
 */

const express = require('express')
const router = express.Router()
// 导入验证数据的中间件
const expressJoi=require('@escook/express-joi')
// 导入文章分类的验证模块
const {add_cate_schema}=require('../schema/artcate')
//导入删除分类的验证规则对象
const {delete_cate_schema}=require('../schema/artcate')
//导入根据ID获取分类的验证规则对象
const {get_cate_schema}=require('../schema/artcate')
//导入更新文章分类的验证规则对象
const {update_cate_schema}=require('../schema/artcate')

//导入处理函数模块
const artcate_handler = require('../router_handler/artcate')

//获取文章分类列表数据
router.get('/cates', artcate_handler.getArticleCates)

// 新增文章分类的路由
router.post('/addcates',expressJoi(add_cate_schema),artcate_handler.addArticleCates)

//删除文章分类的路由
router.get('/deletecate/:id',expressJoi(delete_cate_schema),artcate_handler.deleteCateById)

//根据ID获取获取文章分类的路由
router.get('/cates/:id',expressJoi(get_cate_schema),artcate_handler.getArticleById)

//更新文章分类的路由
router.post('/updatecate',expressJoi(update_cate_schema),artcate_handler.updateCateById)

module.exports = router