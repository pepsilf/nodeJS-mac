var express = require('express');
var router = express.Router();
const mysql = require("../tools/mysqlTool");//数据库链接池
const md5 = require("../tools/md5");        //md5加密模块

/* GET users listing. */
//主页面
router.get('/', (req, res)=>{
  // req.session.isLogin = true;
  console.log(req.session.isLogin)
	if(!req.session.isLogin){//没有登录
		//跳转到登录页
		res.redirect("/user/login");
	} else {//已经登录了
		res.redirect("/user/register");
	}
});

//登陆页面
router.route('/login').get((req, res)=> {
  res.render('user/login.html');
}).post((req, res)=>{
  console.log(req.body)
  let {uname,upwd}=req.body;
  upwd=md5(upwd);
  let userSql = `select * from mecoxlane.users where u_name="${uname}" and u_pwd="${upwd}"`;//准备查询语句
  mysql.query(userSql,(err,data)=>{
    if(err){
      res.send({status:0,msg:"服务器繁忙"});
    }else{
      if(data.length==0){
        res.send({status:0,msg:"用户名或密码错误"});
      }else{
        req.session.isLogin = true;
        req.session.user = {uname,upwd};  //设置session
        console.log(req.session)
        res.send({status:1,msg:"登陆成功",data:{uname:uname,upwd:upwd}});
      }
    }
  })
})

//注册页面
router.route('/register').get((req, res)=> {
  if(req.query.uname){  //判断用户名是否存在
    let goodsSql = `select * from mecoxlane.users where u_name="${req.query.uname}"`;//准备查询语句
    mysql.query(goodsSql,(err,data)=>{
      console.log(data)
      if(data.length>=1){
        res.send(false);
      }else{
        res.send(true);
      }
    });
  }else if(req.query.uphone){ //判断手机号码是否存在
    let goodsSql = `select * from mecoxlane.users where u_phone="${req.query.uphone}"`;//准备查询语句
    mysql.query(goodsSql,(err,data)=>{
      console.log(data)
      if(data.length>=1){
        res.send(false);
      }else{
        res.send(true);
      }
    });
  }else{
    res.render('user/register.html');
  }
}).post((req,res)=>{  //注册请求
  console.log(req.body)
  let {uname,upwd,uphone}=req.body;
  upwd=md5(upwd);
  let goodsSql = `select * from mecoxlane.users where u_name="${uname}"`;//准备查询语句
  mysql.query(goodsSql,(err,data)=>{
    console.log(data)
    if(data.length==0){
      let insertSql = `insert into mecoxlane.users(u_name,u_pwd,u_phone) values("${uname}","${upwd}","${uphone}")`;
      mysql.query(insertSql,(err,data)=>{
        if(err){
          res.send({status:0,msg:"服务器繁忙"});
        }else{
          res.send({status:1,msg:"注册成功"});
        }
      })
    }else{
      res.send({status:0,msg:"用户已存在"});
    }
  });
})

module.exports = router;
