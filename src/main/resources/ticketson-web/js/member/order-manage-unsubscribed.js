let unSubscribedTotalNum = 0;
const perPage = 3;

getOrderTotalNum();

function getOrderTotalNum() {
    //获得退订的订单总数
    $.post("/api/order/getOrderTotalNum",{
        "mid":getMid(),
        "isUnSubscribed":true,
    }).done(function (data) {
        unSubscribedTotalNum = parseInt(data);
        if(unSubscribedTotalNum>0){
            $(".nothing").css("display","none");
            $("#unsubscribed-page").css("display","block");
        }else {
            $(".nothing").css("display","block");
            $("#unsubscribed-page").css("display","none");
        }

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
        // setUnSubscribedList(data);
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
                                "<li>订单金额：" +
                                    "<span class='order-detail-info'>¥"+order.payPrice.toFixed(2)+"</span>" +
                                "</li>" +
                                "<li>退订手续费：" +
                                    "<span class='order-detail-info'>¥"+order.unSubscribeFees.toFixed(2)+"("+order.state+")</span>" +
                                "</li>" +
                            "</ul>" +
                        "</div>" +
                    "</div>" +
                    "<div class='order-item-right'>" +
                    "<button class='order-btn-detail order-btn' oid='"+order.oid+"'>订单详情</button>" +
                    "</div>"+
                "</ul>" +
            "</div>";
        $(".order-part").append(order_dom);
    });
    $(".order-btn-detail").on('click',function () {
        const oid = $(this).attr("oid");
        toOrderDetail(oid);
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

