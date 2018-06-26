/**
 * Created by 铠联 on 2018/6/12.
 */
let type_choices = [
    ['演唱会','流行','民族','摇滚','音乐节'],
    ['音乐会','声乐','古乐','独奏','管弦乐'],
    ['歌舞剧','儿童剧','歌剧','话剧','音乐剧'],
    ['曲艺类','戏曲','杂技','相声','马戏','魔术'],
    ['舞蹈','舞剧','舞蹈','芭蕾'],
    ['体育比赛','冰雪','排球','搏击运动','格斗','球类运动','篮球','赛车','足球']
];
let totalNum;//todo 如果已经获得了这个数目，但此时又发布了新的活动？
const perPage = 10;


type_choices.map(function (father,i) {
    const father_name = father[0];
    const father_item = "<li father='"+i+"' ' name='" + father_name + "'><a href='javascript:void(0)'>" + father_name + "</a></li>";
    $(".father-menu").append(father_item);
    let child_item_container = "<ul class='clear child-menu'>";

    father.map(function (child,j) {
       if(j===0){
           return;
       }
       const child_item = "<li child='"+j+"' father='"+i+"'  name='" + child + "'><a href='javascript:void(0)'>" + child + "</a></li>";
       child_item_container+=child_item;
    });
    child_item_container = child_item_container+"</ul>";
    $("#child_block dd").eq(1).append(child_item_container);
});

let time_index = 0;
let father_index = getUrlParam("father")?getUrlParam("father"):10;
$("#father_block a").removeClass("active");
if(father_index<=5){
    $("#father_block .father-menu a").eq(father_index).addClass("active");
}else {
    $("#father_block .all-category").addClass("active");
    $("#child_block .child-menu").css("display","none");
    $("#child_block").css("display","none");

}
$("#child_block .child-menu").css("display","none");
$("#child_block .child-menu").eq(father_index).css("display","block");
console.log(getUrlParam("child"));
let child_index = getUrlParam("child")?getUrlParam("child"):0;
if(child_index===0||child_index==='0'){
    $("#child_block .all-category").addClass("active");
}else {
    $("#child_block .child-menu").eq(father_index).find(" a").eq(child_index-1).addClass("active");
}
getActivitiesTotalNum();

$(".father-menu li").on('click',function () {
    father_index = $(this).attr("father");
    $("#father_block a").removeClass("active");
    $("#father_block .father-menu a").eq(father_index).addClass("active");
    $("#child_block").css("display","block");
    $("#child_block .child-menu").css("display","none");
    $("#child_block .child-menu").eq(father_index).css("display","block");
    child_index = 0;
    $("#child_block a").removeClass("active");
    $("#child_block .all-category").addClass("active");
    //getlst
    getActivitiesTotalNum();

});

$("#father_block .all-category").on('click',function () {
   father_index = 10;
   child_index = 0;
    $("#father_block a").removeClass("active");
    $(this).addClass("active");
    $("#child_block .child-menu").css("display","none");
    $("#child_block").css("display","none");
    //getlst
    getActivitiesTotalNum();

});

$(".child-menu li").on('click',function () {
    child_index = $(this).attr("child");
    $("#child_block a").removeClass("active");
    $("#child_block .child-menu").eq(father_index).find(" a").eq(child_index-1).addClass("active");
    //getlst
    getActivitiesTotalNum();
});

$("#child_block .all-category").on('click',function () {
    child_index = 0;
    $("#child_block a").removeClass("active");
    $(this).addClass("active");
    //getlst
    getActivitiesTotalNum();
});

$(".time-menu li").on('click',function () {
    time_index = $(this).attr("idx");
    $("#time_block a").removeClass("active");
    $(this).find(" a").addClass("active");
    //getlst
    getActivitiesTotalNum();
});

$("#time_block .all-category").on('click',function () {
    time_index = 0;
    $("#time_block a").removeClass("active");
    $(this).addClass("active");
    getActivitiesTotalNum();
});

//String type,String fatherType,Integer cityCode,Integer timeType,Integer page, Integer perPage
function getActivitiesTotalNum() {

    //获得退订的订单总数
    $(".loading").css("display","block");
    let type = "";
    if(child_index!==0&&child_index!=='0'){
        type = type_choices[father_index][child_index];
    }
    $.post("/api/activity/countActivities",
        {
           "type":type,
            "fatherType":father_index===10?"":type_choices[father_index][0],
            "cityCode":city_code,
            "timeType":time_index,
        }
    ).done(function (data) {
        totalNum = parseInt(data);
        console.log(totalNum);
        if(totalNum<=0) {
            $("#page-display-result").css("display","none");
            $(".nothing").css("display","block");
            $("#category-lst-left").empty();
            $("#category-lst-right").empty();
            $(".loading").css("display","none");
        }else {
            $("#page-display-result").css("display","block");
            $(".nothing").css("display","none");
            layui.use(['laypage'], function () {
                let laypage = layui.laypage;
                laypage.render({
                    elem: 'page-display-result',
                    count: totalNum,
                    limit: perPage,
                    layout: ['prev', 'page', 'next'],
                    theme: '#ff5a5f',
                    jump: function (obj) {
                        console.log(obj);
                        $(".loading").css("display","block");
                        getActivities(obj.curr-1);
                    }
                });
            });
        }
    }).fail(function (data) {
        $(".loading").css("display","none");
        layer.msg(data.responseText);
    });
}

function getActivities(page) {
    //获得所有正在售票的活动
    let type = "";
    if(child_index!==0&&child_index!=='0'){
        type = type_choices[father_index][child_index];
    }
    $.post("/api/activity/getActivities",{
        "type":type,
        "fatherType":father_index===10?"":type_choices[father_index][0],
        "cityCode":city_code,
        "timeType":time_index,
        "page":page,
        "perPage":perPage,
    }).done(function (data) {
        $(".loading").css("display","none");
        setActivities(data);
    }).fail(function (data) {
        $(".loading").css("display","none");
        layer.msg(data.responseText);
    });

}

function setActivities(data) {
    $("#category-lst-left").empty();
    $("#category-lst-right").empty();
    data.map((activity,idx)=>{
        let time = activity.begin;
        if(activity.periods.length>1){
            time = activity.begin+"&nbsp;-&nbsp;"+activity.end;
        }
        let description = activity.description.length<20?activity.description:activity.description.substring(0,20)+"...";
        const dom =
            "<div class='left-item category-item' aid='"+activity.aid+"'>" +
                "<div>" +
                    "<img src='" + activity.url + "'>" +
                "</div>" +
                "<div class='item-info'>" +
                    "<h6 class='item-title'>" + activity.name+ "</h6>" +
                    "<h6 class='item-des'> " + description + "</h6>" +
                    "<div class='popularity-info'>" +
                        "<div>" +
                        "<div><i class='icon-font-large'>&#xe603;</i> <span>"+activity.tnum+"人已购</span></div>" +
                        "</div>" +
                        "<div style='margin-left: 12px'>" +
                        "<div><i class='icon-font-large'>&#xe7fd;</i><span>"+activity.pageView+"人浏览</span></div>" +
                        " </div>" +
                    " </div>" +
                    " <div class='bottom-line'>" +
                        " <div>"+time+"</div>" +
                        " <div>"+activity.vname+"</div>" +
                    " </div>" +
                    " <div class='item-price'>¥&nbsp;<span>"+activity.lowestPrice+"</span>&nbsp;起</div>" +
                " </div>" +
            " </div>";
        if(idx%2===0){
            $("#category-lst-left").append(dom);
        }else {
            $("#category-lst-right").append(dom);

        }
    });
    $(".category-item").on('click',function () {
        const aid=  $(this).attr("aid");
        forward(`/pages/venue/activity/activity-info.html?aid=${aid}`);
    })
}


