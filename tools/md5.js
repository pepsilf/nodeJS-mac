const crypto = require("crypto");

const secrets ="abcdefghihklmnopqretuvwxyz"   //秘钥 加强密码破解难度

function md5(str){
	
	const hash = crypto.createHash("md5"); // md5或sha256 加密方式
	
	hash.update(str + secrets);	           //需要加密的内容
	
	return hash.digest("hex");             //以什么方式显示你的加密的内容
}
module.exports=md5;