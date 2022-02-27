// 导入定义验证规则的模块
const joi=require('joi')

// 定义 分类名称 和 分类别名 的校验规则
const name=joi.string().required()
const alias=joi.string().alphanum().required()

// 定义 分类Id 的校验规则
const id=joi.number().integer().min(1).required()

// 校验规则对象 - 添加分类
exports.add_cate_schema={
    body:{
        name,
        alias
    }
}

//校验规则对象 - 根据ID删除分类
exports.delete_cate_schema={
    params:{
        id
    }
}

// 校验规则对象 - 根据 Id 获取分类
exports.get_cate_schema={
    params:{
        id
    }
}

// 校验规则对象 - 更新分类
exports.update_cate_schema={
    body:{
        /**
         * 如果左边的属性等于右边的值，则可以省略右边的值
         */
        //这里为什么要用Id - 因为api-server文档里面对参数的定义就是Id而不是id
        Id:id,
        name,
        alias
    }
}