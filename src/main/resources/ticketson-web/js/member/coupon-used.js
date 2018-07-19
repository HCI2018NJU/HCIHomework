let usedCouponTotalNum = 0;

//获得已使用的优惠券总数
$.post("/api/coupon/getUsedCouponTotalNum",{
    "mid":getMid(),
}).done(function (data) {
    usedCouponTotalNum = parseInt(data);
    if(usedCouponTotalNum<=0){
        $(".nothing").css("display","block");
        $("#used-page").css("display","none");
    }else {
        if(usedCouponTotalNum<=perPage){
            getUsedCoupons(0);
        }else {
            $("#used-page").css("display","block");
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
        }
    }

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
            "<i class='icon-font'>&#xe64d;</i>" +
            "<div>使用日期："+coupon.consumeTime+"</div>" +
            "</div>" +
            "</div>";
        if(index%2===0){
            $(".coupon-left-part").append(coupon_item);
        }else {
            $(".coupon-right-part").append(coupon_item);
        }
    });
}

