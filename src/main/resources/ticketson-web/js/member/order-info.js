const oid = getUrlParam("oid");
let order = {};

$.post("/api/order/getOrder",{
    "oid":oid,
}).done(function (data) {
    console.log(data);
    initOrderInfo(data);
}).fail(function (data) {
    layer.msg(data.responseText);
});


function initOrderInfo(order) {
    $("#order-state").text(order.state);
    $("#order-id").text("订单编号："+order.oidshow);
    $("#order-date").text("下单时间："+order.orderDate);

    $(".total-price").text("¥"+order.totalPrice.toFixed(2));
    $(".pay-price").text("¥"+order.payPrice.toFixed(2));
    $(".return-score").text(order.addCredit);
    $("#buyer").text(order.mName+" - "+order.mEmail);
    $(".unsub-fees").text("¥"+order.unSubscribeFees.toFixed(2));


    initData(order);
    if(order.isUnSubscribed){
        $("#unsub-price-part").css("display","block");
    }else if(order.state==="等待支付"){
        $("#topay-price-part").css("display","block");
        $(".order-info-btn-topay").css("display","block");
        $(".order-info-btn-topay").on('click',function () {
            const oid = order.oid;
            forward(`/pages/venue/activity/confirm-order.html?oid=${oid}`);
        });
    }else {
        $("#sub-price-part").css("display","block");
        if(order.canUnsubscribe){
            $(".order-info-btn-unsub").css("display","block");
            $(".order-info-btn-unsub").on('click',function () {
                const oid = order.oid;
                unsubscribe(oid);
            });

        }
    }
    //初始化票据信息
    if(order.tickets.length===0){
        $("#ticket-part").css("display","none");
    }else {
        order.tickets.map(function (ticket,index) {
            const ticket_dom =
                "<tr>" +
                "<td>"+ticket.tid+"</td>"+
                "<td>"+ticket.floor+ticket.gs+","+ticket.row+"排"+ticket.column+"座"+"</td>"+
                "<td>"+ticket.price+"</td>"+
                "<td>"+ticket.state+"</td>"+
                "</tr>";
            $("#order-info-wrapper").find(" tbody").append(ticket_dom);
        });
    }

}


function initData(order) {
    let city = city_object[order.vCityCode].name;
    if(city==="市辖区"){
        city = city_object[order.vCityCode].province;
    }
    const sub_order_dom =
        "<div class='order-item-left'>" +
            "<div style='float: left;display: inline-block'>" +
                "<a href='../../pages/venue/activity/activity-info.html?aid="+order.aid+"' target='_blank' style='float: left'>" +
                "<img src='"+order.aUrl+"'>" +
                "</a>" +
            "</div>" +
            "<div style='float: left;display: inline-block'>" +
                "<ul class='order-show-info'>" +
                    "<li>" +
                        "<a href='../../pages/venue/activity/activity-info.html?aid="+order.aid+"' target='_blank'>" +
                        "<span class='order-show-info-title'>【"+order.aType+"】"+order.aName+"&nbsp;-&nbsp;"+city+"</span>" +
                        "</a>" +
                    "</li>" +
                    "<li>票价：" +
                        "<span class='order-detail-info'>"+order.prices+"</span>" +
                    "</li>" +
                    "<li>张数：" +
                        "<span class='order-detail-info'>"+order.totalAmount+"张</span>" +
                    "</li>" +
                    "<li>时间：" +
                        "<span class='order-detail-info'>"+order.time+"</span>" +
                    "</li>" +
                    "<li>场馆：" +
                        "<span class='order-detail-info'>"+order.vName+"</span>" +
                    "</li>"+

                "</ul>" +
            "</div>" +
        "</div>";
    $("#order-info-container").append(sub_order_dom);
}

//退订
function unsubscribe(oid) {
    $.post("/api/subscribe/unsubscribe",{
        "oid":oid,
    }).done(function (data) {
        //刷新界面
        layer.alert(`扣除手续费¥${data.unsubscribeFees.toFixed(2)},已返回¥${data.returnMoney.toFixed(2)}`,function (index) {
            layer.close(index);
            forward("/pages/member/order-manage.html");
        });
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}
