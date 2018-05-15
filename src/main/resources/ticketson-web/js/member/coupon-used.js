let usedCouponTotalNum = 0;

//获得已使用的优惠券总数
$.post("/api/coupon/getUsedCouponTotalNum",{
    "mid":getMid(),
}).done(function (data) {
    usedCouponTotalNum = parseInt(data);
    layui.use(['laypage'],function () {
        let laypage = layui.laypage;
        laypage.render({
            elem: 'used-page',
            count: usedCouponTotalNum,
            limit: perPage,
            layout: ['prev', 'page', 'next'],
            theme: '#f5c026',
            jump: function(obj){
                getUsedCoupons(obj.curr-1);
            }
        });
    });
}).fail(function (data) {
    layer.msg(data.responseText);
});


//获得已使用的优惠券
function getUsedCoupons(page) {
    $.post("/api/coupon/getUsedCoupons",{
        "mid":getMid(),
        "date":now,
        "page":page,
        "pageNum":perPage,
    }).done(function (data) {
        setUsedCoupons(data);
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}

//将已使用的优惠券填进界面
function setUsedCoupons(coupons) {
    $("#used").find(" tbody").empty();
    coupons.map(function (coupon,index) {
        let coupon_dom =
            "<tr>" +
            "<td>"+coupon.cid+"</td>"+
            "<td>"+coupon.name+"</td>"+
            "<td>"+"-"+coupon.minus+"</td>"+
            "<td>"+coupon.order.oid+"</td>"+
            "<td>"+coupon.consumeTime+"</td>"+
            "</tr>";
        $("#unused").find(" tbody").append(coupon_dom);
    })
}

