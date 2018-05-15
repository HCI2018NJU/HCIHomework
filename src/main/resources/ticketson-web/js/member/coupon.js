let unusedCouponTotalNum = 0;


//切换优惠券类型
$("#my-ticketson-nav>div").on("click",function () {
    //改变导航栏掩饰
    $("#my-ticketson-nav>div").removeClass("selected-tab");
    $(this).addClass("selected-tab");
    //显示指定的优惠券列表
    $(".coupon").css("display","none");
    const selected = $(this).attr("tab");
    $(`#${selected}`).css("display","block");
});


//获得未使用且未过期的优惠券总数
$.post("/api/coupon/getUnusedCouponTotalNum",{
    "mid":getMid(),
    "date":now,
}).done(function (data) {
    unusedCouponTotalNum = data;
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
    $("#unused").find(" tbody").empty();
    coupons.map(function (coupon,index) {
        let coupon_dom =
            "<tr>" +
                "<td>"+coupon.cid+"</td>"+
                "<td>"+coupon.name+"</td>"+
                "<td>"+"-"+coupon.minus+"</td>"+
                "<td>"+"消费超过"+coupon.min+"</td>"+
                "<td>"+coupon.validDateBegin+"&nbsp;-&nbsp;"+coupon.validDateEnd+"</td>"+
            "</tr>";
        $("#unused").find(" tbody").append(coupon_dom);
    });
}






