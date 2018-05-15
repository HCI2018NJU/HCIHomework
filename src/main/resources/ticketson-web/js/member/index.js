let totalNum;//todo 如果已经获得了这个数目，但此时又发布了新的活动？
const perPage = 24;

getActivitiesTotalNum();

function getActivitiesTotalNum() {
    //获得退订的订单总数
    $.get(
        "/api/activity/getActivitiesTotalNum"
    ).done(function (data) {
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
                    console.log(obj);
                    getActivities(obj.curr-1);
                }
            });
        });
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}

function getActivities(page) {
    //获得所有正在售票的活动
    $.post("/api/activity/getActivities",{
        "page":page,
        "perPage":perPage,
    }).done(function (data) {
        console.log(data);
        setActivities(data);
    }).fail(function (data) {
        layer.msg(data.responseText);
    });

}

//将数据填进界面
function setActivities(activities) {
    $("#activity-container").empty();
    activities.map(function (activity,index) {
        let activity_dom =
            "<div class='col-2'>" +
                "<div class='activity-item' onclick='toActivityDetail("+activity.aid+")'> "+
                    "<div class='img-wrapper'> "+
                        "<img src='"+activity.url+"' class='activity-photo' "+
                    "</div>"+
                    "<div class='title-wrapper'> "+
                        "<div class='activity-title'> "+activity.name+"<span style='color: #ff5a5f'>[</span>"+activity.type+"<span style='color: #ff5a5f'>]</span></div>"+
                        "<div class='activity-price-wrapper'> "+
                            "<span class='activity-price-message'>票价：¥</span>"+
                            "<span class='activity-price'> "+activity.lowestPrice+"</span>"+
                            "<span class='activity-price-message'>起</span>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
            "</div>";
        $("#activity-container").append(activity_dom);
    });
}

//跳转到活动详情
function toActivityDetail(aid) {
    forward(`/pages/venue/activity/activity-info.html?aid=${aid}`);
}



