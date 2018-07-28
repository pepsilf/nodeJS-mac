const mysql = require("mysql");

let mysqlTool = mysql.createPool({
	connectionLimit:30,     //链接限制           
	host:"localhost",	
	user:"root",	
	password:"",	
	database:"mecoxlane",       
});

module.exports = mysqlTool;