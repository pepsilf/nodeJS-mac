require(["config"],function() {
    require(["jquery","lazyload"], function () {
        $(function(){
            //加载头部、底部
            $(".head").load("/head.html",function(){
               jQuery.getScript("/js/head.js")
            })
            $(".foot").load("/foot.html")
            //懒加载
            $("img.lazy").lazyload({effect: "fadeIn",failurelimit : 18,threshold :0});
            //轮播图
            $index=0;
            function autoPlay(){
                if($index==0){
                    $(".banner img").eq(0).fadeTo(1000,0).siblings("img").fadeTo(1000,1)
                    $(".change span").eq(0).addClass("chan").siblings().removeClass("chan")
                }else{
                    $(".banner img").eq(0).fadeTo(1000,1).siblings("img").fadeTo(1000,0)
                    $(".change span").eq(0).removeClass("chan").siblings().addClass("chan")
                }
            }
            var timer=setInterval(function(){
                $index++
                if($index>1){
                    $index=0
                }
                autoPlay();
            },2000)

            $(".banner").hover(function(){
                $(this).children("div").eq(0).fadeTo(200,1);
                clearInterval(timer)
            },function(){
                $(this).children("div").eq(0).fadeTo(200,0);
                timer=setInterval(function(){
                    $index++
                    if($index>1){
                        $index=0
                    }
                    autoPlay();
                },2000)
            })
            $("#shows div").hover(function(){
                $(this).css("background","red")
            },function(){
                $(this).css("background","black")
            })
            $("#shows div").on("click",function(){
                $index++
                if($index>1){
                    $index=0
                }
                autoPlay();
            })
            //内容区效果
            $(".tol").hover(function(){
                // $l=parseInt($(this).children("img").css("left"))
                // console.log($l)
                $(this).children("img").stop(true,true).animate({"right":10},300)
                $(this).children(".contents").css("background","lightgreen")
            },function(){
                $l=parseInt($(this).children("img").css("left"))
                $(this).children("img").stop(true,true).animate({"right":0},300)
                $(this).children("div").css("background","#ffffff")
            })
            $(".tor").hover(function(){
                $(this).children("img").stop(true,true).animate({"left":10},300)
                $(this).children("div").css("background","lightgreen")
            },function(){
                $(this).children("img").stop(true,true).animate({"left":0},300)
                $(this).children("div").css("background","#ffffff")
            })
            //点击宝贝详情弹出
            $(".sp").on("click",function(){
                $self=$(this)
                $(".background").show()
                $(this).children("div").eq(1).animate({
                    height:238,
                    width:400,
                },function(){
                    $self.children(".bp").children("span").show()
                    $self.children(".txt").slideDown(500).css("backgroundColor","#ffffff")
                });
            })

            $(".close").on("click",function(e){
                e.stopPropagation();
                $(this).parent().next(".txt").slideUp(500,function (){
                    $(this).hide()
                    $(".bp").animate({
                        height:0,
                        width:0
                    })
                    $(".background").hide()
                })
            })
            //点击跳转详情页
            $(".txt").children().hover(function(){
                $(this).css("color","black")
            },function(){
                $(this).css("color","gray")
            })
            $(".txt").children().on("click",function(){
                window.location.href=`/shopping/goods?id=${$(this).parent().attr("id")}`
            })
        })
    })
})