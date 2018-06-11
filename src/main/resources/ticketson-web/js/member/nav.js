/**
 * Created by shea on 2018/6/9.
 */
let is_login = window.localStorage.getItem("member")!==null;

initNav();

function initNav() {
    const header =
        "<div class='row'>" +
            "<div class='col-1'>" +
                "<div class='logo-container'>" +
                    "<a class='logo' href='/pages/member/home.html'>TicketsOn</a>" +
                "</div>" +
            "</div>" +
            "<div class='col-7'>" +
                "<ul class='nav'>" +
                    "<li class='tab'  id='region'>" +
                        "<a tabindex='0'>全国"+
                            "<i class='icon-font'>&#xe612</i>"+
                        "</a>" +
                        "<div id='region-dropdown-menu'></div>"+
                    "</li>" +
                    "<li class='tab' id='gig'>"+
                        "<a href='#'>演唱会</a>"+
                        "<ul id='gig-dropdown-menu' class='dropdown-menu'>" +
                            "<li name='流行'><a>流行</a></li>"+
                            "<li name='民族'><a>民族</a></li>"+
                            "<li name='摇滚'><a>摇滚</a></li>"+
                            "<li name='音乐节'><a>音乐节</a></li>"+
                        "</ul> "+
                    "</li>" +
                    "<li class='tab' id='concert'>"+
                        "<a href='#'>音乐会</a>"+
                        "<ul id='concert-dropdown-menu' class='dropdown-menu'>" +
                            "<li name='声乐'><a>声乐</a></li>" +
                            "<li name='古乐'><a>古乐</a></li>" +
                            "<li name='独奏'><a>独奏</a></li>" +
                            "<li name='管弦乐'><a>管弦乐</a></li>" +
                        "</ul>" +
                    "</li>" +
                    "<li class='tab' id='opera'>" +
                        "<a href='#'>歌舞剧</a>" +
                        "<ul id='opera-dropdown-menu' class='dropdown-menu'>" +
                            "<li name='儿童剧'><a>儿童剧</a></li>" +
                            "<li name='歌剧'><a>歌剧</a></li>" +
                            "<li name='话剧'><a>话剧</a></li>" +
                            "<li name='音乐剧'><a>音乐剧</a></li>" +
                        "</ul>" +
                    "</li>" +
                    "<li class='tab' id='quyi'>"+
                        "<a href='#'>曲艺类</a>"+
                        "<ul id='quyi-dropdown-menu' class='dropdown-menu'>" +
                            "<li name='戏曲'><a>戏曲</a></li>" +
                            "<li name='杂技'><a>杂技</a></li>" +
                            "<li name='相声'><a>相声</a></li>" +
                            "<li name='马戏'><a>马戏</a></li>" +
                            "<li name='魔术'><a>魔术</a></li>" +
                        "</ul>" +
                    "</li>" +
                    "<li class='tab' id='more'> "+
                        "<a href='#' style='padding-top: 6px'><i class='icon-font unfold'>&#xe607;</i></a>"+
                        "<div id='more-dropdown-menu'></div>"+
                    "</li>" +
                "</ul>" +
            "</div>" +
            "<div class='col-2'>" +
                "<ul class='nav'>" +
                    "<li class='search-tab'>" +
                        "<input class='search' type='text' placeholder='活动、地点、明星'/>" +
                        "<i class='icon-font search-icon'>&#xe779;</i>" +
                    "</li>" +
                "</ul>" +
            "</div>" +
            "<div class='col-2' id='member-info-wrapper'></div>" +
        "</div>";
    $(".header").append(header);


    for(const province_id in city){
        const province_name = province_object[province_id].name;
        let location_item =
            "<div class='location-item' id='"+province_id+"'>" +
            "<div id='"+province_id+"' class='province-specific' onclick='wp(this)'>"+province_name+"</div>"+
            "<div class='city-specific'></div>"+
            "</div>";
        $("#region-dropdown-menu").append(location_item);
        city[province_id].map(function (city) {
            const city_id = city.id;
            const city_name = city.name;
            let city_dom = "<div id='"+city_id+"' onclick='wc(this)'>"+city_name+"</div>";
            $("#"+province_id).children().eq(1).append(city_dom);
        });
    }
    let type_choices = [
        ['舞蹈','舞剧','舞蹈','芭蕾'],
        ['体育比赛','冰雪','排球','搏击运动','格斗','球类运动','篮球','赛车','足球']
    ];
    type_choices.map(function (array,i) {
        let type_item =
            "<div class='type-item'>" +
            "<div class='type-title'>"+array[0]+"</div>"+
            "<div class='type-specific'></div>"+
            "</div>";
        $("#more-dropdown-menu").append(type_item);
        array.map(function (type,j) {
            if(j===0)return;
            let type_dom = "<div onclick='wt(this)'>"+type+"</div>";
            $("#more-dropdown-menu").children().eq(i).children().eq(1).append(type_dom);
        })
    });


    if(is_login){
        const member = JSON.parse(window.localStorage.getItem("member"));
        const member_name = member["nickname"];
        // const member_name = "王馨雨";
        const member_nav =
            "<ul class='nav' style='float: right'>" +
                "<li class='member-tab' id='member-info-wrapper'>" +
                    "<a tabindex=''>"+member_name+"<i class='icon-font'>&#xe612</i>"+"</a>" +
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
                            "<div id='logout'><a href='#'>退出</a></div> "+
                        "</div>"+
                    "</div>"+
                "</li>" +
                "<li class='member-tab'>" +
                    "<a tabindex='' href='/pages/member/order-manage.html'>订单管理</a>" +
                "</li>" +
            "</ul>";
        $("#member-info-wrapper").append(member_nav);
        $("#member-info-wrapper").on('mouseenter',showMemberCard);
        $("#member-info-wrapper").on('mouseleave',hideMemberCard);
        $("#logout").on('click',logout);
    }else {
        const member_nav =
            "<ul class='nav' style='float: right'>" +
            "<li class='member-tab'>" +
            "<a href='/pages/login/login-member.html'>登录</a>" +
            "</li>" +
            "<li class='member-tab'>" +
            "<a href='/pages/login/register-member.html'>注册</a>" +
            "</li>" +
            "</ul>";
        $("#member-info-wrapper").append(member_nav);

    }

    $(".tab").on('mouseenter',onMouseEnter);
    $(".tab").on('mouseleave',onMouseLeave);
}


function showMemberCard() {
    if(!is_login){
        forward("/pages/login/login-member.html")
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
    $("#member-info-wrapper").empty();
    forward("/pages/member/home.html");
}

function onMouseEnter() {
    const id = $(this).attr('id');
    $('#'+id+'-dropdown-menu').css("display","block");
}

function onMouseLeave() {
    const id = $(this).attr('id');
    $('#'+id+'-dropdown-menu').css("display","none");
}

function getMid() {
    if(is_login){
        const member = JSON.parse(window.localStorage.getItem("member"));
        return member["mid"];
    }else {
        layer.msg("您尚未登陆");
        return null;
    }
}


