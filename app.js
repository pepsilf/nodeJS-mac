const createError = require('http-errors');     //引入模块
const logger = require('morgan');

const express = require('express');             //引入模块
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSession = require("cookie-session");
const consolidate = require("consolidate");

const indexRouter = require('./routes/index');        //首页路由
const usersRouter = require('./routes/user');         //用户路由
const shoppingRouter = require('./routes/shopping');  //购物车路由

let app = express();               //创建服务器

// view engine setup
app.set("view engine","html");     //使用什么模板引擎
app.set("views","views");          //模板在哪个目录
app.engine("html",consolidate.ejs);//渲染模板的方式(ejs)

app.use(logger('dev'));      //处理日志

app.use(express.json());     //处理数据  get/post
app.use(express.urlencoded({ extended: false }));//post请求获取body数据

app.use(cookieParser());     //cookie-session
let keys = [];
for(let i = 0; i < 10000; i++){
	keys.push("cookiesessionid"+Math.random()+Date.now());  //随机生成秘钥
}
app.use(cookieSession({
	keys,
	maxAge:30*60*1000,
	name:"sid"	
}));

app.use(express.static("public"));   //静态服务器

app.use('/', indexRouter);           //首页路由
app.use('/user', usersRouter);       //用户路由
app.use('/shopping', shoppingRouter);//购物车路由

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
