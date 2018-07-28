require(["config"], function(){
    require(["jquery","idcode","md5","validate"], function(){
        $(function(){
            //加载底部
            $(".foot").load("/foot.html")
            //验证码
            $.idcode.setCode();
            $("#Txtidcode").on("blur",function(){
                $(this).next().text("")
                if(!$.idcode.validateCode()){
                    $(this).next().text("验证码错误")
                }
            })
            //获取传入的链接地址
            if(window.location.search) {
                $url = (window.location.search).substring(5)
                console.log($url)
            }else{
                //如果没有传入地址，登陆后默认进入主页
                $url="/";
            }
            $("#myform").validate({
                submitHandler : function(){
                        if($.idcode.validateCode()) {
                            $.ajax({
                                url: "/user/login",
                                data: {
                                    uname: $("input").eq(0).val(),
                                    upwd: $.md5($("input").eq(1).val()),
                                },
                                type: "POST",
                                dataType: "json"
                            }).done(function (res) {
                                if (res.status == 1) {
                                    sessionStorage.setItem("users", JSON.stringify(res.data));
                                    window.location.href =$url;
                                }
                                alert(res.msg);
                            })
                            return false;
                        }
                }
            })
        })
    })
})