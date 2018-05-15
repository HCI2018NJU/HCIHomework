/**
 * Created by shea on 2018/2/11.
 */

let manager_nav =
    "<nav class='row' id='manager-nav-content'>" +
    "<div class='col-1'>" +
    "<a id='logo' href='/pages/manager/statistics.html'>TicketsOn</a>" +
    "</div>" +
    "<div class='col-5'>" +
    // "<input id='search-activity' placeholder='尝试搜索喜剧'>"+
    "</div>"+
    "<div id='tabs' class='col-6'>" +
    "<div class='tab'><span onclick='logout()'>退出</span></div>" +
    "<div class='tab-separate'>|</div>"+
    "<div class='tab'><span onclick='toVenueCheck()'>场馆审核</span></div>" +
    "<div class='tab'>" +
    "<span onclick='toOrderSettle()'>订单结算</span>" +
    "</div>"+
    "<div class='tab'>" +
    "<span onclick='toTicketsOnFinance()'>信息统计</span>" +
    "</div>"+
    "</div>" +
    "</nav>";
$("#manager-nav").append(manager_nav);


//为了在element添加样式，最高优先级。否则会被覆盖
$(".tab").hover(function () {
    $(this).css("border-bottom",'2px solid #707070');
},function () {
    $(this).css("border-bottom",'none');
});

//退出
function logout() {
    window.localStorage.removeItem("manager");
    forward("/pages/manager/login.html");
}


function toVenueCheck() {
    forward("/pages/manager/venue-check.html");
}

function toOrderSettle() {
    forward("/pages/manager/order-settle.html");
}

function toTicketsOnFinance() {
    forward("/pages/manager/statistics.html");
}



