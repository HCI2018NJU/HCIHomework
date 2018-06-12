/**
 * Created by 铠联 on 2018/6/12.
 */
//获得预订的订单列表
function getTypeResultList(page) {
    // $.post("/api/order/getMyOrders",{
    //     "mid":getMid(),
    //     "page":page,
    //     "pageNum":perPage,
    //     "isUnSubscribed":false,
    // }).done(function (data) {
    //     setTypeResultList(data);
    // }).fail(function (data) {
    //     layer.msg(data.responseText);
    // });


}

//将预订的订单列表的数据填进界面
function setTypeResultList(orders) {
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