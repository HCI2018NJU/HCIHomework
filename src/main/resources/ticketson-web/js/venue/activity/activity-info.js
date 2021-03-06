let form;
let selected_period;
let selected_pid;
let selected_price;
let selected_level;
let subscribe_number;
let full_desctioption;
let brief_desctioption;
const aid = getUrlParam("aid");
let aobj = {};


layui.use(['form'],function () {
    form = layui.form;
});

console.log("temp");

//show the img of the first hot show
$(".m-hot .z-crt .hot").eq(0).css("display","block");
$(".m-hot .z-crt .info").eq(0).css("display","none");
$(".m-hot .z-crt").css("background","url(//dui.dmcdn.cn/dm_2015/goods/images/m-sdlst-ico.png) no-repeat 3px 7px");
$(".m-hot .z-crt").eq(0).css("background","none");
$(".m-hot .z-crt").eq(0).find(".hot").css("background-color","#f6f6f6");


$("#m-infonav .hd .itm-tab").on('click',function () {
    $("#m-infonav .bd .itm-tab").removeClass("z-show");
    $("#m-infonav .hd .itm-tab").removeClass("z-crt");
    const index = $(this).attr("data-idx");
    console.log($(this).attr("data-idx"));
    $("#m-infonav .bd .itm-tab").eq(index).addClass("z-show");
    $("#m-infonav .hd .itm-tab").eq(index).addClass("z-crt");
});

$("#gexhTuijian .itm").on('mouseenter',function () {
    $(".m-hot .z-crt .hot").css("display","none");
    $(".m-hot .z-crt .info").css("display","block");
    $("#gexhTuijian .itm").css("background","url(//dui.dmcdn.cn/dm_2015/goods/images/m-sdlst-ico.png) no-repeat 3px 7px");
    $(this).css("background","none");
    $(this).find(".hot").css({
        "display":"block",
        "background-color":"#f6f6f6"
    });
    $(this).find(".info").css("display","none");

});

//设置可购买张数
function initSubscribeNumber(count) {
    let first_option = "<option value=''>请选择购买张数</option>";
    $("#subscribe-number").append(first_option);
    for(let i=1;i<=count;i++){
        let number_dom = "<option value='"+i+"'>"+i+"</option>";
        $("#subscribe-number").append(number_dom);
    }
    form.render('select');
}


//获得活动详情
$(function () {
    $.post("/api/activity/getActivity",{
        "aid": aid,
    }).done(function (data) {
        initActivityInfo(data);
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
});

//将活动详情填进界面
function initActivityInfo(activity) {
    aobj = activity;
    window.localStorage.setItem("v_name",aobj.venue.name);
    $("#container").attr('aid',activity.aid);
    $("#type").text(activity.type);
    $("#type-guide").text(activity.type);
    type_choices.map((types,idx)=>{
        types.map((type,jdx)=>{
            if(activity.type===type){
                $("#type-guide").attr("father",idx);
                $("#type-guide").attr("child",jdx);
            }
        });
    });


    $("#title").text(activity.name);
    let city_name = city_object[activity.venue.cityCode].name;
    if(city_name === '市辖区'){
        city_name = city_object[activity.venue.cityCode].province;
    }
    $("#city").text(city_name);
    $("#city-guide").text(city_name);
    $("#city-guide").attr("cid",activity.venue.cityCode);
    full_desctioption = activity.description;
    // brief_desctioption = full_desctioption.length>90?full_desctioption.substring(0,90)+"...":full_desctioption;
    // if(full_desctioption.length>90){
    //     $("#more-description").css("display","block");
    // }else {
    //     $("#more-description").css("display","none");
    // }
    // $("#added-description").text(full_desctioption);
    $("#activity-description").text(full_desctioption);
    $("#added-img").attr("src",activity.url);
    activity.periods.map(function (period,index) {
        let label = "<label pid='"+period.pid+"' beginTime='"+period.beginTime+"' period='"+period.begin+"' onclick='choosePeriod(this)'>"+period.begin+"</label>";
        $("#period-part").append(label);
    });
    let prices = activity.prices.split('_');
    for(let i=1;i<prices.length;i++){
        let label = "<label level='"+i+"' price='"+prices[i]+"' onclick='choosePrice(this)'>"+prices[i]+"</label>";
        $("#price-part").append(label);
    }
    $("#venue-name").text(activity.venue.name);
    let venue_city = province_object[activity.venue.provinceCode].name+"·"+
        city_object[activity.venue.cityCode].name+"·"+
            area_object[activity.venue.districtCode].name;
    $("#venue-city").text(venue_city);
    $("#venue-location").text(activity.venue.location);
    $("#activity-pic").attr('src',activity.url);
    initSubscribeNumber(20);

    let finded = false;
    $("#period-part label").each(function () {
        if(finded)return;
        if(new Date().getTime()<$(this).attr("beginTime")){
            $(this).css({
                "border":"2px solid #fd6857",
                "color":"#fd6857"
            });
            finded = true;
            selected_period = $(this).attr("period");
            selected_pid = $(this).attr("pid");
        }
    });
    $("#price-part label").eq(0).css({
        "border":"2px solid #fd6857",
        "color":"#fd6857",
    });
    selected_price = $("#price-part label").eq(0).attr("price");
    selected_level = $("#price-part label").eq(0).attr("level");
    subscribe_number = $("#number").val();
    $("#totalprice").text(selected_price*subscribe_number);

    $("#plus").on('click',function () {
        if(subscribe_number<22){
            subscribe_number ++;
            $("#number").val(subscribe_number);
            $("#totalprice").text(selected_price*subscribe_number);
        }
    });
    $("#minus").on('click',function () {
        if(subscribe_number>3){
            subscribe_number = subscribe_number -1;
            $("#number").val(subscribe_number);
            $("#totalprice").text(selected_price*subscribe_number);
        }
    });

    $("#city-guide").on('click',function () {
        const cid = $(this).attr("cid");
        window.localStorage.setItem("nav_city_code",cid);
        console.log(cid);
        forward("/pages/type/index.html");
    });

    $("#type-guide").on('click',function () {
        const cid = $("#city-guide").attr("cid");
        window.localStorage.setItem("nav_city_code",cid);
        const father = $(this).attr("father");
        const child = $(this).attr("child");
        forward("/pages/type/index.html?father="+father+"&child="+child);
    });


}

function unfold() {
    if($("#more-description").attr("folded")==="fold"){
        $("#activity-description").text(full_desctioption);
        $("#more-description").attr("folded","unfold");
        $("#more-description").text("收起")
    }else {
        $("#activity-description").text(brief_desctioption);
        $("#more-description").attr("folded","fold");
        $("#more-description").text("展开");
    }
}

//选择场次
function choosePeriod(dom) {
    const beginTime = $(dom).attr("beginTime");
    const now = new Date().getTime();
    if(beginTime<=now){
        layer.msg("此场次结束售票");
        return;
    }
    if($(dom).attr("period")===selected_period){
        // $(dom).css({
        //     "border":"solid 2px #f7f7f7",
        //     "color":"#666"
        // });
        // selected_period = "";
        // selected_pid = "";
    }else {
        $("#period-part label").css({
            "border":"solid 2px #f7f7f7",
            "color":"#666"
        });
        $(dom).css({
            "border":"2px solid #fd6857",
            "color":"#fd6857"
        });
        selected_period = $(dom).attr("period");
        window.localStorage.setItem("a_period",selected_period);
        window.localStorage.setItem("a_name",aobj.name);
        selected_pid = $(dom).attr("pid");
    }
}

//选择等级
function choosePrice(dom) {
    if($(dom).attr("price")===selected_price){
        // $(dom).css({
        //     "border":"solid 2px #f7f7f7",
        //     "color":"#666"
        // });
        // selected_price = "";
        // selected_level = "";
    }else {
        $("#price-part label").css({
            "border":"solid 2px #f7f7f7",
            "color":"#666"
        });
        $(dom).css({
            "border":"2px solid #fd6857",
            "color":"#fd6857",
        });
        selected_price = $(dom).attr("price");
        selected_level = $(dom).attr("level");
        $("#totalprice").text(selected_price*subscribe_number);
    }
}


//选座购买
function toChooseSeat() {
    if(selected_pid===null||selected_pid===""||selected_pid===undefined){
        layer.msg("请选择场次");
        return;
    }
    // window.localStorage.setItem("a_choose_seat_prices",aobj.prices);
    const pid = selected_pid;
    const period = selected_period;
    const vname = aobj.venue.name;
    const aname = aobj.name;
    const prices = aobj.prices;
    forward("/pages/venue/activity/choose-seat.html?way=online&aid="+aid+"&pid="+pid+"&aperiod="+period+"&vname="+vname+"&aname="+aname+"&prices="+prices);

    // forward("/pages/venue/activity/choose-seat.html?way=online&aid="+aid+"&pid="+selected_pid);
}

//取消立即购买
function cancelBuyImmediately() {
    $("#subscribe-wrapper").addClass("disappear");
}

//显示立即购买卡片
function showSubscribeCard() {
    $("#subscribe-wrapper").removeClass("disappear");
    $("#subscribe-wrapper").addClass("dialog");

    if(selected_period===null||selected_period===""||selected_price===null||selected_price===""||selected_period===undefined||selected_price===undefined){
        layer.msg("请选择场次和价格");
        return;
    }
    //填充立即购买的信息
    $("#subscribe-title>span").text(selected_price);
    $("#period-choice").text(selected_period);
    //查询该场次和价格剩余多少张
    $.post("/api/subscribe/getSeatsLeftCount",{
        "pid":selected_pid,
        "level":selected_level,
    }).done(function (data) {
        //如果剩余张数小于20，则将数目下拉选择部分不可见
        setSubscribeNumber(data);
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}

//以立即购买的购买方式下订单
function immediatePurchase() {
    const mid = getMid();
    if(mid===null){
        layer.msg("请先登陆");
        return;
    }
    // const totalAmount = $("#subscribe-number").val();
    // if(totalAmount===""){
    //     layer.msg("请选择购买的数目");
    // }
    const totalAmount = subscribe_number;
    const loading_index = layer.load();
//todo 考虑立即购买的卡片出现之后用户选择等级
    $.post("/api/subscribe/immediatePurchase",{
        "mid":getMid(),
        "pid":selected_pid,
        "totalAmount":totalAmount,
        "level":selected_level,
        "prices":selected_price,
        "totalPrice":selected_price*totalAmount,
    }).done(function (data) {
        layer.close(loading_index);
        forward(`/pages/venue/activity/confirm-order.html?oid=${data}`);
    }).fail(function (data) {
        layer.close(loading_index);
        layer.msg(data.responseText);
    });

}

//设置可购买张数
function setSubscribeNumber(left_count) {
    $("#subscribe-number").empty();
    initSubscribeNumber(left_count>20?20:left_count);
}

function setNumber() {
    let value = $("#number").val();
    //正则中的^表示开头，$表示结束
    if(/^\d+\.\d+$/.test(value)){
        value = parseInt(value);
    }
    if(value<3)value=3;
    if(value>22)value=22;
    $("#number").val(value);
    subscribe_number = value;
    $("#totalprice").text(selected_price*subscribe_number);
}

function calculate() {
    let value = $("#number").val();
    if(/^\d+\.\d+$/.test(value)){
        value = parseInt(value);
    }
    if(value>=3&&value<=22){
        subscribe_number = value;
        $("#totalprice").text(selected_price*subscribe_number);
    }
}





