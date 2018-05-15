/**
 * Created by shea on 2018/2/10.
 */
let venue_nav =
    "<nav id='venue-nav-content'>" +
        "<div class='row'>" +
            "<div class='col-1'>" +
                "<a id='logo' href='/pages/member/index.html'>TicketsOn</a>" +
            "</div>" +
            "<div id='tabs' class='col-5 tab-left center-content'>" +
                "<a href='/pages/venue/activity/activity.html?type=0' class='tab'><i class='iconfont'>&#xe657;</i>活动</a>" +
                "<a href='/pages/venue/finance-table.html' class='tab'><i class='iconfont'>&#xe63e;</i>财务</a>" +
                "<a href='/pages/venue/info.html' class='tab'><i class='iconfont'>&#xe606;</i>资料</a>" +
            "</div>" +
            "<div class='col-3'>" +
                "<button class='input-tab' id='check-ticket' onclick='checkTicket()'><i class='iconfont'>&#xe60b;</i>检票</button>" +
                "<input class='input-tab' id='ticket-input' placeholder='请输入票号' onkeypress='checkIn()'>" +
            "</div>" +
            "<div class='col-3 tab-right'>" +
                "<a class='input-tab' href='/pages/venue/activity/post-activity.html'>" +
                    "<button id='post-activity'><i class='iconfont'>&#xe631;</i>发布</button>" +
                "</a>" +
                "<a class='tab' href='/pages/venue/login.html' id='logout'>退出</a>" +
            "</div>" +
        "</div>" +
    "</nav>";
$("#venue-nav").append(venue_nav);
let _href = this.location.href.split('?')[0];
$("#tabs a").each(function () {
    if(this.href===_href || this.href.endsWith("activity.html")&&_href.endsWith("activity.html")){
        $(this).addClass("active");
        this.onclick = function () {
            return false;
        }
    }else {
        $(this).removeClass("active");
        this.onclick = function () {
            return true;
        }
    }
});

//检票
function checkIn(event) {
    let e = event || window.event;
    if(e.keyCode === 13){
        checkTicket();
    }
}

function checkTicket() {
    const tid = $("#ticket-input").val();
    if(tid===""){
        layer.msg("请输入票号");
        return;
    }
    $.post("/api/subscribe/checkIn",{
        "tid":tid,
    }).done(function () {
        layer.msg("检票成功");
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}

// function postActivity() {
//
// }
















