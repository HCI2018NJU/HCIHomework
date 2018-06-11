
let layer;
layui.use(['carousel', 'form', 'laydate','layer'], function(){
    // var carousel = layui.carousel;
    // let laydate = layui.laydate;
    layer = layui.layer;
    // //设定各种参数
    // carousel.render({
    //     elem: '#test3'
    //     ,width: '100%'
    //     ,height: '600px'
    //     ,interval: 5000
    // });


});

getActivities();



function getActivities() {
    //todo 获得公告栏上的活动
    $.post("/api/activity/getActivitiesByVid",{
        "vid":"4mhtOXs",
        "type":1,
        "page":0,
        "perPage":18,
    }).done(function (data) {
        setGalleryActivities(data);
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
    // //获得所有正在售票的活动
    // $.post("/api/activity/getActivities",{
    //     "page":0,
    //     "perPage":18,
    // }).done(function (data) {
    //     setActivities(data);
    // }).fail(function (data) {
    //     layer.msg(data.responseText);
    // });

}

function setGalleryActivities(data) {
    for(let i=0;i<15;i=i+3){
        let activity = data[i];
        let activity_period_content = "";
        activity.periods.map(function (period) {
            activity_period_content = activity_period_content+"<label class='period' beginTime='"+period.beginTime+"' pid='"+period.pid+"' onclick='choosePeriod(this)'>"+period.begin+"</label>";
        });
        let lowest_price = 320;
        const gallery_item  =
            "<div class='gallery-item'>" +
                "<img src='"+activity.url+"' class='blur back-img'>" +
                "<div class='mask'>" +
                    "<div class='row'>" +
                        "<div class='col-2'></div>" +
                        "<div class='col-3'>" +
                            "<img src='"+activity.url+"'>" +
                        "</div>" +
                        "<div class='col-5'>" +
                            "<div class='promo-info'>" +
                                "<label class='promo-title'>"+activity.name+"</label>" +
                                "<label class='promo-price'>¥&nbsp;"+lowest_price+"<sub class='promo-price-tail'>起</sub></label>" +
                            "</div>" +
                            "<div class='promo-period'>" +activity_period_content +"</div>" +
                            "<div class='promo-button'>" +
                                "<button class='promo-choose-seat'>选座购买</button>" +
                                "<button class='promo-more' onclick='toActivityDetail("+activity.aid+")'>查看详情</button>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</div>";
        $(".carousel-container").append(gallery_item);

    }
    layui.use(['carousel'],function () {
        var carousel = layui.carousel;
        carousel.render({
            elem: '#test3'
            ,width: '100%'
            ,height: '600px'
            ,interval: 5000
        });
    });
    setActivities(data);

}

function setActivities(data) {
    for(let i=0;i<18;i++){
        let activity = data[i];
        // console.log(activity.prices);
        let lowest_price = 240;
        const activity_item =
            "<div class='col-2' onclick='toActivityDetail("+activity.aid+")'>"+
               "<img class='activity-img' src='"+activity.url+"'>"+
               "<div class='activity-info' style=''>"+
                   "<h6>"+activity.name+"</h6>"+
                    "<label  class='activity-price'><span>票价：</span>¥&nbsp;"+lowest_price+"<sub>起</sub></label>"+
                "</div>"+
           "</div>";
        if(i<6){
           $(".latest-group .row").append(activity_item);
        }else if(i<12){
            $(".hot-group .row").append(activity_item);
        }else {
            $(".recommend-group .row").append(activity_item);
        }
    }

}

//跳转到活动详情
function toActivityDetail(aid) {
    forward(`/pages/venue/activity/activity-info.html?aid=${aid}`);
}



