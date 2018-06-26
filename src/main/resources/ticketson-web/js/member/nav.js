/**
 * Created by shea on 2018/6/9.
 */
let is_login = window.localStorage.getItem("member")!==null;
let city_code = window.localStorage.getItem("nav_city_code")?window.localStorage.getItem("nav_city_code"):0;

initNav();


function initNav() {
    const top_nav =
        "<div class='row'>" +
        "<div class='col-2'></div>" +
        "<div class='col-8'>" +
        "<div class='row'>" +
        "<div class='col-3'>" +
        "<div class='logo-container'>" +
        "<a class='logo' href='/pages/member/home.html'>" +
        "<img src='/resources/icons/logo.png' style='height: 40px'>" +
        "</a>" +
        "<div style='font-size: 12px;color: #ff5a5f;width: 100%;text-align: center;margin-top: -5px'>" +
        "买票，就找票先生" +
        "</div>" +
        "</div>" +
        "<div class='splitor'></div>" +
        "<div class='tab' id='region'>" +
        "<span class='user-site' cid='0'>全国</span>" +
        "<i class='icon-font'>&#xe612</i>" +
        "<div id='region-dropdown-menu'></div>" +
        "</div>" +
        "</div>" +
        "<div class='col-7' style='overflow: hidden'>" +
        "<div class='search-tab'>" +
        "<input type='text' placeholder='活动、地点、明星'/>" +
        "<button><i class='icon-font' style='color: white'>&#xe779;</i>搜索</button>" +
        "</div>" +
        "</div>" +
        "<div class='col-2'>" +
        "<div id='member-info-wrapper'></div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class='col-2'></div>" +
    "</div>";
    $(".top-nav").append(top_nav);

    $("#region").on('mouseenter',function () {
        $("#region-dropdown-menu").css("display","block");
    });
    $("#region").on('mouseleave',function () {
        $("#region-dropdown-menu").css("display","none");
    });

    for(const province_id in city){
        const province_name = province_object[province_id].name;
        let location_item =
            "<div class='location-item' id='"+province_id+"'>" +
            "<div pid='"+province_id+"' class='province-specific'>"+province_name+"</div>"+
            "<div class='city-specific'></div>"+
            "</div>";
        $("#region-dropdown-menu").append(location_item);
        city[province_id].map(function (city) {
            const city_id = city.id;
            const city_name = city.name;
            let city_dom = "<div class='city-dom' cid='"+city_id+"' pid='"+province_id+"'>"+city_name+"</div>";
            $("#"+province_id).children().eq(1).append(city_dom);
        });
        $(".city-dom").on('click',function () {
            city_code = $(this).attr("cid");
            window.localStorage.setItem("nav_city_code",city_code);
            let city_name = $(this).text();
            if(city_name==="市辖区"){
                city_name = city_object[city_code].province;
            }
            $("#region>span").text(city_name);
            $("#region-dropdown-menu").css("display","none");
            forward("/pages/type/index.html");
        });
    }

    if(city_code!==0){
        let city_name = city_object[city_code].name;
        if(city_name==="市辖区"){
            city_name = city_object[city_code].province;
            $("#region>span").text(city_name);
            $("#region>span").attr("cid",city_code);
        }
    }

    if(is_login){
        const member = JSON.parse(window.localStorage.getItem("member"));
        const member_name = member["nickname"];
        // const member_name = "王馨雨";
        const member_nav =
            "<ul style='float: right'>" +
            "<li class='member-tab' id='member-info-tab'>" +
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
            "<div id='account-manage'><a href='/pages/member/order-manage.html'>订单管理</a></div> "+
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
            "</ul>";
        $("#member-info-wrapper").append(member_nav);
        $("#member-info-tab").on('mouseenter',showMemberCard);
        $("#member-info-tab").on('mouseleave',hideMemberCard);
        $("#logout").on('click',logout);
    }else {
        const member_nav =
            "<div class='tab login-tab'>" +
            "<a href='/pages/login/login-member.html'>登录</a>" +
            "<span>/</span>"+
            "<a href='/pages/login/register-member.html'>注册</a>" +
            "</div>";
        $("#member-info-wrapper").append(member_nav);

    }

    const type_nav =
        "<div class='row'>" +
            "<div class='col-2 left-blank'></div>"+
            "<div class='col-8'><div class='row tabs'></div></div>"+
            "<div class='col-2 right-blank'></div>"+
        "</div>";
    $(".type-nav").append(type_nav);

    let type_choices = [
        ['演唱会','流行','民族','摇滚','音乐节'],
        ['音乐会','声乐','古乐','独奏','管弦乐'],
        ['歌舞剧','儿童剧','歌剧','话剧','音乐剧'],
        ['曲艺类','戏曲','杂技','相声','马戏','魔术'],
        ['舞蹈','舞剧','舞蹈','芭蕾'],
        ['体育比赛','冰雪','排球','搏击运动','格斗','球类运动','篮球','赛车','足球']
    ];

    type_choices.map((types,i)=>{
        const father_type = types[0];
        let tab_dom =
            "<div class='col-2 tab'>" +
                "<a href='../../pages/type/index.html?father="+i+"&child=0'> "+father_type+"</a>"+
                "<ul class='my-dropdown-menu'> ";
        types.map((c_type,j)=>{
            if(j===0)return;
            tab_dom = tab_dom + "<li name='"+c_type+"' class='children-type' father='"+i+"' child='"+j+"'><a>"+c_type+"</a></li>";
        });
        tab_dom = tab_dom + "</ul></div>";
        $(".type-nav .tabs").append(tab_dom);
        $(".type-nav .tabs .tab").on('mouseenter',function () {
            $(this).find(".my-dropdown-menu").css("display","block");
            $(this).find(" a").css("color","#5c5c5c");
        });
        $(".type-nav .tabs .tab").on('mouseleave',function () {
            $(this).find(".my-dropdown-menu").css("display","none");
            $(this).find(" a").css("color","white");
        });
        $(".children-type").on('click',function () {
            const father = $(this).attr("father");
            const child = $(this).attr("child");
            forward("/pages/type/index.html?father="+father+"&child="+child);
        });

    });

}


function showMemberCard() {
    if(!is_login){
        forward("/pages/login/login-member.html");
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


function getMid() {
    if(is_login){
        const member = JSON.parse(window.localStorage.getItem("member"));
        return member["mid"];
    }else {
        layer.msg("您尚未登陆");
        return null;
    }
}


