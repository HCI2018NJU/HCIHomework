/**
 * Created by shea on 2018/2/10.
 */
let activity_left_nav =
    "<ul id='activity-left-nav-content'>" +
        "<li class='activity-type'><a aType='0' class='tab' href='/pages/venue/activity/activity.html?type=0'>正在进行<span style='float: right'>></span></a></li>" +
        "<li class='activity-type'><a aType='1' class='tab' href='/pages/venue/activity/activity.html?type=1'>尚未开始<span style='float: right'>></span></a></li>" +
        "<li class='activity-type'><a aType='-1' class='tab' href='/pages/venue/activity/activity.html?type=-1'>已经结束<span style='float: right'>></span></a></li>" +
    "</ul>";
$("#activity-left-nav").append(activity_left_nav);

$("#activity-left-nav-content a").each(function () {
    $(this).removeClass("active");
    this.onclick = function () {
        return true;
    }
});
$(`#activity-left-nav-content a[aType=${getUrlParam("type")}]`).addClass("active");





