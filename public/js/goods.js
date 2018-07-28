require(["config"], function(){
    require(["jquery","idcode","md5","validate","cookie","lazyload"], function(){
        $(function(){
            //加载头部和底部
            $(".head").load("/head.html",function(){
                jQuery.getScript("/js/head.js")
            })
            $(".foot").load("/foot.html")
            //懒加载
            $("img.lazy").lazyload({effect: "fadeIn"});
            //点击切换
            $(".imgs img").on("click",function(){
                $(".simg img").attr("src",$(this).attr("src"))
                if($(this).index()==0){
                    $(".bbox img").attr("src",$(".bbox img").attr("src1"))
                }else{
                    $(".bbox img").attr("src",$(".bbox img").attr("src2"))
                }
            })
            //放大镜
            $(".simg").on("mouseenter",function(){
                $(".sbox").show()
                $(".bbox").stop(true,true).animate({
                    "left":495,
                    "top":0,
                    "width":215,
                    "height":215
                },500)
                $(document).on("mousemove",function(e){
                    $(".sbox").css({
                        'left':e.clientX-$(".simg").offset().left-$(".sbox").width()/2,
                        'top':e.clientY-$(".simg").offset().top-$(".sbox").height()/2,
                    })
                    $dix=parseInt($(".sbox").css("left"))
                    $diy=parseInt($(".sbox").css("top"))
                    $dix_r=$(".simg").width()-$(".sbox").width()
                    $dix_t=$(".simg").height()-$(".sbox").height()
                    if($dix<0){
                        $(".sbox").css("left",0)
                    }
                    if($diy<0){
                        $(".sbox").css("top",0)
                    }
                    if($dix>$dix_r){
                        $(".sbox").css("left",$dix_r)
                    }
                    if($diy>$dix_t){
                        $(".sbox").css("top",$dix_t)
                    }
                    $(".bbox img").css({
                        "left":-parseInt($(".sbox").css("left"))*1.27,
                        "top":-parseInt($(".sbox").css("top"))*2.15
                    })
                })
                $(".simg").on("mouseleave",function(){
                    $(".sbox").hide();
                    $(".bbox").stop(true,true).animate({
                        "left":208,
                        "top":183,
                        "width":0,
                        "height":0
                    },500)
                    $(document).off("mousemove")
                    $(".simg").off("mouseleave")
                })

            })
            //数量更改
            $(".num span").on("click",function(){
                if($(this).text()=="+"){
                    $(this).prev().val($(this).prev().val()-0+1)
                }else{
                    if($(this).next().val()>1){
                        $(this).next().val($(this).next().val()-1)
                    }
                }
            })
            //详情切换
            $(".lists li").eq(0).siblings().hide()
            $(".list li").on("mouseenter",function(){
                $(this).addClass("current").siblings().removeClass("current")
                $(".lists li").eq($(this).index()).show().siblings().hide()
            })
            //收藏
            $(".cars span").eq(1).hover(function(){
                $(this).children().children("img").css("top",-30)
            },function(){
                $(this).children().children("img").css("top",0)
            })
            //加入购物车
            var users = JSON.parse(sessionStorage.getItem("users") || '{}');
            $("#carts").on("click",function(){
                //商品信息
                $goodsInfo={
                    name:$(".right h3").text(),
                    num:$(".brand span").eq(1).text(),
                    price:$(".price").text(),
                    p1:$(".imgs img").eq(0).attr("src"),
                    nums:$(".num input").val() ,
                    gid:window.location.search.split("=")[1]
                }
                console.log($goodsInfo)
                //判断是否登录
                if(users.uname) {
                    $goodsInfo["uname"] = users.uname;
                    console.log($goodsInfo);
                    $.ajax({
                        type:"post",
                        url:"/shopping/goods",
                        data:$goodsInfo,
                        dataType:"json",
                    }).then(function(back){
                        if(back.status){
                            $(".background").show()
                            $(".gobuy").show().animate({"top":240},200)
                        }else{
                            console.log(back.msg)
                        }
                    })
                }else{
                    var cartList=JSON.parse($.cookie("carts")||"[]")
                    var bFlage=true;
                    for(var i in cartList){
                        if(cartList[i].gid==$goodsInfo['gid']){
                            cartList[i].nums=(cartList[i].nums-0)+($goodsInfo['nums']-0)
                            bFlage=false;
                            break;
                        }
                    }
                    if(bFlage){
                        cartList.push($goodsInfo)
                    }
                    $.cookie("carts",JSON.stringify(cartList),{ path: '/' })
                    $(".background").show()
                    $(".gobuy").show().animate({"top":240},200)
                }
            })
        })
    })
})