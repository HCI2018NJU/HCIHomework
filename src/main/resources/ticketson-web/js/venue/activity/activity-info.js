let form;
let selected_period;
let selected_pid;
let selected_price;
let selected_level;
const aid = getUrlParam("aid");


layui.use(['form'],function () {
    form = layui.form;
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
    $("#container").attr('aid',activity.aid);
    $("#type").text(activity.type);
    $("#title").text(activity.name);
    let city_name = city_object[activity.venue.cityCode].name;
    if(city_name === '市辖区'){
        city_name = city_object[activity.venue.cityCode].province;
    }
    $("#city").text(city_name);
    $("#activity-description").text(activity.description);
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
        $(dom).css({
            "border":"1px dotted #d4d4d4"
        });
        selected_period = "";
        selected_pid = "";
    }else {
        $("#period-part label").css({
            "border":"1px dotted #d4d4d4",
        });
        $(dom).css({
            "border":"1px solid #ff5a5f"
        });
        selected_period = $(dom).attr("period");
        selected_pid = $(dom).attr("pid");
    }
}

//选择等级
function choosePrice(dom) {
    if($(dom).attr("price")===selected_price){
        $(dom).css({
            "border":"1px dotted #d4d4d4"
        });
        selected_price = "";
        selected_level = "";
    }else {
        $("#price-part label").css({
            "border":"1px dotted #d4d4d4",
        });
        $(dom).css({
            "border":"1px solid #ff5a5f"
        });
        selected_price = $(dom).attr("price");
        selected_level = $(dom).attr("level");
    }
}


//选座购买
function toChooseSeat() {
    if(selected_pid===null||selected_pid===""||selected_pid===undefined){
        layer.msg("请选择场次");
        return;
    }
    forward("/pages/venue/activity/choose-seat.html?way=online&aid="+aid+"&pid="+selected_pid);
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
    const totalAmount = $("#subscribe-number").val();
    if(totalAmount===""){
        layer.msg("请选择购买的数目");
    }
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