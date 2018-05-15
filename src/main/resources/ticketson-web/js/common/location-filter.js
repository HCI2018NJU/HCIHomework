/**
 * Created by shea on 2018/2/12.
 */
let location_filter =
    "<div id='location-wrapper' onmouseleave='hideLocationChoice()'>" +
        "<div id='location-container'>" +
            "<span id='province-input' onclick='showLocationChoice()'>省</span>" +
            "<span id='city-input' onclick='showLocationChoice()'>市</span>" +
            "<span id='district-input' onclick='showDistrictChoice()'>区</span>" +
        "</div>" +
        "<div id='location-choice'></div>" +
        "<div id='district-choice'></div>" +
    "</div>";
$("#location-part").append(location_filter);

let present_city_id = '';
let present_province_id = '';
let present_district_id = '';
for(const province_id in city){
    const province_name = province_object[province_id].name;
    let location_item =
        "<div class='location-item' id='"+province_id+"'>" +
        "<div id='"+province_id+"' class='province-specific' onclick='wp(this)'>"+province_name+"</div>"+
        "<div class='city-specific'></div>"+
        "</div>";
    $("#location-choice").append(location_item);
    city[province_id].map(function (city) {
        const city_id = city.id;
        const city_name = city.name;
        let city_dom = "<div id='"+city_id+"' onclick='wc(this)'>"+city_name+"</div>";
        $("#"+province_id).children().eq(1).append(city_dom);
    });
}
function wp(dom) {
    let province_id = $(dom).attr("id");
    present_province_id = province_id;
    $("#province-input").text($(dom).html());
    present_city_id = '';
    $("#city-input").text("市");
    present_district_id = '';
    $("#district-input").text("区");
    hideLocationChoice();
}

function outW(provinceCode,provinceName,cityCode,cityName,districtCode,districtName) {
    present_province_id = provinceCode;
    $("#province-input").text(provinceName);
    present_city_id = cityCode;
    $("#city-input").text(cityName);
    present_district_id = districtCode;
    $("#district-input").text(districtName);
}
function wc(dom) {
    present_district_id = '';
    $("#district-input").text("区");
    let city_id = $(dom).attr("id");
    let province_name = city_object[city_id].province;
    present_province_id = findProvinceId(province_name)
    $("#province-input").text(province_name);
    present_city_id = city_id;
    $("#city-input").text($(dom).html());
    hideLocationChoice();
}
function findProvinceId(province_name) {
    for(let i=0;i<province.length;i++){
        if(province[i].name===province_name){
            return province[i].id;
        }
    }
}
function wd(dom) {
    let district_id = $(dom).attr("id");
    present_district_id = district_id;
    $("#district-input").text($(dom).html());
    hideDistrictChoice();
}
function hideDistrictChoice() {
    $("#district-choice").css("display","none");
}
function showLocationChoice() {
    $("#location-choice").css("display","block");
}
function hideLocationChoice() {
    $("#location-choice").css("display","none");
    hideDistrictChoice();
}
function showDistrictChoice() {
    $("#location-choice").css("display","none");
    if(present_city_id===''){
        return;
    }else {
        $("#district-choice").empty();
        console.log($("#district-choice"));
        console.log(present_city_id);
        console.log(area);
        area[present_city_id].map(function (district) {
            const district_id = district.id;
            const district_name = district.name;
            let district_item = "<div id='"+district_id+"' onclick='wd(this)'>"+district_name+"</div>";
            $("#district-choice").append(district_item);
        });
        $("#district-choice").css("display","block");
    }
}