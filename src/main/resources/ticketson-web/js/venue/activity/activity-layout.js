/**
 * Created by shea on 2018/2/17.
 */
//初始化操作
// window.localStorage.setItem("vid","6HnHaR2");
const aid = window.localStorage.getItem("aid");
const name = window.localStorage.getItem("v_name");
let levelPrices = window.localStorage.getItem("levelPrices").split(",");
levelPrices.map(function (price,index) {
    let level = index+1;
    let level_text = level+"级";
    let level_option = "<option value='"+level_text+"'>"+level_text+"</option>";
    $("#gs-header select").append(level_option);
});
$("#gs-header select").val(window.localStorage.getItem("level"));
let canvases = [];
let canvas_pointer = 0;
let gs_tooltip = null;
let gs_tooltip_rect = null;
let gs_tooltip_width = 120;
let gs_tooltip_height = 80;

let seat_tooltip = null;
let seat_tooltip_rect = null;
let seat_tooltip_width = 120;
let seat_tooltip_height = 200;
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
$("#venue-header").text(name);
$("#gs-header").css("display","none");

//获得活动的平面图，如果活动还没有平面图，就是获得场馆的平面图
$.post("/api/activity/getLayouts",{
    "aid": aid,
}).done(function (data) {
    data.map(function (layout,index) {
        createCanvas(layout,index);
    });
}).fail(function (data) {
    layer.msg(data);
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
    if(index!==0){
        canvas.forEachObject(function (obj) {
            if(obj.type==='seat-rect'){
                setSeatPrice(obj);
            }
        });
    }
    canvas.renderAll();
    let select_level = parseInt($("#level-select").val().substring(0,$("#level-select").val().length-1));
    canvases.push({"canvas":canvas,"lowestPriceLevel":select_level,"highestPriceLevel":select_level});
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
        }else {
            changePrice();
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
    seat_tooltip = makeTooltip({x:x,y:y},obj.floor,obj.area,obj.row,obj.column,obj.level,obj.price,obj.state);
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

function makeTooltip(pointer,floor,grandstand,row,column,level,price,state) {
    let position_item = '楼层：'+floor+'\n\n看台：'+grandstand+'\n\n位置：'+row+'排'+column+'座'+'\n\n等级：'+level+'\n\n价格：'+price+'\n\n状态：'+state;
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

function setSeatsPrice(group) {
    group.forEachObject(function (object) {
        if(object.type === 'seat-rect'){
            setSeatPrice(object)
        }
    });
}

function rangePrice() {
    let select_level = parseInt($("#level-select").val().substring(0,$("#level-select").val().length-1));
    console.log($("#level-select").val().substring(0,$("#level-select").val().length-1));
    let lowestPrice = levelPrices[canvases[canvas_pointer].lowestPriceLevel-1];
    let highestPrice = levelPrices[canvases[canvas_pointer].highestPriceLevel-1];
    let selectPrice = levelPrices[select_level-1];
    if(parseInt(lowestPrice)>parseInt(selectPrice)){
        console.log("lowestPrice>selectPrice");
        canvases[canvas_pointer].lowestPriceLevel = select_level;
        lowestPrice = selectPrice;
    }
    if(parseInt(highestPrice)<parseInt(selectPrice)){
        console.log("selecthhh:"+selectPrice+"lowest:"+lowestPrice+"----highest:"+highestPrice);
        console.log("highestPrice<selectPrice");
        canvases[canvas_pointer].highestPriceLevel = select_level;
        highestPrice = selectPrice;
    }
    console.log("select:"+selectPrice+"lowest:"+lowestPrice+"----highest:"+highestPrice);
}

function setSeatPrice(object) {
    let select_level = parseInt($("#level-select").val().substring(0,$("#level-select").val().length-1));
    let selectPrice = levelPrices[select_level-1];
    object.set('price',selectPrice);
    object.set('level',select_level);
    object.set('fill',level[select_level-1]);
    object.set('state','可售');
}

function changePrice() {
    let canvas = canvases[canvas_pointer].canvas;
    let group = canvas.getActiveGroup();
    if(group){
        setSeatsPrice(group);
        rangePrice();
    }
    let obj = canvas.getActiveObject();
    if(obj){
        setSeatPrice(obj);
        rangePrice();
    }
    canvas.renderAll();
}

function submitLayouts() {
    const loading_index = layer.load();
    let seats = [];
    let layouts = [];
    let lowestPrice = parseFloat(levelPrices[0]);
    canvases.map(function (canvas_obj) {
        if(levelPrices[parseInt(canvas_obj.lowestPriceLevel)-1]<lowestPrice){
            lowestPrice = levelPrices[parseInt(canvas_obj.lowestPriceLevel)-1];
        }
    });
    let venue = canvases[0].canvas;
    venue.forEachObject(function (obj) {
        if(obj.type.split('-')[0]==='grandstand'&&obj.hasCanvas){
            console.log(obj.g_id+"----"+canvases[obj.g_id].highestPriceLevel+"------"+obj.name);
            obj.set("lowestPrice",levelPrices[canvases[obj.g_id].lowestPriceLevel-1]);
            obj.set("highestPrice",levelPrices[canvases[obj.g_id].highestPriceLevel-1]);
        }
    });
    layouts.push(venue.toJSON());
    for(let i=1;i<canvases.length;i++){
        let canvas = canvases[i].canvas;
        canvas.forEachObject(function (obj) {
            if(obj.type==='seat-rect'){
                let seat = {
                    "layout_sid":obj.seatid,
                    "isAvailable":true,
                    "level":obj.level,
                    "price":obj.price,
                    "row":obj.row,
                    "column":obj.column,
                    "gs":obj.area,
                    "floor":obj.floor,
                };
                console.log(seat.isAvailable);
                seats.push(seat);
                if(parseFloat(obj.price)<lowestPrice){
                    lowestPrice = parseFloat(obj.price);
                }
            }
        });
        layouts.push(canvas.toJSON());
    }
    seats = JSON.stringify(seats);
    layouts = JSON.stringify(layouts);
    $.post("/api/activity/postLayouts",{
        "lowestPrice": lowestPrice,
        "aid": aid,
        "layouts":layouts,
        "seats": seats,
    }).done(function () {
        layer.close(loading_index);
        layer.alert("发布成功",function (index) {
            layer.close(index);
            forward("/pages/venue/activity/activity.html?type=1");
        });
    }).fail(function (data) {
        layer.close(loading_index);
        layer.msg(data.responseText);
    });
}


