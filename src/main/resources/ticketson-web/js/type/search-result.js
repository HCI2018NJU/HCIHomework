/**
 * Created by shea on 2018/6/27.
 */
let totalNum;//todo 如果已经获得了这个数目，但此时又发布了新的活动？
const perPage = 10;

const keyword = decodeURI(getUrlParam2("keyword"));
$(".search-tab input").val(keyword);
$("#clear-input").css("display","inline");

getActivitiesTotalNum();
function getActivitiesTotalNum() {

    //获得退订的订单总数
    $(".loading").css("display","block");
    // let type = "";
    // if(child_index!==0&&child_index!=='0'){
    //     type = type_choices[father_index][child_index];
    // }
    $.post("/api/activity/countActivitiesByKeyword",
        {
            // "type":type,
            // "fatherType":father_index===10?"":type_choices[father_index][0],
            // "cityCode":city_code,
            // "timeType":time_index,
            "keyword":keyword,
        }
    ).done(function (data) {
        totalNum = parseInt(data);
        console.log(totalNum);
        $("#total-num").text(totalNum);
        if(totalNum<=0) {
            $("#page-display-result").css("display","none");
            $(".nothing").css("display","block");
            $("#category-lst-left").empty();
            $("#category-lst-right").empty();
            $(".loading").css("display","none");
        }else {
            $(".nothing").css("display","none");
            if(totalNum<=perPage){
                getActivities(0);
            }else {
                $("#page-display-result").css("display","block");
                layui.use(['laypage'], function () {
                    let laypage = layui.laypage;
                    laypage.render({
                        elem: 'page-display-result',
                        count: totalNum,
                        limit: perPage,
                        layout: ['prev', 'page', 'next'],
                        theme: '#f5c026',
                        jump: function (obj) {
                            console.log(obj);
                            $(".loading").css("display","block");
                            getActivities(obj.curr-1);
                        }
                    });
                });
            }
        }
    }).fail(function (data) {
        $(".loading").css("display","none");
        layer.msg(data.responseText);
    });
}

function getActivities(page) {
    //获得所有正在售票的活动
    // let type = "";
    // if(child_index!==0&&child_index!=='0'){
    //     type = type_choices[father_index][child_index];
    // }
    $.post("/api/activity/getActivitiesByKeyword",{
        // "type":type,
        // "fatherType":father_index===10?"":type_choices[father_index][0],
        // "cityCode":city_code,
        // "timeType":time_index,
        "keyword":keyword,
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


