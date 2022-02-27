//导入数据库操作模块
const db = require('../db/index')

//导入对密码明文加密的模块
const bcrypt = require('bcryptjs')

//获取用户基本信息
exports.getUserInfo = (req, res) => {
    //为了防止密码泄露，需要排除password字段
    const sql = 'select id,username,nickname,email,user_pic from ev_users where id=?'
    //req对象上的user属性，是token解析成功，express-jwt自动帮我们挂载上去的
    db.query(sql, req.user.id, (err, results) => {
        //执行SQL失败
        if (err) { return res.cc(err) }
        //执行SQL成功，但查询到的数据条数不为一
        if (results.length !== 1) { return res.cc('获取用户失败') }
        //获取成功
        res.send({
            status: 0,
            message: '获取用户基本信息成功',
            data: results[0]
        })
    })
}

//更新用户基本信息
exports.updateUserInfo = (req, res) => {
    const sql = 'update ev_users set ? where id=?'
    db.query(sql, [req.body, req.body.id], (err, results) => {
        //如果执行SQL失败
        if (err) { return res.cc(err) }
        //sql执行成功，但影响行数不为1
        if (results.affectedRows !== 1) { return res.cc('修改用户信息失败') }
        //成功
        res.cc('更新用户信息成功', 0)
    })

}

//更新用户密码处理函数
exports.updatePassword = (req, res) => {
    //根据id查询用户是否存在
    const sql = 'select * from ev_users where id=?'
    db.query(sql, req.user.id, (err, results) => {
        // if(req.body.newPwd===req.body.oldPwd){return res.cc('密码和新密码一致')}
        if (err) { return res.cc(err) }
        if (results.length !== 1) { return res.cc('用户不存在') }
        //判断提交的密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)//results[0].password是数据库中的密码
            if (!compareResult) { return res.cc('旧密码错误') }
        // console.log(req.body.newPwd);

        //对bcrypt加密之后，更新到数据库中
        //定义更新密码的SQL语句
        const sql = 'update ev_users set password =? where id=?'
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            if (err) { return res.cc(err) }
            if (results.affectedRows !== 1) { return res.cc('更新密码失败') }
            // console.log(results[0].oldPwd);
            // console.log(req.body.newPwd);
            // if(results[0].oldPwd===req.body.newPwd){return res.cc('旧密码和新密码一致')}
            //更新成功
            res.cc('更新密码成功', 0)
            })
        })
}

//更新用户头像处理函数
exports.updateAvatar=(req,res)=>{
    const sql='update ev_users set user_pic=? where id=?'
    db.query(sql,[req.body.avatar,req.user.id],(err,results)=>{
        if(err){return res.cc(err)}
        if(results.affectedRows!==1){return res.cc('更新头像失败！')}
        //更新用户头像成功
        res.cc('更新头像成功！',0)
    })
}