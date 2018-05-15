const vid = window.localStorage.getItem("vid");
let totalNum = 0;
const perPage = 10;
let selected_pid;
let activities ;

let type = parseInt(getUrlParam("type"));
if(!(type===0||type===-1||type===1)){
    type = 0;
}

getActivityTotalNum();

//获得我的总订单数
function getActivityTotalNum() {
    //获得退订的订单总数
    $.post("/api/activity/getActivitiesTotalNumByVid", {
        "vid": vid,
        "type": type,
    }).done(function (data) {
        totalNum = parseInt(data);
        layui.use(['laypage'], function () {
            let laypage = layui.laypage;
            laypage.render({
                elem: 'activity-page',
                count: totalNum,
                limit: perPage,
                layout: ['prev', 'page', 'next'],
                theme: '#f5c026',
                jump: function (obj) {
                    getActivities(obj.curr-1);
                }
            });
        });
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}

//获得指定页面的活动
function getActivities(page) {
    $.post("/api/activity/getActivitiesByVid",{
        "vid":vid,
        "type":type,
        "page":page,
        "perPage":perPage,
    }).done(function (data) {
        activities = data;
        setActivityItem(activities);
    }).fail(function (data) {
        layer.msg(data.responseText);
    });

}


function setActivityItem(activities) {
    console.log(activities);
    $("#activity-container").empty();
    activities.map(function (activity,index) {
        const periods = activity.periods;
        let activity_period_content = "";
        periods.map(function (period) {
            activity_period_content = activity_period_content+"<label class='period' beginTime='"+period.beginTime+"' pid='"+period.pid+"' onclick='choosePeriod(this)'>"+period.begin+"</label>";
        });
        let prices = activity.prices.split('_');
        let activity_price_content = "";
        for(let i=1;i<prices.length;i++){
            activity_price_content = activity_price_content +"<label>"+prices[i]+"</label>";
        }
        //如果尚未开始，则显示现场购票的选项
        let but_tickets_content = "";
        if(type===1){
            but_tickets_content = "<button id='buy-ticket' onclick='toChooseSeat(this)' aid='"+activity.aid+"'>现场购票</button>" ;
        }else if(type===-1){//如果已经结束，则显示是否已经被结账的选项
            const turnoverSettled = activity.turnoverSettled?"已结帐":"未结账";
            but_tickets_content = "<label style='border: 1px solid #f4f4f4;color: #333;padding: 4px 10px'>"+turnoverSettled+"</label>";
        }
        let activity_item =
            "<div class='activity-item' onclick='showSpecific(this)'>" +
                "<div class='row'>" +
                    "<div class='col-3'>"+activity.name+"</div>" +
                    "<div class='col-1'>"+activity.type+"</div>" +
                    "<div class='col-6'>"+activity.begin+"～"+activity.end+"</div>" +
                    "<div class='col-2 more-info' onclick='savePeriod("+index+")'><span>查看订单>></span></div>" +
                "</div>" +
                "<div class='row specific'>" +
                    "<div class='col-2'>" +
                        "<img src='"+activity.url+"' class='post-img'>" +
                    "</div>" +
                    "<div class='col-1'></div>" +
                    "<div class='col-9'>" +
                        "<div class='activity-description'>"+activity.description+"</div>" +
                        "<div>" +
                            "<label class='label'>活动场次：</label>" +
                            "<div class='activity-period'>"+activity_period_content+"</div>" +
                        "</div>" +
                        "<div>" +
                            "<label class='label'>活动价格：</label>" +
                            "<div class='activity-price'>"+activity_price_content+"</div>" +
                        "</div>" +
                        "<div class='buy-ticket-container'>" +
                            "<label class='label'></label>" +but_tickets_content+
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</div>";
        $("#activity-container").append(activity_item);

    });
    $("#activity-container").children().eq(0).children().eq(1).css("display","flex");
}

function showSpecific(obj) {
    console.log($(obj).children().eq(1).css("display"));
    $(obj).parent().children().each(function () {
        $(this).children().eq(1).css("display","none");
    });
    $(obj).children().eq(1).css("display","flex");
}

//选座购买
function toChooseSeat(dom) {
    if(selected_pid===null||selected_pid===""||selected_pid===undefined){
        layer.msg("请选择场次");
        return;
    }
    const aid = $(dom).attr("aid");
    forward("/pages/venue/activity/choose-seat.html?way=offline&aid="+aid+"&pid="+selected_pid);
}

//选择场次
function choosePeriod(dom) {
    const beginTime = $(dom).attr("beginTime");
    const now = new Date().getTime();
    if(beginTime<=now){
        layer.msg("此场次结束售票");
        return;
    }
    if(type!==1){
        return;
    }
    if($(dom).attr("pid")===selected_pid){
        $(dom).css({
            "border":"1px dotted #d4d4d4"
        });
        selected_pid = "";
    }else {
        $(dom).parent().find(".period").css({
            "border":"1px dotted #d4d4d4",
        });
        $(dom).css({
            "border":"1px solid #ff5a5f"
        });
        selected_pid = $(dom).attr("pid");
    }
}

//查看订单的时候存储场次信息
function savePeriod(index) {
    const activity = activities[index];
    console.log(activity);
    window.localStorage.setItem("period",JSON.stringify(activity.periods));
    forward("/pages/venue/activity/activity-order.html?period=all&id="+activity.aid+"&aid="+activity.aid);
}
