let unSubscribedTotalNum = 0;
const perPage = 10;

getOrderTotalNum();

function getOrderTotalNum() {
    //获得退订的订单总数
    $.post("/api/order/getOrderTotalNum",{
        "mid":getMid(),
        "isUnSubscribed":true,
    }).done(function (data) {
        unSubscribedTotalNum = parseInt(data);
        layui.use(['laypage'],function () {
            let laypage = layui.laypage;
            laypage.render({
                elem: 'unsubscribed-page',
                count: unSubscribedTotalNum,
                limit: perPage,
                layout: ['prev', 'page', 'next'],
                theme: '#f5c026',
                jump: function(obj){
                    getUnSubscribedList(obj.curr-1);
                }
            });
        });
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}

//获得退订的订单列表
function getUnSubscribedList(page) {
    $.post("/api/order/getMyOrders",{
        "mid":getMid(),
        "page":page,
        "pageNum":perPage,
        "isUnSubscribed":true,
    }).done(function (data) {
        setUnSubscribedList(data);
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}

//将退订的订单列表填进界面
function setUnSubscribedList(orders) {
    $("#unsubscribed").find(" tbody").empty();
    orders.map(function (order,index) {
        const city = city_object[order.vCityCode].name;
        const order_dom =
            "<tr>" +
            "<td>"+order.oid+"</td>"+
            "<td>["+order.aType+"]&nbsp;"+order.aName+"-"+city+"<br>"+order.time+"</td>"+
            "<td>"+order.prices+"</td>"+
            "<td>"+order.totalAmount+"</td>"+
            "<td>"+order.couponName+"<br>会员优惠："+order.discountName+"</td>"+
            "<td>"+order.payPrice.toFixed(2)+"<br><span style='text-decoration: line-through'>"+order.totalPrice.toFixed(2)+"</span>"+"</td>"+
            "<td>"+order.unSubscribeFees.toFixed(2)+"</td>"+
            "<td>"+order.state+"</td>"+
            "<td><span style='cursor: pointer' onclick='toOrderDetail("+order.oid+")'>查看</span></td>"+
            "</tr>";
        $("#unsubscribed").find(" tbody").append(order_dom);
    });
}

//跳转到订单详情
function toOrderDetail(oid) {
    forward(`/pages/member/order-info.html?oid=${oid}`);
}

//预订订单页面
function toSubscribed() {
    forward("/pages/member/order-manage.html");
}

//未支付订单界面
function toToPay() {
    forward("/pages/member/order-toPay.html");
}

