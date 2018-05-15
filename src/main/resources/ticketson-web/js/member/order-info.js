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
    //初始化订单信息
    if(order.isUnSubscribed){
        initUnSubscribedTable(order);
    }else {
        initSubscribedTable(order);
    }
    //初始化票据信息
    if(order.tickets.length===0){
        $("#ticket-part").css("display","none");
    }else {
        order.tickets.map(function (ticket,index) {
            const ticket_dom =
                "<tr>" +
                "<td>"+ticket.tid+"</td>"+
                "<td>"+ticket.floor+"</td>"+
                "<td>"+ticket.gs+"</td>"+
                "<td>"+ticket.row+"排"+ticket.column+"座"+"</td>"+
                "<td>"+ticket.level+"</td>"+
                "<td>"+ticket.price+"</td>"+
                "<td>"+ticket.state+"</td>"+
                "</tr>";
            $("#ticket-part").find(" tbody").append(ticket_dom);
        });
    }

}


function initSubscribedTable(order) {
    const city = city_object[order.vCityCode].name;
    const order_dom =
        "<tr>" +
        "<td>"+order.oid+"</td>"+
        "<td>["+order.aType+"]&nbsp;"+order.aName+"-"+city+"<br>"+order.time+"</td>"+
        "<td>"+order.prices+"</td>"+
        "<td>"+order.totalAmount+"</td>"+
        "<td>"+order.couponName+"<br>会员优惠："+order.discountName+"</td>"+
        "<td>"+order.payPrice.toFixed(2)+"<br><span style='text-decoration: line-through'>"+order.totalPrice.toFixed(2)+"</span>"+"</td>"+
        "<td>"+order.state+"</td>"+
        "<td>"+order.orderDate+"</td>"+
        "</tr>";
    $("#subscribed").find(" tbody").append(order_dom);
    $("#subscribed").css("display","block");
}

function initUnSubscribedTable(order) {
    const city = city_object[order.vCityCode].name;
    const order_dom =
        "<tr>" +
        "<td>"+order.oid+"</td>"+
        "<td>["+order.aType+"]&nbsp;"+order.aName+"-"+city+"<br>"+order.time+"</td>"+
        "<td>"+order.prices+"</td>"+
        "<td>"+order.totalAmount+"</td>"+
        "<td>"+order.couponName+"</td>"+
        "<td>"+order.payPrice.toFixed(2)+"<br><span style='text-decoration: line-through'>"+order.totalPrice.toFixed(2)+"</span>"+"</td>"+
        "<td>"+order.unSubscribeFees.toFixed(2)+"</td>"+
        "<td>"+order.state+"</td>"+
        "<td>"+order.orderDate+"</td>"+
        "</tr>";
    $("#unsubscribed").find(" tbody").append(order_dom);
    $("#unsubscribed").css("display","block");
}