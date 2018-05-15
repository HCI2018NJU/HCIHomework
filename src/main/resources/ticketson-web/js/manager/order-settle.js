let totalNum;
const perPage = 10;
let activities ;

$.get("/api/manager/countActivitiesToSettle").done(function (data) {
    totalNum = data;
    layui.use(['laypage'],function () {
        let laypage = layui.laypage;
        laypage.render({
            elem: 'order-settle-page',
            count: totalNum,
            limit: perPage,
            layout: ['prev', 'page', 'next'],
            theme: '#f5c026',
            jump: function(obj){
                getActivitiesToSettle(obj.curr-1);
            }
        });
    });
}).fail(function (data) {
    layer.msg(data.responseText);
});


function getActivitiesToSettle(page) {
    $.get("/api/manager/getActivitiesToSettle",{
        "page":page,
        "perPage":perPage,
    }).done(function (data) {
        activities = data;
        setActivitiesToSettle(activities);
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}

function setActivitiesToSettle(activities) {
    $("#order-settle").find(" tbody").empty();
    activities.map(function (activity,index) {
        const activity_dom =
            "<tr>" +
            "<td>"+activity.aid+"</td>"+
            "<td>"+activity.vid+"</td>"+
            "<td>"+activity.name+"</td>"+
            "<td>"+activity.type+"</td>"+
            "<td>"+activity.begin+"~"+activity.end+"</td>"+
            "<td>"+activity.turnover.toFixed(2)+"</td>"+
            "<td>"+activity.dividend.toFixed(2)+"</td>"+
            "<td>"+activity.activityEarn.toFixed(2)+"</td>"+
            "<td>" +
            "<span class='table-btn' onclick='settleSingle("+index+")'>结算</span>"+
            "</td>"+
            "</tr>";
        $("#order-settle").find(" tbody").append(activity_dom);
    });
}

function settleAll() {
    let total = 0;
    activities.map(function (activity) {
        total = total + parseFloat(activity.activityEarn);
    });
    confirmSettle(null,total);
}

function settleSingle(index) {
    const activity = activities[index];
    const total = activity.activityEarn;
    const aid = activity.aid;
    confirmSettle(aid,total);
}

function confirmSettle(aid,total) {
    layer.prompt({
        formType: 1,
        value: '请输入密码',
        title: '结算金额：¥'+total.toFixed(2), //自定义文本域宽高
    }, function(value, index, elem){
        if(value==="请输入密码"){
            layer.msg("请输入密码");
        }else {
            $.post("/api/manager/settleActivity",{
                "aid":aid,
                "total":total,
                "bankPsw":value,
            }).done(function () {
                layer.close(index);
                forward("/pages/manager/order-settle.html");
            }).fail(function (data) {
                layer.msg(data.responseText);
            })
        }
    });
}

