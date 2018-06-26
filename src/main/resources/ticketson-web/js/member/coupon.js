/**
 * Created by shea on 2018/6/25.
 */

//获得可以兑换的优惠券
$.post("/api/coupon/getCouponTypes",{
    "mid":getMid(),
}).done(function (data) {
    initAvailableCoupons(data);
}).fail(function (data) {
    layer.msg(data.responseText);
});

function initAvailableCoupons(coupons) {
    if(coupons.length<=0){
        $(".nothing").css("display","block");
    }
    $(".coupon-right-part").empty();
    $(".coupon-left-part").empty();
    //优惠券
    coupons.map(function (coupon,index) {
        const coupon_item = 
            "<div class='coupon-item'>"+
           "<div class='coupon-item-left-part'>"+
           "<div>¥<span class='minus'>"+coupon.minus+"</span></div>"+
           "<div class='min'>订单金额满<span>"+coupon.min+"</span>可使用</div>"+
           "<div class='min-credit'>兑换此优惠券将消耗<span>"+coupon.minCredit+"</span>积分</div>"+
           "</div>"+
           "<div class='coupon-item-right-part'>"+
           "<div coupon-type='"+coupon.type+"'>立即领取</div>"+
           "</div>"+
           "</div>";
        if(index%2===0){
            $(".coupon-left-part").append(coupon_item);
        }else {
            $(".coupon-right-part").append(coupon_item);
        }
    });
    $(".coupon-item-right-part>div").on('click',function () {
        const type = $(this).attr("coupon-type");
        exchangeCoupon(type);
    });
}

function exchangeCoupon(type) {
    $.post("/api/coupon/exchangeCoupon", {
        "mid": getMid(),
        "type": type,
    }).done(function () {
        //刷新页面
        forward("/pages/member/coupon.html");
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}
