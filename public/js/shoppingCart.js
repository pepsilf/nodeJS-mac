require(["config"], function() {
    require(["jquery", "idcode", "md5", "validate","cookie"], function () {
        $(function () {
            //加载头部和底部
            $(".head").load("/head.html",function(){
                jQuery.getScript("/js/head.js")
            })
            $(".foot").load("/foot.html")
            
            //如果已登陆加载购物车信息
            var users = JSON.parse(sessionStorage.getItem("users") || '{}');
            if(users.uname) {
                console.log("ll")
                $.ajax({
                    type: "post",
                    url: "/shopping/shoppingCart",
                    data: {
                        "uname": users.uname,
                    },
                    dataType: "json",
                }).then(function (back) {
                    if (back.status) {
                        $str = "";
                        $nums = 0;
                        $moneys = 0;
                        var arr=JSON.parse(back.data)
                        for (var i in arr) {
                            var moneys = arr[i].g_price.split("￥")[1] * arr[i].g_nums
                            $moneys += moneys;
                            $nums = arr[i].g_nums - 0 + $nums;
                            $str = $str + `<tr>
                                    <th class="selector"><input type="checkbox" class="oneChecked"/></th>
                                    <th>
                                        <div>
                                            <img src="${arr[i].g_src}">
                                            <span>${arr[i].g_name}</span>
                                            <p>商品编号：${arr[i].g_num}</p>
                                        </div>
                                    </th>
                                    <th>${arr[i].g_price}</th>
                                    <th class="nums"><span>-</span><input type="text" value="${arr[i].g_nums}"><span>+</span></th>
                                    <th>￥${moneys}</th>
                                    <th class="del" gid='${arr[i].g_id}' uname='${arr[i].u_name}'><span>X删除</span></th>
                                </tr>`
                        }
                    }
                    $("#tab").html($str)
                    $(".numbers").text($nums)
                    $(".moneys").text("￥"+$moneys)
                    //调用函数修改宝贝数量
                    alterCarts()
                    //调用删除宝贝函数
                    removeCarts()
                    //全选/反选
                    allChecked()
                })
            }else{
                var cartList=JSON.parse($.cookie("carts")||"[]")
                $str = "";
                $nums = 0;
                $moneys = 0;
                for(var i in cartList){
                    var moneys = cartList[i].price.split("￥")[1] * cartList[i].nums
                    $moneys += moneys;
                    $nums = cartList[i].nums - 0 + $nums;
                    $str = $str + `<tr>
                                    <th class="selector"><input type="checkbox" /></th>
                                    <th>
                                        <div>
                                            <img src="${cartList[i].p1}">
                                            <span>${cartList[i].name}</span>
                                            <p>商品编号：${cartList[i].num}</p>
                                        </div>
                                    </th>
                                    <th>${cartList[i].price}</th>
                                    <th class="nums"><span>-</span><input type="text" value="${cartList[i].nums}"><span>+</span></th>
                                    <th>￥${moneys}</th>
                                    <th class="del" gid='${cartList[i].gid}'><span>X删除</span></th>
                                </tr>`
                }
                $("#tab").html($str)
                $(".numbers").text($nums)
                $(".moneys").text("￥"+$moneys)
                //修改数量函数
                alterCarts()
                //删除宝贝函数
                removeCarts()
                //全选反选函数
                allChecked()
            }
            //修改数量函数
            function alterCarts(){
                $(".nums span").on("click",function(){
                    $m=($(".moneys").text()).split("￥")[1];        //修改前所有宝贝总金额
                    $p=($(this).parent().prev().text()).split("￥")[1]    //宝贝价格
                    if($(this).text()=="+"){
                        $(this).prev().val($(this).prev().val()-0+1)
                        $(".numbers").text($(".numbers").text()-0+1)
                        $m=$m-0+($p-0);
                    }else{
                        if($(this).next().val()>1){
                            $(this).next().val($(this).next().val()-1)
                            $(".numbers").text($(".numbers").text()-1)
                            $m=$m-$p;
                        }
                    }
                    $n=$(this).parent().children("input").val()           //宝贝修改后数量
                    $(this).parent().next().text('￥'+$n*$p)              //单个宝贝总金额
                    $(".moneys").text('￥'+$m)                            //所有宝贝总金额
                    $(this).parent().next().next().attr('gid')            // 修改数据库宝贝数量
                    if(users.uname){
                        $.ajax({
                            "url":"/shopping/shoppingCart",
                            "type":"post",
                            "data":{
                                "uname":$(this).parent().next().next().attr('uname'),
                                "gid":$(this).parent().next().next().attr('gid'),
                                "nums":$n,
                            },
                            "dataType":"json"
                        })
                    }else{
                        var cartList=JSON.parse($.cookie("carts")||"[]")
                        for(var i in cartList){
                            if(cartList[i].gid==$(this).parent().next().next().attr('gid')){
                                cartList[i].nums=$n;
                                break;
                            }
                        }
                        $.cookie("carts",JSON.stringify(cartList),{ path: '/' })
                    }
                })
            }
            //删除宝贝函数
            function removeCarts(){
                $(".del span").hover(function(){
                    $(this).css("color","black")
                },function(){
                    $(this).css("color","gray")
                })
                $(".del span").on("click",function(){
                    $self=$(this)
                    $(".dels").show().animate({
                        "top":48+$self.parent().parent().index()*130,
                    },500)
                    $(".dels span").eq(0).on("click",function(){
                        $(this).parent().hide().css("top",-50)
                        if(users.uname) {
                            $.ajax({
                                url: "/shopping/shoppingCart",
                                type: "post",
                                data: {
                                    'uname': $self.parent().attr("uname"),
                                    'gid': $self.parent().attr("gid"),
                                },
                                dataType: "json",
                            }).then(function (back) {
                                if (back.status) {
                                    $self.parent().parent().remove()
                                } else {
                                    console.log(back.msg)
                                }
                            })
                        }else{
                            var cartList=JSON.parse($.cookie("carts")||"[]")
                            for(var i in cartList){
                                if(cartList[i].gid==$self.parent().attr('gid')){
                                    cartList.splice(i,1);
                                    break;
                                }
                            }
                            $self.parent().parent().remove()
                            $.cookie("carts",JSON.stringify(cartList),{ path: '/' })
                        }
                    })
                    $(".dels span").eq(1).on("click",function(){
                        $(this).parent().hide().css("top",-50)
                    })
                })
            }
            //全选反选函数
            function allChecked(){
                $(".allCheaked").on("click",function(){
                    $(".oneChecked").prop("checked",$(this).prop("checked"))
                    $(".allCheaked").prop("checked",$(this).prop("checked"))
                })
                $(".oneChecked").on("click",function(){
                    if($(".oneChecked").length==$(".oneChecked:checked").length){
                        $(".allCheaked").prop("checked",true)
                    }else{
                        $(".allCheaked").prop("checked",false)
                    }
                })
            }
            $(".money").on("click",function(){    
                if($(".numbers").text()-0){   //判断购物车是否有宝贝存在
                    if(users.uname){          //判断是否登陆
                        location="/user"
                    }else{
                        alert("请登录")
                        location="/user/login"
                    }
                }else{
                    alert("请先添加宝贝哦!")
                }
            })
        })
    })
})