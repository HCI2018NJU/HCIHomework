let totalNum;
const perPage = 10;
let activities ;

$.get("/api/activity/getStatisticsTotalNum",{
    "vid":window.localStorage.getItem("vid"),
}).done(function (data) {
    totalNum = data;
    console.log(totalNum);
    layui.use(['laypage'],function () {
        let laypage = layui.laypage;
        laypage.render({
            elem: 'finance-table-page',
            count: totalNum,
            limit: perPage,
            layout: ['prev', 'page', 'next'],
            theme: '#f5c026',
            jump: function(obj){
                getStatistics(obj.curr-1);
            }
        });
    });
}).fail(function (data) {
    layer.msg(data.responseText);
});


function getStatistics(page) {
    $.get("/api/activity/getStatistics",{
        "vid":window.localStorage.getItem("vid"),
        "page":page,
        "perPage":perPage,
    }).done(function (data) {
        activities = data;
        console.log(activities);
        setStatistics(activities);
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}

function setStatistics(activities) {
    $("#statistics-content").find(" tbody").empty();
    activities.map(function (activity,index) {
        const activity_dom =
            "<tr>" +
            "<td>"+activity.aid+"</td>"+
            "<td>"+activity.name+"</td>"+
            "<td>"+activity.sellState+"</td>"+
            "<td>"+activity.turnover.toFixed(2)+"</td>"+
            "<td>"+activity.offlineTurnover.toFixed(2)+"</td>"+
            "<td>"+activity.fees.toFixed(2)+"</td>"+
            "<td>"+activity.settleState+"</td>"+
            "<td>"+activity.earn.toFixed(2)+"</td>"+
            "<td>" +
            "<span style='cursor: pointer' class='table-btn' onclick='savePeriod("+index+")'>查看订单</span>"+
            "</td>"+
            "</tr>";
        $("#statistics-content").find(" tbody").append(activity_dom);
    });
}

//查看订单的时候存储场次信息
function savePeriod(index) {
    const activity = activities[index];
    console.log(activity);
    window.localStorage.setItem("period",JSON.stringify(activity.periods));
    forward("/pages/venue/activity/activity-order.html?period=all&id="+activity.aid+"&aid="+activity.aid);
}

function toFinanceChart() {
    forward("/pages/venue/finance-chart.html");
}
