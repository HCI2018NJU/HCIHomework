let present_province_id = '';
let present_city_id = '';
let present_area_id = '';

addProvinces();
$("#province").on('click',onProvinceClick);
$("#province-more").on('click',onProvinceClick);
$("#city").on({'click':onCityClick});
$("#city-more").on({'click':onCityClick});
$("#area").on('click',onAreaClick);
$("#area-more").on('click',onAreaClick);
$("body").on('click',onBodyClick);

function clearCity() {
    $("#city").attr("readonly",false);
    $("#city").val("");
    present_city_id = '';
    $("#city").attr("readonly",true);
    $("#city-dropdown-menu").empty();
}

function clearArea() {
    $("#area").attr("readonly",false);
    $("#area").val("");
    present_area_id = "";
    $("#area").attr("readonly",true);
    $("#area-dropdown-menu").empty();
}

function addProvinces() {
    province.map(function (p) {
        const province_item = "<li id='"+p.id+"' pname='"+p.name+"'><a><span>"+p.name+"</span></a></li>";
        $("#province-dropdown-menu").append(province_item);
    });
    $("#province-dropdown-menu>li").on({'click':onProvinceMenuClick});
}

function addCitys() {
    city[present_province_id].map(function (c) {
        const city_item = "<li id='"+c.id+"' cname='"+c.name+"'><a><span>"+c.name+"</span></a></li>";
        $("#city-dropdown-menu").append(city_item);
    });
    $("#city-dropdown-menu>li").on({'click':onCityMenuClick});
}

function addAreas() {
    area[present_city_id].map(function (a) {
        const area_item = "<li id='"+a.id+"' aname='"+a.name+"'><a><span>"+a.name+"</span></a></li>";
        $("#area-dropdown-menu").append(area_item);
    });
    $("#area-dropdown-menu>li").on('click',onAreaMenuClick);
}

function onProvinceClick() {
    $("#province-dropdown-menu").css("display","block");
}

function onProvinceMenuClick() {
    $("#province").attr("readonly",false);
    $("#province").val($(this).attr("pname"));
    present_province_id = $(this).attr("id");
    $("#city").css("cursor","pointer");
    $("#province").attr("readonly",true);
    //清空city和area
    clearCity();
    clearArea();
    $("#province-dropdown-menu").css("display","none");
}


function onCityClick() {
    if(present_province_id===""){
        $("#city-dropdown-menu").css("display","block");
        return;
    }
    $("#city-dropdown-menu").empty();
    addCitys();
    $("#city-dropdown-menu").css("display","block");
}

function onCityMenuClick() {
    $("#city").attr("readonly",false);
    $("#city").val($(this).attr("cname"));
    present_city_id = $(this).attr("id");
    $("#area").css("cursor","pointer");
    $("#city").attr("readonly",true);
    clearArea();
    $("#city-dropdown-menu").css("display","none");
}

function onAreaClick() {
    if(present_city_id===""){
        $("#area-dropdown-menu").css("display","block");
        return;
    }
    $("#area-dropdown-menu").empty();
    addAreas();
    $("#area-dropdown-menu").css("display","block");
}

function onAreaMenuClick() {
    $("#area").attr("readonly",false);
    $("#area").val($(this).attr("aname"));
    present_area_id = $(this).attr("id");
    $("#area").attr("readonly",true);
    $("#area-dropdown-menu").css("display","none");
}

function onBodyClick(e) {
    if($(e.target).attr('id')!='province-dropdown-menu'&&$(e.target).attr('id')!='province'&&$(e.target).attr('id')!='province-more'){
        $("#province-dropdown-menu").css("display","none");
    }
    if($(e.target).attr('id')!='city-dropdown-menu'&&$(e.target).attr('id')!='city'&&$(e.target).attr('id')!='city-more'){
        $("#city-dropdown-menu").css("display","none");
    }
    if($(e.target).attr('id')!='area-dropdown-menu'&&$(e.target).attr('id')!='area'&&$(e.target).attr('id')!='area-more'){
        $("#area-dropdown-menu").css("display","none");
    }
}
