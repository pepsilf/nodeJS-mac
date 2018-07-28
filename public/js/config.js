define(["config"],function(){                //定义模块
    require.config({                       //配置文件
        urlArgs:"v="+new Date().getTime(),  //文件版本号
        baseUrl:"/js",                     //文件路径头
        paths:{                               //文件路径
            "jquery":["lib/jquery/jquery-3.3.1","https://cdn.bootcss.com/jquery/3.3.1/jquery"],
            "cookie":["lib/jquery.cookie/cookie"],
            "idcode":["lib/jquery.code/jquery.idcode"],
            "validate":["lib/jquery.validation/jquery.validate"],
            "methods":["lib/jquery.validation/additional-methods"],
            "md5":["lib/jquery.md5/jquery.md5"],
            "lazyload":["lib/jquery.lazyload/jquery.lazyload"]
        },
        shim:{
            "md5":{
                deps:["jquery"]
            },
            "idcode":{
                deps:["jquery"]
            },
            "lazyload":{
                deps:["jquery"]
            }
            // "methods":{
            //     deps:["jquery"]
            // }
        }
    })
})