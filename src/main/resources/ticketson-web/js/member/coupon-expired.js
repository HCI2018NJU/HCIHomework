let expiredCouponTotalNum = 0;

//获得未使用但已过期的优惠券总数
$.post("/api/coupon/getExpiredCouponTotalNum",{
    "mid":getMid(),
    "date":now,
}).done(function (data) {
    expiredCouponTotalNum = data;
    if(expiredCouponTotalNum>0){
        $(".nothing").css("display","none");
        $("#expired-page").css("display","block");
    }else {
        $(".nothing").css("display","block");
        $("#expired-page").css("display","none");
    }
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

    $(".coupon-right-part").empty();
    $(".coupon-left-part").empty();
    //优惠券
    coupons.map(function (coupon,index) {
        const coupon_item =
            "<div class='coupon-item coupon-used'>" +
            "<div class='coupon-item-left-part'>" +
            "<div>¥<span class='minus'>" + coupon.minus + "</span></div>" +
            "<div class='min'>订单金额满<span>" + coupon.min + "</span>可使用</div>" +
            "<div class='min-credit'>有效期" + coupon.validDateBegin + "&nbsp;-&nbsp;" + coupon.validDateEnd + "</div>" +
            "</div>" +
            "<div class='coupon-item-right-part'>" +
            "<div coupon-type='" + coupon.type + "'>立即使用</div>" +
            "</div>" +
            "<div class='used-icon'>" +
            "<i class='icon-font'>&#xe64e;</i>" +
            "</div>" +
            "</div>";
        if(index%2===0){
            $(".coupon-left-part").append(coupon_item);
        }else {
            $(".coupon-right-part").append(coupon_item);
        }
    });
}
