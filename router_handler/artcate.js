//导入数据库操作模块
const db = require('../db/index')

// 获取文章分类列表数据的处理函数
exports.getArticleCates = (req, res) => {
    //获取所有未被删除的分类列表数据
    // is_delete 为 0 表示没有被 标记为删除 的数据
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
    db.query(sql, (err, results) => {
        //SQL执行失败
        if (err) { return res.cc(err) }
        // console.log(results);
        //执行SQL执行成功
        res.send({
            status: 0,
            message: "获取文章分类列表成功",
            data: results
        })
    })
}

// 新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = 'select * from ev_article_cate where name=? or alias=?'
    // 执行查重操作
    /**
     * 查询表单提交过来的req.body.name和req.boyd.alias的值，然后查询到的数据库中的值被results数组保存
     */
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        //如果查询到表单提交过来的值时，results返回的是对应值的一行
        // 执行 SQL 语句失败
        if (err) { return res.cc(err) }
        // 分类名称与别名都被占用
        if (results.length === 2) { return res.cc('分类名称与别名都被占用，请更换后重试！') }//分类名称与别名不对应
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) { return res.cc('分类名称与别名都被占用，请更换后重试！') }//分类名称和别名对应
        // 分类名称 或 分类别名 被占用
        if (results.length === 1 && results[0].name === req.body.name) { return res.cc('分类名称被占用，请更换后重试！') }
        if (results.length === 1 && results[0].alias === req.body.alias) { return res.cc('分类名被占用，请更换后重试！') }

        //定义新增文章分类的sql
        const sql = 'insert into ev_article_cate set ?'
        db.query(sql, req.body, (err, results) => {
            //SQL语句执行失败
            if (err) { return res.cc(err) }
            //影响行数不等于1
            if (results.affectedRows !== 1) { return res.cc('新增文章分类失败！') }
            //成功
            res.cc('新增文章成功', 0)
        })
    })
}

//删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    //删除文章就是把is_delete的值从0设置为1
    const sql = 'update ev_article_cate set is_delete=1 where id=?'
    db.query(sql, req.params.id, (err, results) => {
        if (err) { return res.cc(err) }
        // SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
        //删除文章成功
        res.cc('删除文章分类成功', 0)
    })
}

// 根据 Id 获取文章分类的处理函数
exports.getArticleById = (req, res) => {
    const sql = 'select * from ev_article_cate where id=?'
    db.query(sql, req.params.id, (err, results) => {
        if (err) { return res.cc(err) }
        // SQL 语句执行成功，但是没有查询到任何数据
        if (results.length !== 1) return res.cc('获取文章分类数据失败！')
        //成功，把数据响应给客户端
        res.send({
            status: 0,
            message: '获取文章分类数据成功！',
            data: results[0]
        })
    })
}

//根据ID更新文章分类的处理函数
exports.updateCateById = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    //注意这里的Id
    const sql = 'select * from ev_article_cate where Id<>? and (name=? or alias=?)'
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        //执行SQL失败
        if (err) { return res.cc(err) }
        // 分类名称 和 分类别名 都被占用
        /**
         * 这里的results.length等于2时 是只一个数组中有两个对象当中的值与数据库中的name和alias匹配
         * 
         */
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        // 分类名称 或 分类别名 被占用
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
        //实现更新文章
        const sql = 'update ev_article_cate set ? where Id=?'
        db.query(sql, [req.body, req.body.Id], (err, results) => {
            if (err) { return res.cc(err) }
            if (results.affectedRows !== 1) { return res.cc('更新文章分类失败！') }
            //更新文章分类成功
            res.cc('更新文章成功!', 0)
        })
    })

}
