let unusedCouponTotalNum = 0;

//
// //切换优惠券类型
// $("#my-ticketson-nav>div").on("click",function () {
//     //改变导航栏掩饰
//     $("#my-ticketson-nav>div").removeClass("selected-tab");
//     $(this).addClass("selected-tab");
//     //显示指定的优惠券列表
//     $(".coupon").css("display","none");
//     const selected = $(this).attr("tab");
//     $(`#${selected}`).css("display","block");
// });


//获得未使用且未过期的优惠券总数
$.post("/api/coupon/getUnusedCouponTotalNum",{
    "mid":getMid(),
    "date":now,
}).done(function (data) {
    unusedCouponTotalNum = data;
    if(unusedCouponTotalNum<=0){
        $(".nothing").css("display","block");
        $("#unused-page").css("display","none");
    }else {
        if(unusedCouponTotalNum<=perPage){
            $("#unused-page").css("display","none");
            getUnusedCoupons(0);
        }else {
            $("#unused-page").css("display","block");
            layui.use(['laypage'],function () {
                let laypage = layui.laypage;
                laypage.render({
                    elem: 'unused-page',
                    count: unusedCouponTotalNum,
                    limit: perPage,
                    layout: ['prev', 'page', 'next'],
                    theme: '#f5c026',
                    jump: function(obj){
                        getUnusedCoupons(obj.curr-1);
                    }
                });
            });
        }
    }
}).fail(function (data) {
    layer.msg(data.responseText);
});


//获得未使用且未过期的优惠券
function getUnusedCoupons(page) {
    $.post("/api/coupon/getUnusedCoupons",{
        "mid":getMid(),
        "date":now,
        "page":page,
        "pageNum":perPage,
    }).done(function (data) {
        setUnusedCoupons(data);
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}

//将未使用且未过期的优惠券填进界面
function setUnusedCoupons(coupons) {
    $(".coupon-right-part").empty();
    $(".coupon-left-part").empty();
    //优惠券
    coupons.map(function (coupon,index) {
        const coupon_item =
            "<div class='coupon-item'>"+
            "<div class='coupon-item-left-part'>"+
            "<div>¥<span class='minus'>"+coupon.minus+"</span></div>"+
            "<div class='min'>订单金额满<span>"+coupon.min+"</span>可使用</div>"+
            "<div class='min-credit'>有效期"+coupon.validDateBegin+"&nbsp;-&nbsp;"+coupon.validDateEnd+"</div>"+
            "</div>"+
            "<div class='coupon-item-right-part'>"+
            "<div coupon-type='"+coupon.type+"'>立即使用</div>"+
            "</div>"+
            "</div>";
        if(index%2===0){
            $(".coupon-left-part").append(coupon_item);
        }else {
            $(".coupon-right-part").append(coupon_item);
        }
    });
    $(".coupon-item-right-part>div").on('click',function () {
        forward("/pages/type/index.html");

    });

}






