//导入定义规则的验证对象
const joi=require('joi')

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title=joi.string().required()
const cate_id=joi.number().integer().min(1).required()
const content=joi.string().required().allow('')
const state=joi.string().valid('已发布','草稿').required()

//定义id
const id=joi.number().integer().min(1).required()

//验证规则对象 - 发布文章
exports.add_article_schema={
    body:{
        title,
        cate_id,
        content,
        state
    }
}

//验证规则对象 - 根据分类id删除文章数据
exports.delete_article_schema={
    params:{
        id
    }
}

//验证规则对象 - 根据id获取文章数据
exports.get_article_schema={
    params:{
        id
    }
}

//验证规则对象 - 根据 Id 更新文章信息
exports.update_article_schema={
    body:{
        Id:id,
        title,
        cate_id,
        content,
        state,
    }
}