let totalNum;
const perPage = 10;

$.get("/api/manager/countVenuesToCheck").done(function (data) {
    totalNum = data;
    layui.use(['laypage'],function () {
        let laypage = layui.laypage;
        laypage.render({
            elem: 'venue-check-page',
            count: totalNum,
            limit: perPage,
            layout: ['prev', 'page', 'next'],
            theme: '#f5c026',
            jump: function(obj){
                getVenuesToCheck(obj.curr-1);
            }
        });
    });
}).fail(function (data) {
    layer.msg(data.responseText);
});


function getVenuesToCheck(page) {
    $.get("/api/manager/getVenuesToCheck",{
        "page":page,
        "perPage":perPage,
    }).done(function (data) {
        setVenuesToCheck(data);
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}

function setVenuesToCheck(venues) {
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
                "<td>"+venue.totalSeats+"</td>"+
                "<td>"+venue.registerTime+"</td>"+
                "<td>" +
                    "<span class='table-btn' name='"+venue.name+"' vid='"+venue.vid+"' onclick='toVenueLayoutCheck(this)'>查看平面图</span>"+
                    "<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>"+
                    "<span class='table-btn' vid='"+venue.vid+"' onclick='checkVenuePassed(this)'>通过</span>"+
                    "<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>"+
                    "<span class='table-btn' vid='"+venue.vid+"' onclick='checkVenueFailed(this)'>不通过</span>"+
                "</td>"+
            "</tr>";
        $("#venue-check").find(" tbody").append(venue_dom);
    });
}

function checkVenuePassed(dom) {
    const vid = $(dom).attr("vid");
    checkVenue(vid,true);
}

function checkVenueFailed(dom) {
    const vid = $(dom).attr("vid");
    checkVenue(vid,false);
}

function checkVenue(vid,isPassed) {
    $.post("/api/manager/checkVenue",{
        "vid":vid,
        "isPassed":isPassed,
    }).done(function () {
        layer.alert("审核成功",function (index) {
            layer.close(index);
            forward("/pages/manager/venue-check.html");
        });
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}

function toVenueLayoutCheck(dom) {
    const vid = $(dom).attr("vid");
    const name = $(dom).attr("name");
    window.localStorage.setItem("activity_layout_check_vid",vid);
    window.localStorage.setItem("activity_layout_check_v_name",name);
    forward("/pages/manager/venue-layout-check.html");
}

function toModifyCheck() {
    forward("/pages/manager/venue-modify-check.html");
}
