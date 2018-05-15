const now = new Date().getMilliseconds();
const perPage = 10;

const coupon_header_dom =
    "<div>" +
        "<div id='header'>我的ticketson&nbsp;>&nbsp;我的优惠券</div> "+
        "<div id='exchange-part'> "+
            "<div>"+
                "<select id='coupon-select' class='ticketson-select' onchange='changeCouponType()'></select> "+
                "<button class='ticketson-btn' onclick='exchangeCoupon()'>兑换</button> "+
            "</div>"+
            "<div style='color: #9f9f9f;font-size: 10px'>(此优惠券将消耗<span id='credit-cost'></span>积分）</div> "+
        "</div>"+
    "</div>";
$("#coupon-header-container").append(coupon_header_dom);

//获得可以兑换的优惠券
$.post("/api/coupon/getCouponTypes",{
    "mid":getMid(),
}).done(function (data) {
    initAvailableCoupons(data);
}).fail(function (data) {
    layer.msg(data.responseText);
});

//将可以兑换的优惠券填进界面
function initAvailableCoupons(couponTypes) {
    //优惠券
    couponTypes.map(function (couponType,index) {
        let coupon_dom = "<option value='"+couponType.type+"' minCredit='"+couponType.minCredit+"'>"+couponType.name+"</option>";
        $("#coupon-select").append(coupon_dom);
    });
}

//兑换优惠券
function exchangeCoupon() {
    const type = $("#coupon-select").val();
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

//选择需要兑换的优惠券
function changeCouponType() {
    const credit_cost = $("#coupon-select option:selected").attr("minCredit");
    $("#credit-cost").text(credit_cost);
}


function toUnusedCoupon() {
    forward("/pages/member/coupon.html");
}

function toUsedCoupon() {
    forward("/pages/member/coupon-used.html");
}
function toExpiredCoupon() {
    forward("/pages/member/coupon-expired.html");
}
