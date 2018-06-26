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
        if(totalNum>0){
            $(".nothing").css("display","none");
            $("#toPay-page").css("display","block");

        }else {
            $(".nothing").css("display","block");
            $("#toPay-page").css("display","none");

        }

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
        // setOrderList(data);
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
            "<li>订单原价：" +
            "<span class='order-detail-info'>¥"+order.totalPrice.toFixed(2)+"</span>" +
            "</ul>" +
            "</div>" +
            "</div>" +
            "<div class='order-item-right'>" +
            "<button class='order-info-btn-topay' style='display: block' oid='"+order.oid+"'>去支付</button>" +
            "<button class='order-btn-detail' oid='"+order.oid+"'>订单详情</button>" +
            "</div>"+
            "</ul>" +
            "</div>";
        $(".order-part").append(order_dom);
    });
    $(".order-btn-detail").on('click',function () {
        const oid = $(this).attr("oid");
        toOrderDetail(oid);
    });
    $(".order-info-btn-topay").on('click',function () {
        const oid = $(this).attr("oid");
        toConfirmOrder(oid);
    });
}

//跳转到订单详情
function toOrderDetail(oid) {
    forward(`/pages/member/order-info.html?oid=${oid}`);
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