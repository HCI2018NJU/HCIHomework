let subscribedTotalNum = 0;
const perPage = 10;

getOrderTotalNum();

//获得我的总订单数
function getOrderTotalNum() {
    //获得预订的订单总数
    $.post("/api/order/getOrderTotalNum",{
        "mid":getMid(),
        "isUnSubscribed":false,
    }).done(function (data) {
        subscribedTotalNum = parseInt(data);
        layui.use(['laypage'],function () {
            let laypage = layui.laypage;
            laypage.render({
                elem: 'subscribed-page',
                count: subscribedTotalNum,
                limit: perPage,
                layout: ['prev', 'page', 'next'],
                theme: '#f5c026',
                jump: function(obj){
                    getSubscribedList(obj.curr-1);
                }
            });
        });
    }).fail(function (data) {
        layer.msg(data.responseText);
    })
}

//获得预订的订单列表
function getSubscribedList(page) {
    $.post("/api/order/getMyOrders",{
        "mid":getMid(),
        "page":page,
        "pageNum":perPage,
        "isUnSubscribed":false,
    }).done(function (data) {
        setSubscribedList(data);
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}

//将预订的订单列表的数据填进界面
function setSubscribedList(orders) {
    $("#subscribed").find(" tbody").empty();
    orders.map(function (order,index) {
        const city = city_object[order.vCityCode].name;
        let operation_content;
        if(order.canUnsubscribe){
            operation_content =
                "<td>" +
                "<span style='cursor: pointer' onclick='toOrderDetail("+order.oid+")'>查看</span>" +
                "&nbsp;|&nbsp;" +
                "<span style='cursor: pointer' onclick='unsubscribe("+order.oid+")'>退订</span>" +
                "</td>";
        }else {
            operation_content =
                "<td>" +
                "<span style='cursor: pointer' onclick='toOrderDetail("+order.oid+")'>查看</span>" +
                "</td>";
        }
        const order_dom =
            "<tr>" +
            "<td>"+order.oid+"</td>"+
            "<td>["+order.aType+"]&nbsp;"+order.aName+"-"+city+"<br>"+order.time+"</td>"+
            "<td>"+order.prices+"</td>"+
            "<td>"+order.totalAmount+"</td>"+
            "<td>"+order.couponName+"<br>会员优惠："+order.discountName+"</td>"+
            "<td>"+order.payPrice.toFixed(2)+"<br><span style='text-decoration: line-through'>"+order.totalPrice.toFixed(2)+"</span>"+"</td>"+
            "<td>"+order.state+"</td>"+
            operation_content+
            "</tr>";
        $("#subscribed").find(" tbody").append(order_dom);
    });
}


//跳转到订单详情
function toOrderDetail(oid) {
    forward(`/pages/member/order-info.html?oid=${oid}`);
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

//退订订单页面
function toUnsubscribed() {
    forward("/pages/member/order-manage-unsubscribed.html");
}

//未支付订单界面
function toToPay() {
    forward("/pages/member/order-toPay.html");
}