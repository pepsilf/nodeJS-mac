const bcrypt = require("bcrypt");  //盐加密

// let arr = [
// 	"$2b$10$iOCgw9g7F/dHA5uihwVIDes5FxyVtrXUZDq9CjhL4R92YzNyfO1BW",
// 	"$2b$10$pvi4jrfzEWVJp9LJgX2GG.F8fRQOZh53utwpn/5PU/EPlGb5hqqf6",
// 	"$2b$10$juts35Lgp.myAvEKKHzT6.hkZLhE9UdxqKCVGu/C2IeDvSzpksglu"
// ];

// arr.forEach(function(hash){
// 	bcrypt.compare("123456", hash, function(err, res) {  //比较密码
// 		// res == true
// 		console.log(res);
// 	});
// });

function bcrypt(str){
	bcrypt.genSalt(10, function(err, salt) {   			   //salt盐度10
		bcrypt.hash(str, salt, function(err, hash) {
			return hash;
		});
	});
}
module.exports=bcrypt;