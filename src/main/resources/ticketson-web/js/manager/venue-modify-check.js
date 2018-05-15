let totalNum;
const perPage = 10;

$.get("/api/manager/countVenueModifyToCheck").done(function (data) {
    totalNum = data;
    layui.use(['laypage'],function () {
        let laypage = layui.laypage;
        laypage.render({
            elem: 'venue-modify-check-page',
            count: totalNum,
            limit: perPage,
            layout: ['prev', 'page', 'next'],
            theme: '#f5c026',
            jump: function(obj){
                getVenueModifyToCheck(obj.curr-1);
            }
        });
    });
}).fail(function (data) {
    layer.msg(data.responseText);
});


function getVenueModifyToCheck(page) {
    $.get("/api/manager/getVenueModifyToCheck",{
        "page":page,
        "perPage":perPage,
    }).done(function (data) {
        setVenueModifyToCheck(data);
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}

function setVenueModifyToCheck(venues) {
    $("#venue-check").find(" tbody").empty();
    venues.map(function (venue,index) {
        let venue_city = province_object[venue.provinceCode].name+"·"+
            city_object[venue.cityCode].name+"·"+
            area_object[venue.districtCode].name;
        const venue_dom =
            "<tr>" +
            "<td>"+venue.vid+"</td>"+
            "<td>"+venue.name+"</td>"+
            "<td>"+venue_city+"<br>"+venue.location+"</td>"+
            "<td>"+venue.modifyTime+"</td>"+
            "<td>" +
            "<span class='table-btn' vid='"+venue.vid+"' onclick='checkVenueModifyPassed(this)'>通过</span>"+
            "<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>"+
            "<span class='table-btn' vid='"+venue.vid+"' onclick='checkVenueModifyFailed(this)'>不通过</span>"+
            "</td>"+
            "</tr>";
        $("#venue-check").find(" tbody").append(venue_dom);
    });
}

function checkVenueModifyPassed(dom) {
    const vid = $(dom).attr("vid");
    checkVenueModify(vid,true);
}

function checkVenueModifyFailed(dom) {
    const vid = $(dom).attr("vid");
    checkVenueModify(vid,false);
}

function checkVenueModify(vid,isPassed) {
    $.post("/api/manager/checkVenueModify",{
        "vid":vid,
        "isPassed":isPassed,
    }).done(function () {
        layer.alert("审核成功",function (index) {
            layer.close(index);
            forward("/pages/manager/venue-modify-check.html");
        });
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}

function toRegisterCheck() {
    forward("/pages/manager/venue-check.html");
}

