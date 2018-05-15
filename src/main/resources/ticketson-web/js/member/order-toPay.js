let totalNum = 0;
const perPage = 10;

getOrderTotalNum();

//获得我的总订单数
function getOrderTotalNum() {
    //获得预订的订单总数
    $.post("/api/order/getOrderToPayTotalNum",{
        "mid":getMid(),
    }).done(function (data) {
        totalNum = parseInt(data);
        layui.use(['laypage'],function () {
            let laypage = layui.laypage;
            laypage.render({
                elem: 'toPay-page',
                count: totalNum,
                limit: perPage,
                layout: ['prev', 'page', 'next'],
                theme: '#f5c026',
                jump: function(obj){
                    getOrderList(obj.curr-1);
                }
            });
        });
    }).fail(function (data) {
        layer.msg(data.responseText);
    })
}

//获得预订的订单列表
function getOrderList(page) {
    $.post("/api/order/getOrdersToPay",{
        "mid":getMid(),
        "page":page,
        "perPage":perPage,
    }).done(function (data) {
        setOrderList(data);
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}

//将预订的订单列表的数据填进界面
function setOrderList(orders) {
    $("#toPay").find(" tbody").empty();
    orders.map(function (order,index) {
        const city = city_object[order.vCityCode].name;
        const order_dom =
            "<tr>" +
            "<td>"+order.oid+"</td>"+
            "<td>["+order.aType+"]&nbsp;"+order.aName+"-"+city+"<br>"+order.time+"</td>"+
            "<td>"+order.prices+"</td>"+
            "<td>"+order.totalAmount+"</td>"+
            "<td>"+order.orderDate+"</td>"+
            "<td>"+order.totalPrice.toFixed(2)+"</td>"+
            "<td>" +
                "<span style='cursor: pointer' onclick='toConfirmOrder("+order.oid+")'>去支付</span>"+
            "</td>"+
            "</tr>";
        $("#toPay").find(" tbody").append(order_dom);
    });
}


//跳转到订单详情
function toConfirmOrder(oid) {
    forward(`/pages/venue/activity/confirm-order.html?oid=${oid}`);
}

function toSubscribed() {
    forward("/pages/member/order-manage.html");
}

function toUnsubscribed() {
    forward("/pages/member/order-manage-unsubscribed.html");
}