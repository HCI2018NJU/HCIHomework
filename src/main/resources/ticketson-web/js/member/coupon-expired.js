let expiredCouponTotalNum = 0;

//获得未使用但已过期的优惠券总数
$.post("/api/coupon/getExpiredCouponTotalNum",{
    "mid":getMid(),
    "date":now,
}).done(function (data) {
    expiredCouponTotalNum = data;
    layui.use(['laypage'],function () {
        let laypage = layui.laypage;
        laypage.render({
            elem: 'expired-page',
            count: expiredCouponTotalNum,
            limit: perPage,
            layout: ['prev', 'page', 'next'],
            theme: '#f5c026',
            jump: function(obj){
                getExpiredCoupons(obj.curr-1);
            }
        });
    });
}).fail(function (data) {
    layer.msg(data.responseText);
});

//获得未使用但已过期的优惠券
function getExpiredCoupons(page) {
    $.post("/api/coupon/getExpiredCoupons",{
        "mid":getMid(),
        "date":now,
        "page":page,
        "pageNum":perPage,
    }).done(function (data) {
        setExpiredCoupons(data);
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}

//将未使用但已过期的优惠券填进界面
function setExpiredCoupons(coupons) {
    $("#expired").find(" tbody").empty();
    coupons.map(function (coupon,index) {
        let coupon_dom =
            "<tr>" +
            "<td>"+coupon.cid+"</td>"+
            "<td>"+coupon.name+"</td>"+
            "<td>"+"-"+coupon.minus+"</td>"+
            "<td>"+"消费超过"+coupon.min+"</td>"+
            "<td>"+coupon.validDateBegin+"&nbsp;-&nbsp;"+coupon.validDateEnd+"</td>"+
            "</tr>";
        $("#expired").find(" tbody").append(coupon_dom);
    })
}
