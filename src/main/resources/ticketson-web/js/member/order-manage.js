let subscribedTotalNum = 0;
const perPage = 3;

getOrderTotalNum();

//获得我的总订单数
function getOrderTotalNum() {
    //获得预订的订单总数
    $.post("/api/order/getOrderTotalNum",{
        "mid":getMid(),
        "isUnSubscribed":false,
    }).done(function (data) {
        subscribedTotalNum = parseInt(data);
        console.log(subscribedTotalNum);
        if(subscribedTotalNum>0){
            $(".nothing").css("display","none");
            $("#subscribed-page").css("display","block");
        }else {
            $(".nothing").css("display","block");
            $("#subscribed-page").css("display","none");
        }

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
        // setSubscribedList(data);
        setData(data);
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}


function setData(orders) {
    $(".order-part").empty();
    orders.map((order,idx)=>{
        let city = city_object[order.vCityCode].name;
        if(city==="市辖区"){
            city = city_object[order.vCityCode].province;
        }
        let operation_content;
        if(order.canUnsubscribe){
            operation_content =
                "<div class='order-item-right'>" +
                "<button class='order-info-btn-unsub' style='display: block' oid='"+order.oid+"'>退订</button>" +
                "<button class='order-btn-detail' oid='"+order.oid+"'>订单详情</button>" +
                "</div>";
        }else {
            operation_content =
                "<div class='order-item-right'>" +
                "<button class='order-btn-detail' style='margin-top: 46px' oid='"+order.oid+"'>订单详情</button>" +
                "</div>";
        }
        const order_dom =
            "<div class='order-item'>" +
                "<ul class='order-item-title clearfix'>" +
                    "<li style='float: left'>订单号："+order.oidshow+"</li>" +
                    "<li style='float: right'>"+order.orderDate+"</li>" +
                "</ul>" +
                "<ul class='clearfix'>" +
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
                                "<li>数量：" +
                                    "<span class='order-detail-info'>"+order.totalAmount+"张</span>" +
                                "</li>" +
                                "<li>时间：" +
                                    "<span class='order-detail-info'>"+order.time+"</span>" +
                                "</li>" +
                                "<li>场馆：" +
                                    "<span class='order-detail-info'>"+order.vName+"</span>" +
                                "</li>" +
                                "<li>订单金额：" +
                                    "<span class='order-detail-info'>¥"+order.payPrice.toFixed(2)+"</span>" +
                                "</li>" +
                            "</ul>" +
                        "</div>" +
                    "</div>" +
                    operation_content+
                "</ul>" +
            "</div>";
        $(".order-part").append(order_dom);
    });
    $(".order-btn-detail").on('click',function () {
        const oid = $(this).attr("oid");
        toOrderDetail(oid);
    });
    $(".order-info-btn-unsub").on('click',function () {
        const oid = $(this).attr("oid");
        console.log(oid);
        unsubscribe(oid);
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