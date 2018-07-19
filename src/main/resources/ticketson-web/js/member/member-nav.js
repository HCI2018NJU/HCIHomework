/**
 * Created by shea on 2018/2/11.
 */
let is_login = window.localStorage.getItem("member")!==null;
let member = JSON.parse(window.localStorage.getItem("member"));
let member_name = is_login ? member["nickname"]: "登陆";
//localstorage中存储city而不存储cityCode
let member_city = is_login ? city_object[member["cityCode"]].name : "注册";
if(member_city === "市辖区"){
    member_city = city_object[member["cityCode"]].province;
}

let member_nav_visitor =
    "<nav class='row' id='member-nav-content'>" +
        "<div class='col-1'>" +
            "<a id='logo' href='/pages/member/index.html'>TicketsOn</a>" +
        "</div>" +
        "<div class='col-6'>" +
            "<input id='search-activity' placeholder='尝试搜索喜剧'>"+
        "</div>"+
        "<div id='tabs' class='col-5'>" +
    // "<div class='member-tab'><span onclick='toVenue()'>场馆入口</span></div>" +
    // "<div class='member-tab-separate'>|</div>"+
            "<div class='member-tab'>" +
                "<span onclick='toRegister()'>注册</span>" +
            "</div>"+
            "<div class='member-tab'>" +
                "<span onclick='toLogin()'>登陆</span>" +
            "</div>"+
        "</div>" +
    "</nav>";

    let member_nav =
    "<nav class='row' id='member-nav-content'>" +
        "<div class='col-1'>" +
            "<a id='logo' href='/pages/member/index.html'>TicketsOn</a>" +
        "</div>" +
        "<div class='col-6'>" +
            "<input id='search-activity' placeholder='尝试搜索喜剧'>"+
        "</div>"+
        "<div id='tabs' class='col-5'>" +
            // "<div class='member-tab'><span onclick='toVenue()'>场馆入口</span></div>" +
            // "<div class='member-tab-separate'>|</div>"+
            "<div class='member-tab'>" +
                "<span onclick='toOrderManage()'>订单管理</span>" +
            "</div>"+
            "<div id='member-info-wrapper' onmouseleave='hideMemberCard()'>" +
                "<div id='member-menu' class='member-tab' onclick='showMemberCard()'>" +
                    "<span>"+member_name+"&nbsp;&nbsp;"+member_city+"</span>" +
                "</div>" +
            "</div>"+
        "</div>" +
    "</nav>";
if(is_login){
    $("#member-nav").append(member_nav);
}else {
    $("#member-nav").append(member_nav_visitor);
}


let member_card =
    "<div id='member-card'>" +
        "<div class='member-card-item-top'>"+
            "<div id='member-level-wrapper'>" +
                "<div style='margin-top: 18px;'><span>会员等级：&nbsp;</span><span id='member-level'></span></div>" +
                "<div style='margin-top: 12px'><span>会员积分：&nbsp;</span><span id='member-credit'></span></div>"+
            "</div>"+
            "<i id='member-img'>&#xe622;</i>"+
        "</div>"+
        "<div class='member-card-item'>" +
            "<div id='account-manage'><a href='/pages/member/modify-info.html'>修改信息</a></div> "+
        "</div>"+
        "<div class='member-card-item'>" +
            "<div id='discount-manage'><a href='/pages/member/coupon.html'>查看优惠券</a></div> "+
        "</div>"+
        "<div class='member-card-item'>" +
            "<div id='bill-manage'><a href='/pages/member/consume.html'>我的账单</a></div> "+
        "</div>"+
        "<div class='member-card-item'>" +
            "<div id='logout'><a href='#' onclick='logout()'>退出</a></div> "+
        "</div>"+
    "</div>";
$("#member-info-wrapper").append(member_card);

//为了在element添加样式，最高优先级。否则会被覆盖
$(".tab").hover(function () {
    if($("#member-card").css("display")==="none"){
        $(this).css("border-bottom",'2px solid #707070');
    }
},function () {
    $(this).css("border-bottom",'none');
});

function showMemberCard() {
    // console.log($("#member-menu a").attr("href"));
    if(!is_login){
        toLogin();
        return;
    }
    $.post("/api/member/getInfo",{
        "mid":getMid(),
    }).done(function (data) {
        $("#member-level").text(data.level);
        $("#member-credit").text(data.credit);
        $("#member-card").css("display","block");
        $(".tab").css("border-bottom","none");
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}
function hideMemberCard() {
    $("#member-card").css("display","none");
}

//退出
function logout() {
   window.localStorage.removeItem("member");
   forward("/pages/member/index.html");
}

function toLogin() {
    console.log("tologin");
    if(!is_login){
        forward("/pages/login/login.html?usertype=member");
    }
}

function toRegister() {
    forward("/pages/member/register.html");
}

function toVenue() {
    // window.localStorage.removeItem("member");
    forward("/pages/venue/login.html");
}

function toOrderManage() {
    if(getMid()===null){
        return;
    }
    forward("/pages/member/order-manage.html")
}

function getMid() {
    if(is_login){
        return member["mid"];
    }else {
        layer.msg("您尚未登陆");
        return null;
    }
}



