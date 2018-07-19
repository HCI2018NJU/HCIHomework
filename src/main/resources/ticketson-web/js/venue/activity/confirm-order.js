//获得订单信息
const oid = getUrlParam("oid");

let order = {};
$.post("/api/order/getConfirmOrder",{
    "oid":oid,
}).done(function (data) {
    order = data;
    initConfirmOrder(order);
}).fail(function (data) {
    layer.alert(data.responseText,function (index) {
        layer.close(index);
        forward(`/pages/type/index.html`);
    });
});

//将数据填进界面
function initConfirmOrder(order) {
    $("#container").css("display","block");
    let city = city_object[order.vCityCode].name;
    if(city==='市辖区'){
        city = city_object[order.vCityCode].province;
    }
    //标题
    $("#city").text(city);
    $("#type").text(order.aType);
    $("#title").text(order.aName);
    $("#time").text(order.time);
    $("#venue-name").text(order.vName);

    $("#email").text(order.email);

    $("#a-name").text("【"+order.aType+"】"+order.aName+" -- "+city);
    $("#a-img").attr("src",order.aUrl);
    $("#prices").text(order.prices);
    $("#v-location").text(order.vName+" -- "+order.vLocation);
    $("#time").text(order.time);
    $("#total-amount").text(order.totalAmount+" 张");


    //商品清单
    if(!order.isImmediatePurchase){
        order.tickets.map(function (ticket,index) {
            let ticket_dom =
                "<div style='overflow: hidden'>" +
                    "<label style='float: left'>"+ticket.floor+ticket.gs+ticket.row+"排"+ticket.column+"座"+"</label>"+
                    "<label style='float: right;color:#a5a4a5 '>"+ticket.price+"元 X 1"+"</label>"
                "</div>";
            $("#tickets").append(ticket_dom);
            // let tr_dom =
            //     "<tr>" +
            //     "<td>"+order.aName+"&nbsp;"+city+"&nbsp;"+order.time+"</td>"+
            //     "<td>"+ticket.row+"排"+ticket.column+"座"+"</td>"+
            //     "<td>"+ticket.floor+"</td>"+
            //     "<td>"+ticket.gs+"</td>"+
            //     "<td>"+ticket.price+"("+ticket.level+"等)"+"</td>"+
            //     "</tr>";
            // $("#goods-list").find(" tbody").append(tr_dom);
            // $("#goods-list").css("display","block");
            // $("#immediate-goods-list").css("display","none");
        });
        $("#tickets").css("display","block");
    }else {
        // let tr_dom =
        //     "<tr>" +
        //     "<td>"+order.aName+"&nbsp;&nbsp;-&nbsp;&nbsp;"+city+"</td>"+
        //     "<td>"+order.time+"</td>"+
        //     "<td>"+order.level+"</td>"+
        //     "<td>"+order.prices+"</td>"+
        //     "<td>"+order.totalAmount+"</td>"+
        //     "</tr>";
        // $("#immediate-goods-list").find(" tbody").append(tr_dom);
        // $("#goods-list").css("display","none");
        // $("#immediate-goods-list").css("display","block");
    }

    //优惠券
    if(order.coupons.length>0){
        $("#coupon-select").empty();
    }
    // $("#coupon-select").empty();
    order.coupons.map(function (coupon,index) {
        let coupon_dom = "<option value='"+coupon.cid+"' minus='"+coupon.minus+"' name='"+coupon.name+"'>"+coupon.name+"</option>";
        $("#coupon-select").append(coupon_dom);
    });
    let minus = $("#coupon-select option:selected").attr("minus") || 0;
    $(".total-price").text(order.totalPrice.toFixed(2));
    let after_discount = order.totalPrice*order.discount-minus;
    $("#after-discount").text(after_discount.toFixed(2));
    $("#pay-price").text(after_discount.toFixed(2));
    $("#acquire-credit").text(parseInt(after_discount/8));
    $("#member-discount").text("(会员优惠："+order.discountName+")");

}

//选择优惠券
function changeCoupon() {
    let minus = $("#coupon-select option:selected").attr("minus") || 0;
    const temp = order.totalPrice*order.discount-minus;
    $("#after-discount").text(temp);
    $("#pay-price").text(temp);
    $("#acquire-credit").text(parseInt(temp/8));
}

//支付订单
function pay() {
    console.log("pay");
    //long oid,long cid,double payPrice,String bankType,long bid,String bankPsw
    let bankType;
    bankType = $("input[name='pay']:checked").val();
    console.log(bankType);
    const bid = $("#bid").val();
    const bankPsw = $("#bankPsw").val();
    console.log(bid);
    console.log(bankPsw);
    if(bid===""||bankPsw===""){
        layer.msg("请填写支付账号和密码");
        return;
    }
    if(!(bid==="1"||bid==="2"||bid==="3")){
        layer.msg("账号或密码错误");
        return;
    }
    $.post("/api/subscribe/pay",{
        "mid":getMid(),
        "oid":oid,
        "cid":$("#coupon-select option:selected").attr("value"),
        "payPrice":$("#after-discount").text(),//todo 这样会不会有什么问题？
        "bankType":bankType,
        "bid":bid,
        "bankPsw":bankPsw,
        "couponName":$("#coupon-select option:selected").attr("name"),
        "discount":order.discount,
    }).done(function () {
        forward("/pages/member/order-manage.html");
    }).fail(function (data) {
        layer.alert(data.responseText,function (index) {
            layer.close(index);
            if(data.responseText!=="余额不足"&&data.responseText!=="请检查账号和密码是否正确"){
                const aid = order.aid;
                forward(`/pages/venue/activity/activity-info.html?aid=${aid}`)
            }
        });
    });
}