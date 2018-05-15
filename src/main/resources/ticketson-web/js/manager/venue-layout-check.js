/**
 * Created by shea on 2018/2/17.
 */
//初始化操作
// window.localStorage.setItem("vid","6HnHaR2");
const vid = window.localStorage.getItem("activity_layout_check_vid");
const name = window.localStorage.getItem("activity_layout_check_v_name");

let canvases = [];
let canvas_pointer = 0;
let gs_tooltip = null;
let gs_tooltip_rect = null;
let gs_tooltip_width = 120;
let gs_tooltip_height = 80;

let seat_tooltip = null;
let seat_tooltip_rect = null;
let seat_tooltip_width = 120;
let seat_tooltip_height = 140;
let seat_size = 40;
// console.log($("#canvases").css("width").substring(0,$("#canvases").css("width").length-2));

let canvases_width = parseInt($("#canvases").css("width").substring(0,$("#canvases").css("width").length-2));
if(canvases_width>1120){
    let padding = (canvases_width-1080)/2;
    $("#canvases").css({
        "padding-left":padding+"px",
        "padding-right":padding+"px",
    })
}
$("#venue-header").css("display","block");
$("#venue-title").text(name);
$("#gs-header").css("display","none");

//获得活动的平面图，如果活动还没有平面图，就是获得场馆的平面图
$.post("/api/venue/getLayouts",{
    "vid": vid,
}).done(function (data) {
    data.map(function (layout,index) {
        createCanvas(layout,index);
    });
}).fail(function (data) {
    layer.msg(data.responseText);
});


/**
 * ==================canvas======================
 */


function createCanvas(layout,index){
    let canvas_wrapper_id = "gs-wrapper-"+index;
    let canvas_id = "gs-"+index;
    let canvas_dom =
        "<div id='"+canvas_wrapper_id+"'>" +
        "<canvas id='"+canvas_id+"'></canvas>" +
        "</div>";
    $("#canvases").append(canvas_dom);
    let canvas = new fabric.Canvas(canvas_id,{
        "width":1080,
        "height":720,
    });
    canvas.loadFromJSON(layout);
    canvas.forEachObject(function (obj) {
        obj.hasControls = false;
        obj.lockMovementX = true;
        obj.lockMovementY = true;
    });
    canvas.on({
        'mouse:over':onMouseOver,
        'mouse:out': onMouseOut,
        'mouse:move': onMouseMove,
        'object:selected':onSelectCreated,
        'selection:cleared': onSelectCleared,
    });
    canvas.renderAll();
    canvases.push({"canvas":canvas});
    if(index===0){
        $("#"+canvas_wrapper_id).css({
            "display":"block"
        });
    }else {
        $("#"+canvas_wrapper_id).css({
            "display":"none"
        });
    }
}

function onMouseOver(event) {
    let obj = event.target;
    if(obj){
        if(obj.type === 'seat-rect'||obj.type.split('-')[0] === 'grandstand'){
            hoverArea(obj);
        }
    }
}
function onMouseOut(event) {
    let obj = event.target;
    if(obj){
        if(obj.type === 'seat-rect'||obj.type.split('-')[0] === 'grandstand'){
            unhoverArea(obj);
        }
    }
}
function onMouseMove() {
    if(gs_tooltip){
        moveGSTooltip();
    }
}
function onSelectCreated(event) {
    let obj = event.target;
    //显示基本设置选项
//        updateSettings();
    //显示看台选项
    if(obj){
        if(obj.type.split('-')[0] === 'grandstand'){
            hideGSTooltip();
            if(obj.hasCanvas){
                changeCanvasPointer(obj.g_id);
            }
        }
    }
}
function onSelectCleared(event) {
    let obj = event.target;
    //清空基本设置选项
//        clearSettings();
//        //清空right-nav已经被设置的看台信息
//        hideGrandstandInfos();
//        hideGrandOptions();
//        if(select_rect){
//            canvases[canvas_pointer].canvas.canvas.remove(select_rect);
//            select_rect = null;
//        }
}
function hoverArea(obj) {
    if(obj.type === 'seat-rect'){
        obj.setShadow({ color: 'rgba(0,0,0,0.7)',blur: 10 });
        showTooltip(obj);
    }else if(obj.type.split('-')[0]==='grandstand'){
        if(canvas_pointer===0){
            obj.setShadow({ color: 'rgba(0,0,0,0.7)',blur: 10 });
            showGSTooltip(obj);
        }
    }

}
function unhoverArea(obj) {
    if(obj.type === 'seat-rect'){
        obj.setShadow({ color: 'rgba(0,0,0,0.0)',blur: 0 });
        hideToolTip();
    }else if(obj.type.split('-')[0]==='grandstand'){
        obj.setShadow({ color: 'rgba(0,0,0,0.0)',blur: 0 });
        hideGSTooltip();
    }
}
function hideToolTip() {
    let canvas = canvases[canvas_pointer].canvas;
    if(seat_tooltip){
        canvas.remove(seat_tooltip);
        canvas.remove(seat_tooltip_rect);
        canvas.renderAll();
        seat_tooltip = null;
        seat_tooltip_rect = null;
    }
}
function showTooltip(obj) {
    hideToolTip();
    hideGSTooltip();
    let canvas = canvases[canvas_pointer].canvas;
    let pointer = canvas.getPointer();
    let x,y;
    if(pointer.x+seat_size+seat_tooltip_width>canvas.width){
        x = pointer.x -seat_size - seat_tooltip_width;
    }else {
        x = pointer.x + seat_size;
    }
    if(pointer.y-seat_tooltip_height/2<0){
        y = 0;
    }else {
        y = pointer.y-seat_tooltip_height/2;
    }
    seat_tooltip_rect = makeTooltipRect({x:x,y:y});
    canvas.add(seat_tooltip_rect);
    seat_tooltip = makeTooltip({x:x,y:y},obj.floor,obj.area,obj.row,obj.column);
    canvas.add(seat_tooltip);
    canvas.renderAll();
}
function showGSTooltip(obj) {
    hideGSTooltip();
    hideToolTip();
    let canvas = canvases[canvas_pointer].canvas;
    let pointer = canvas.getPointer();
    let x,y;
    if(pointer.x+gs_tooltip_width+40>canvas.width){
        x = pointer.x - gs_tooltip_width-40;
    }else {
        x = pointer.x + 40;
    }
    if(pointer.y-gs_tooltip_height/2<0){
        y = 0;
    }else {
        y = pointer.y-gs_tooltip_height/2;
    }
    gs_tooltip_rect = makeGSTooltipRect({x:x,y:y});
    canvas.add(gs_tooltip_rect);
    gs_tooltip = makeGSTooltip({x:x,y:y},obj.floor,obj.name);
    canvas.add(gs_tooltip);
    canvas.renderAll();
}

function hideGSTooltip() {
    let canvas = canvases[canvas_pointer].canvas;
    if(gs_tooltip){
        canvas.remove(gs_tooltip);
        canvas.remove(gs_tooltip_rect);
    }
    canvas.renderAll();
    gs_tooltip = null;
    gs_tooltip_rect = null;
}
function moveGSTooltip() {
    let canvas = canvases[canvas_pointer].canvas;
    let pointer = canvas.getPointer();
    let x, y;
    if (pointer.x + gs_tooltip_width + 40 > canvas.width) {
        x = pointer.x - gs_tooltip_width - 40;
    } else {
        x = pointer.x + 40;
    }
    if (pointer.y - gs_tooltip_height / 2 < 0) {
        y = 0;
    } else {
        y = pointer.y - gs_tooltip_height / 2;
    }
    gs_tooltip_rect.left = x;
    gs_tooltip_rect.top = y;
    gs_tooltip.left = x+10;
    gs_tooltip.top = y+10;
    canvas.renderAll();
}

function makeGSTooltipRect(pointer) {
    return  new fabric.Rect({
        left:pointer.x,
        top: pointer.y,
        width: gs_tooltip_width,
        height: gs_tooltip_height,
        strokeWidth: 1,
        fill: '#000000',
        stroke: '#000000',
        shadow: 'rgba(0,0,0,0.3) 6px 6px 12px'
    });
}

function makeGSTooltip(pointer,floor,grandstand) {
    let position_item = '楼层：'+floor+'\n\n看台：'+grandstand;
    return new fabric.IText(position_item, {
        left: pointer.x+10,
        top: pointer.y+10,
        fontFamily: 'optima',
        fill: '#ffffff',
        fontSize: 12
    });
}

function makeTooltipRect(pointer) {
    return  new fabric.Rect({
        left:pointer.x,
        top: pointer.y,
        width: seat_tooltip_width,
        height: seat_tooltip_height,
        strokeWidth: 1,
        fill: '#000000',
        stroke: '#000000',
        shadow: 'rgba(0,0,0,0.3) 6px 6px 12px'
    });
}

function makeTooltip(pointer,floor,grandstand,row,column) {
    let position_item = '楼层：'+floor+'\n\n看台：'+grandstand+'\n\n位置：'+row+'排'+column+'座\n\n';
    return new fabric.IText(position_item, {
        left: pointer.x+10,
        top: pointer.y+10,
        fontFamily: 'optima',
        fill: '#ffffff',
        fontSize: 12
    });
}

function changeCanvasPointer(to) {
    canvases[canvas_pointer].canvas.discardActiveObject();
    if(to===0){
        $("#venue-header").css("display","block");
        $("#gs-header").css("display","none");
        hideToolTip();
    }else {
        $("#venue-header").css("display","none");
        $("#gs-header").css("display","block");
        hideGSTooltip();
    }
    $("#gs-wrapper-"+canvas_pointer).css("display","none");
    canvas_pointer = to;
    $("#gs-wrapper-"+canvas_pointer).css("display","block");
}

//审核场馆
function checkVenue() {
    let check_dom =
        "<div class='check-choice'>"+
        "<input value='true' type='radio' name='isPassed' checked>&nbsp;&nbsp;通过" +
        "<input style='margin-left: 40px' value='false' type='radio' name='isPassed'>&nbsp;&nbsp;不通过"+
        "</div>";
    layer.open({
        "title":"选择该场馆是否审核通过",
        "content":check_dom,
        yes:function (index,dom) {
            const isPassed = $("input[name='isPassed']:checked").val()==="true";
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
    });

}
