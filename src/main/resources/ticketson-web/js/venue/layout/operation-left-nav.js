/**
 * ===================left-nav====================
 */
/**
 * 建立看台导航
 */
function createGrandStandNav(floor_name,grandstand_name,id) {
    $('#floors>#'+floor_name+'>.collapse-inside-menu').css('display','block');
    let new_grandstand =
        "<button class='collapse-inside-menu' id='"+id+"-gs-menu' style='width: 100%' onclick='showGrandstand("+id+")'>"+grandstand_name+"</button>";
    $("#"+floor_name).append(new_grandstand);
}
/**
 * 建立楼层导航
 */
function createFloorNav(floor_name) {
    let new_floor =
        "<div id='"+floor_name+"'>"+
        "<button class='collapse-menu' id='"+floor_name+"-menu' style='width: 100%' onclick='collapseOtherFloors(this)'>"+floor_name+"</button>"+
        "</div>";
    $('#floors').append(new_floor);
}
/**
 * 折叠面板效果
 */
function collapseOtherFloors(dom) {
    let floor_name = $(dom).text();
    $('#floors>div>.collapse-inside-menu').css('display','none');
    $('#floors>#'+floor_name+'>.collapse-inside-menu').css('display','block');
}
function showVenue() {
    // $('#floors>div>.collapse-inside-menu').css('display','none');
    showGrandstand(0,getUrlParam("name"));
}

/**
 * 显示指定画布
 */
function showGrandstand(id) {
    //隐藏当前画布
    $('#canvases').find("#gs-"+canvas_pointer+"-wrapper").css('display','none');
    //重置指针
    canvas_pointer = id;
    //显示指针所指向的画布
    $('#canvases').find("#gs-"+canvas_pointer+"-wrapper").css('display','block');
    //如果指定画布是座位平面图，那么就隐藏图形工具栏和右边的工具栏
    if(canvases[canvas_pointer].type!=='venue'){
        $('#shape-icons').css('display','none');
        $('#right-nav').css('display','none');
        $("#canvases").css({
            "right":0
        });
        $('#select-icon').css('display','inline');
        $('#add-seat-icon').css('display','inline');
        $('#line-pen').css('display','none');
        $('#text-pen').css('display','none');
        $('#text-settings').css('display','none');
    }else {
        $('#shape-icons').css('display','inline');
        $('#right-nav').css('display','block');
        $("#canvases").css({
            "right":188
        });
        $('#select-icon').css('display','none');
        $('#add-seat-icon').css('display','none');
        $('#line-pen').css('display','inline');
        $('#text-pen').css('display','inline');
        $('#text-settings').css('display','inline');
    }
    let name = canvases[id].name;
    $('#title').text(name+"平面图");
}