var express = require('express');
var router = express.Router();
const mysql = require("../tools/mysqlTool");//数据库链接池

/* GET users listing. */

//商品详情页
router.route("/goods").get((req, res)=> {
  let goodsSql = `select * from mecoxlane.goods where g_id=${req.query.id}`;
	mysql.query(goodsSql,(err,data)=>{
    res.render('shopping/goods.html',{data});
  });
}).post((req, res)=> {
  console.log(req.body)
  if(req.body.unames){ //请求数量
    let findSql = `select * from mecoxlane.shoppingCart where u_name="${req.body.unames}"`;
    mysql.query(findSql,(err,data)=>{
      if(err){
        res.send({status:0,msg:"服务器繁忙"});
      }else{
        res.send({status:1,msg:"请求成功",data:JSON.stringify(data)});
      }
    })
  }else{
    let findSql = `select * from mecoxlane.shoppingCart where g_id="${req.body.gid}" and u_name="${req.body.uname}"`;
    mysql.query(findSql,(err,data)=>{
      if(err){
        res.send({status:0,msg:"服务器繁忙"});
      }else{
        if(data.length>=1){//如果商品不在数据库,执行插入,否则只要修改数量
          let addSql=`UPDATE mecoxlane.shoppingCart SET g_nums=g_nums-0+"${req.body.nums-0}" WHERE u_name="${req.body.uname}" AND g_id="${req.body.gid}"`
          mysql.query(addSql,(err,data)=>{
            if(err){
              res.send({status:0,msg:"服务器繁忙"});
            }else{
              res.send({status:1,msg:"加入购物车成功"});
            }
          })
        }else{
          let insetSql=`INSERT INTO shoppingcart(u_name,g_name,g_num,g_price,g_src,g_nums,g_id) VALUES('${req.body.uname}','${req.body.name}','${req.body.num}','${req.body.price}','${req.body.p1}','${req.body.nums}','${req.body.gid}')`
          mysql.query(insetSql,(err,data)=>{
            if(err){
              res.send({status:0,msg:"服务器繁忙"});
            }else{
              res.send({status:1,msg:"加入购物车成功"});
            }
          })
        }
      }
    });
  }
})
  
//购物车页面
router.route('/shoppingCart').get((req, res)=> {
  res.render('shopping/shoppingCart.html');
}).post((req,res)=>{
  console.log(req.body)
  if(req.body.nums){  //请求了nums则执行修改操作
      let addSql=`UPDATE mecoxlane.shoppingCart SET g_nums="${req.body.nums}" WHERE u_name="${req.body.uname}" AND g_id="${req.body.gid}"`
      mysql.query(addSql,(err,data)=>{
        if(err){
          res.send({status:0,msg:"服务器繁忙"});
        }else{
          res.send({status:1,msg:"修改购物车数量成功"});
        }
      })
  }else if(req.body.gid){ //请求了gid则执行删除操作
    let addSql=`DELETE	FROM shoppingcart WHERE g_id="${req.body.gid}" AND u_name="${req.body.uname}"`
      mysql.query(addSql,(err,data)=>{
        if(err){
          res.send({status:0,msg:"服务器繁忙"});
        }else{
          res.send({status:1,msg:"修改购物车数量成功"});
        }
      })
  }else{ //只请求uname则执行加载内容操作
    let findSql = `select * from mecoxlane.shoppingCart where u_name="${req.body.uname}"`;
    mysql.query(findSql,(err,data)=>{
      if(err){
        res.send({status:0,msg:"服务器繁忙"});
      }else{
        res.send({status:1,msg:"购物车列表",data:JSON.stringify(data)});
      }
    })
  }
})

module.exports = router;
