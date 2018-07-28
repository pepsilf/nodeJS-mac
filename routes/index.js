var express = require('express');
var router = express.Router();
const mysql = require("../tools/mysqlTool");//数据库链接池

/* GET home page. */  //首页
router.get('/', function(req, res) {
  res.render('mecoxlane.html');
});

module.exports = router;
