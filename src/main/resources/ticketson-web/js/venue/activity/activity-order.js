let totalNum = 0;
const perPage = 10;
const aid = getUrlParam("aid");
const search_id = getUrlParam("id");
const period_type = getUrlParam("period");

//初始化场次选择
const all_period_dom = "<option period='all' value='"+aid+"'>所有场次</option>";
$("#period-select").append(all_period_dom);
const periods = JSON.parse(window.localStorage.getItem("period"));
periods.map(function (period) {
    const option_dom = "<option period='single' value='"+period.pid+"'>"+period.begin+"</option>";
    $("#period-select").append(option_dom);
});
$("#period-select").val(search_id);

//选择场次，跳转到相应的场次订单界面
function toSelectedOrders() {
    const periodType = $("#period-select option:selected").attr("period");
    const id = $("#period-select option:selected").attr("value");
    forward("/pages/venue/activity/activity-order.html?period="+periodType+"&id="+id+"&aid="+aid);
}

getOrderTotalNum();

//获得预订的订单总数
function getOrderTotalNum() {
    $.post("/api/order/getOrderTotalNumByPeriod",{
        "id":search_id,
        "periodType": period_type
    }).done(function (data) {
        totalNum = parseInt(data);
        console.log(totalNum);
        layui.use(['laypage'],function () {
            let laypage = layui.laypage;
            laypage.render({
                elem: 'subscribed-page',
                count: totalNum,
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
    console.log(page);
    $.post("/api/order/getOrdersByPeriod",{
        "id":search_id,
        "periodType":period_type,
        "page":page,
        "pageNum":perPage,
    }).done(function (data) {
        console.log(data);
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
        const order_dom =
            "<tr>" +
            "<td>"+order.oid+"</td>"+
            "<td>["+order.aType+"]&nbsp;"+order.aName+"-"+city+"<br>"+order.time+"</td>"+
            "<td>"+order.prices+"</td>"+
            "<td>"+order.totalAmount+"</td>"+
            "<td>"+order.couponName+"<br>会员优惠："+order.discountName+"</td>"+
            "<td>"+order.payPrice+"<br><span style='text-decoration: line-through'>"+order.totalPrice+"</span>"+"</td>"+
            "<td>"+order.state+"</td>"+
            "<td>" +
            "<span style='cursor: pointer' onclick='toOrderDetail("+order.oid+")'>查看</span>" +
            "</td>"+
            "</tr>";
        $("#subscribed").find(" tbody").append(order_dom);
    });
}


//跳转到订单详情
function toOrderDetail(oid) {
    forward(`/pages/venue/activity/activity-order-info.html?oid=${oid}`);
}

