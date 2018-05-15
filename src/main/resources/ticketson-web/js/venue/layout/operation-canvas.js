/**
 * 画布的操作
 */
/**
 * =============================================================================
 * ==============================初始化操作======================================
 * =============================================================================
 */
$(function () {
    const vid = getUrlParam("vid");
    $.post("/api/venue/getLayouts",{
        "vid": vid,
    }).done(function (data) {
        $("#title").text(window.localStorage.getItem("register_v_name")+"平面图");
        let layouts = data;
        let venue = initVenue();
        venue.loadFromJSON(layouts[0]);
        venue.forEachObject(function (obj) {
            if(obj.type.split('-')[0]==='grandstand'&&obj.hasCanvas){
                let g_id = obj.g_id;
                let canvas = initGS(g_id);
                canvas.loadFromJSON(layouts[g_id]);
                let floor_name = obj.floor;
                let gs_name = obj.name;
                canvases[g_id] = {type:'grandstand',canvas:canvas,name:gs_name,floor_name:floor_name,deleted: false};
                addListener(g_id);
                //创建楼层导航
                if($("#floors").find("#"+floor_name).length===0){
                    createFloorNav(floor_name);
                }
                //创建看台导航
                createGrandStandNav(floor_name,gs_name,g_id);
            }
        });
    }).fail(function (data) {
        console.log(data);
        layer.msg(data.responseText);
        //todo 如果没有layouts
        initVenue();
    });

});

/**
 * 初始化总平面图画布
 */
function initVenue() {
    let canvas_id = "gs-"+canvases.length;
    let canvas_dom = "<div id='"+canvas_id+"-wrapper'><canvas id='"+canvas_id+"'></canvas></div>";
    $("#canvases").append(canvas_dom);
    let venue = new fabric.Canvas(canvas_id, {
        width: venue_wrapper_width - 20,
        height: venue_wrapper_height - 20,
        backgroundColor: '#ffffff',
        selection: false

    });
    const name = getUrlParam("name");
    canvases.push({type:'venue',canvas:venue,name:name,deleted: false});
    addListener(0);
    return venue;
}

//创建看台平面图画布
function initGS(g_id) {
    //创建看台画布
    let wrapper_width = venue_wrapper_width;
    let wrapper_height = venue_wrapper_height;
    let width = wrapper_width - 20;
    let height = wrapper_height-20-stage_height-1;
    // let wrapper_height = height+stage_height+20+1;
    let canvas_id = "gs-"+g_id;
    let image_margin_left = (width - stage_size)/2;
    let image_margin_top = (stage_height - stage_size)/2;
    let canvas_controller_height = height+1;
    let canvas_controller_margin_top = (stage_height - stage_size)/2;
    let canvas_wrapper =
        "<div id='"+canvas_id+"-wrapper' style='width: "+wrapper_width+"px;height: "+wrapper_height+"px;display: none'>"+
        "<div>" +
        "<img src='../../resources/shapes/stage.svg' style='margin-left: "+image_margin_left+"px; margin-top: "+image_margin_top+"px;height: "+stage_size+"px;width: "+stage_size+"px'>" +
        "</div> "+
        "<div style='margin-top: "+canvas_controller_margin_top+"px;height: "+canvas_controller_height+"px;width: "+width+"px;border-top: 1px solid #9b9b9b' >"+
        "<canvas id='"+canvas_id+"'></canvas>"+
        "</div>"+
        "</div>";
    $('#canvases').append(canvas_wrapper);
    let canvas = new fabric.Canvas(canvas_id,{
        width:width,
        height:height,
        backgroundColor: '#ffffff',
    });
    return canvas;
}

/**
 * 添加事件监听
 */
function addListener(pointer) {
    let canvas = canvases[pointer].canvas;
    canvas.on({
        'mouse:over':onMouseOver,
        'mouse:out': onMouseOut,
        'mouse:down': onMouseDown,
        'mouse:move': onMouseMove,
        'mouse:up': onMouseUp,
        'object:selected':onSelectCreated,
        'selection:cleared': onSelectCleared,
        'object:removed': onObjectRemoved,
        'object:moving': onObjectMoving,
        'object:scaling': updateSettings,
        'object:resizing': updateSettings,
        'object:rotating': updateSettings,
        'object:skewing': updateSettings,
        'object:added': onObjectAdded,
        'object:modified':onObjectModified,
    });
}


/**
 * =============================================================================
 * ================================事件监听处理===================================
 * =============================================================================
 */
/**
 * ==================canvas======================
 */
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
function onMouseDown(event) {
    mouse_down = true;
    if(draw_mode==='ellipse'){
        drawEllipse();
    }else if(draw_mode === 'select_rect'){
        drawSelectRect();
    }else if(draw_mode === 'rect') {
        drawRect();
    }else if(draw_mode === 'line'){
        drawLine();
    }else if(draw_mode === 'poly') {
        drawPoly();
    }else if(draw_mode === 'triangle') {
        drawTriangle();
    }
    console.log('onmousedown');
}
function onMouseMove(event) {
    if(mouse_down){
        if(draw_mode==='ellipse'){
            redrawEllipse();
        }else if(draw_mode === 'select_rect'){
            redrawSelectRect();
        }else if(draw_mode === 'rect'){
            redrawRect();
        }else if(draw_mode === 'line') {
            redrawLine();
        }else if(draw_mode === 'poly') {
            redrawPoly();
        }else if(draw_mode === 'triangle') {
            redrawTriangle();
        }
    }
}
function onMouseUp() {
    if(draw_mode==='line'){
        line = null;
        draw_mode = null;
    }else if(draw_mode === 'poly'){
        //如果画的是多边形
        judgeEndPoly();
    }else if(draw_mode === null){
        if(isMoving!==null){
            justifySeats(isMoving);
            if(isMoving.type === 'group'){
                let canvas = canvases[canvas_pointer].canvas;
                canvas.discardActiveGroup();
                canvas.renderAll();
            }
            addNumber();
            isMoving = null;
        }
    }else {
        //结束画图
        to_draw = null;
        draw_mode = null;
    }
    mouse_down = false;
}
function onSelectCreated(event) {
    let obj = event.target;
    //显示基本设置选项
    updateSettings();
    //显示看台选项
    if(obj && obj.type.split('-')[0] === 'grandstand'){
        //如果该图形已经被设置为看台，即已经建立了画布，则直接显示信息
        if(obj.hasCanvas){
            showGrandstandInfos(obj);
        }else {
            showGrandOptions();
        }
    }
}
function onSelectCleared(event) {
    let obj = event.target;
    //清空基本设置选项
    clearSettings();
    //清空right-nav已经被设置的看台信息
    hideGrandstandInfos();
    hideGrandOptions();
    if(select_rect){
        canvases[canvas_pointer].canvas.remove(select_rect);
        select_rect = null;
    }
}
function onObjectScaling(event) {
    let obj = event.target;
    console.log(obj.toJSON());
}
function onObjectRemoved(event) {
    let o = event.target;
    if(o.type.split('-')[0]==='grandstand'&& o.hasCanvas){
        //在canvases数组中将该图形对应的场馆画布置为deleted
        canvases[o.g_id].deleted = true;
        //在左边导航栏中删除相应的导航
        $('#'+o.g_id+'-gs-menu').remove();
        //删除相应的画布
        $('#gs'+o.g_id+'-wrapper').remove();
    }
}
function onObjectMoving(event) {
    updateSettings();
    let obj = event.target;
    if(obj.type === 'group'||obj.type === 'seat-rect'){
        isMoving = obj;
    }
    // if(obj.type === '')

}
function onObjectAdded(event) {
    let obj = event.target;
    // console.log(obj.toJSON());
    // updateSettings(obj);
}
function onObjectModified(event) {
    let obj = event.target;
    if(obj.type === 'seat-rect'){
        justifySeats(obj);

    }
    // console.log(obj);
}
/**
 * 向当前画布中画椭圆
 */
function drawEllipse() {
    let canvas = canvases[canvas_pointer].canvas;
    let pointer = canvas.getPointer();
    to_draw = makeEllipse(pointer);
    canvas.add(to_draw);
}
/**
 * 鼠标移动，椭圆不断扩大
 */
function redrawEllipse() {
    let canvas = canvases[canvas_pointer].canvas;
    let pointer = canvas.getPointer();
    let origX = to_draw.left;
    let origY = to_draw.top;
    to_draw.set({ rx: Math.abs(origX - pointer.x)/2,ry:Math.abs(origY - pointer.y)/2 });
    canvas.renderAll();
    //不加这句话画的图形就没法被选择>,<!!!!!!!!!!!!!!!!!!!!!!!!
    to_draw.setCoords();
}
/**
 * 鼠标按下，开始画矩形选框
 */
function drawSelectRect() {
    console.log(canvas_pointer);
    let canvas = canvases[canvas_pointer].canvas;
    let pointer = canvas.getPointer();
    select_rect = makeSelectRect(pointer);
    console.log(select_rect.toJSON());
    canvas.add(select_rect);
}
/**
 * 鼠标移动，矩形选框不断扩大
 */
function redrawSelectRect() {
    let canvas = canvases[canvas_pointer].canvas;
    let pointer = canvas.getPointer();
    let origX = select_rect.left;
    let origY = select_rect.top;
    select_rect.set({ width: Math.abs(origX - pointer.x),height:Math.abs(origY - pointer.y), hasControls:false });
    canvas.renderAll();
    //不加这句话画的图形就没法被选择>,<!!!!!!!!!!!!!!!!!!!!!!!!
    select_rect.setCoords();
}
/**
 * 鼠标按下，开始画矩形
 */
function drawRect() {
    let canvas = canvases[canvas_pointer].canvas;
    let pointer = canvas.getPointer();
    to_draw = makeRect(pointer);
    canvas.add(to_draw);
}
/**
 * 鼠标移动，矩形不断扩大
 */
function redrawRect() {
    let canvas = canvases[canvas_pointer].canvas;
    let pointer = canvas.getPointer();
    let origX = to_draw.left;
    let origY = to_draw.top;
    to_draw.set({ width: Math.abs(origX - pointer.x),height:Math.abs(origY - pointer.y) });
    canvas.renderAll();
    //不加这句话画的图形就没法被选择>,<!!!!!!!!!!!!!!!!!!!!!!!!
    to_draw.setCoords();
}
/**
 * 鼠标按下，开始画三角形
 */
function drawTriangle() {
    let canvas = canvases[canvas_pointer].canvas;
    let pointer = canvas.getPointer();
    to_draw = makeTriangle(pointer);
    canvas.add(to_draw);
}
/**
 * 鼠标移动，三角形不断扩大
 */
function redrawTriangle() {
    let canvas = canvases[canvas_pointer].canvas;
    let pointer = canvas.getPointer();
    let origX = to_draw.left;
    let origY = to_draw.top;
    to_draw.set({ width: Math.abs(origX - pointer.x),height:Math.abs(origY - pointer.y) });
    canvas.renderAll();
    //不加这句话画的图形就没法被选择>,<!!!!!!!!!!!!!!!!!!!!!!!!
    to_draw.setCoords();
}

/**
 * 鼠标按下，开始画直线
 */
function drawLine() {
    let canvas = canvases[canvas_pointer].canvas;
    let pointer = canvas.getPointer();
    console.log('begin'+pointer.x+","+pointer.y);
    line = makeLine(pointer.x,pointer.y,pointer.x,pointer.y,true);
    canvas.add(line);
    canvas.renderAll();
}
/**
 * 鼠标移动，直线不断增长
 */
function redrawLine() {
    let canvas = canvases[canvas_pointer].canvas;
    let pointer = canvas.getPointer();
    line.set({ 'x2': pointer.x,'y2':pointer.y });
    canvas.renderAll();
    //不加这句话画的图形就没法被选择>,<!!!!!!!!!!!!!!!!!!!!!!!!
    line.setCoords();
}
/**
 * 鼠标按下，新建多边形的一条边并开始画这条边
 */
function drawPoly() {
    let canvas = canvases[canvas_pointer].canvas;
    let pointer = canvas.getPointer();
    console.log('begin'+pointer.x+","+pointer.y);
    if(new_edge===null){
        //画第一条边
        new_edge = makeLine(pointer.x,pointer.y,pointer.x,pointer.y,false);
        begin_pointer = pointer;
        //向poly_pointers添加开始节点
        poly_pointers.push({'x':begin_pointer.x,'y':begin_pointer.y});
    }else {
        //画剩余的边
        let x1 = new_edge.get('x2');
        let y1 = new_edge.get('y2');
        new_edge = makeLine(x1,y1,pointer.x,pointer.y,false);
    }
    canvas.add(new_edge);
    canvas.renderAll();
}
/**
 * 鼠标移动，延长多边形当前的这条边
 */
function redrawPoly() {
    let canvas = canvases[canvas_pointer].canvas;
    let pointer = canvas.getPointer();
    new_edge.set({ 'x2': pointer.x,'y2':pointer.y });
    canvas.renderAll();
    //不加这句话画的图形就没法被选择>,<!!!!!!!!!!!!!!!!!!!!!!!!
    new_edge.setCoords();
}
/**
 * 在画多边形每次鼠标松开时，判断结束点是否接近开始点，如接近，则融合并结束
 */
function judgeEndPoly() {
    let canvas = canvases[canvas_pointer].canvas;
    let end_x = new_edge.get('x2');
    let end_y = new_edge.get('y2');
    if(Math.abs(end_x-begin_pointer.x)<=20&&Math.abs(end_y-begin_pointer.y)<=20){
        //如果接近
        new_edge.set({'x2':begin_pointer.x,'y2':begin_pointer.y});
        canvas.renderAll();
        //不加这句话画的图形就没法被选择>,<!!!!!!!!!!!!!!!!!!!!!!!!
        new_edge.setCoords();
        //存储新画的边
        poly_edges.push(new_edge);
        //偷梁换柱，把直线换成真正的多边形
        let poly = makePoly(poly_pointers);
        canvas.add(poly);
        poly_edges.map(function (line) {
            canvas.remove(line);
        });
        canvas.renderAll();
        poly_pointers = [];
        poly_edges = [];
        new_edge = null;
        begin_pointer = null;
        draw_mode = null;
    }else {
        //如果不接近
        poly_pointers.push({x:end_x,y: end_y});
        //存储新画的边
        poly_edges.push(new_edge);
    }

}


function hoverArea(obj) {
    let canvas = canvases[canvas_pointer].canvas;
    if(obj.type === 'seat-rect'){
        obj.setShadow({ color: 'rgba(0,0,0,0.7)',blur: 10 });
        showTooltip(obj);
    }else if(obj.type.split('-')[0]==='grandstand'){
        obj.setShadow({ color: 'rgba(0,0,0,0.7)',blur: 10 });
        canvas.renderAll();
    }

}
function unhoverArea(obj) {
    let canvas = canvases[canvas_pointer].canvas;
    obj.setShadow({ color: 'rgba(0,0,0,0.0)',blur: 0 });
    canvas.renderAll();
    if(obj.type === 'seat-rect'){
        hideToolTip();
    }
}
function hideToolTip() {
    let canvas = canvases[canvas_pointer].canvas;
    if(tooltip){
        canvas.remove(tooltip);
        canvas.remove(tooltip_rect);
        canvas.renderAll();
        tooltip = null;
        tooltip_rect = null;
    }
}
function showTooltip(obj) {
    let canvas = canvases[canvas_pointer].canvas;
    let pointer = canvas.getPointer();
    let x,y;
    if(pointer.x+seat_size+tooltip_width>canvas.width){
        x = pointer.x -seat_size - tooltip_width;
    }else {
        x = pointer.x + seat_size;
    }
    if(pointer.y-tooltip_height/2<0){
        y = 0;
    }else {
        y = pointer.y-tooltip_height/2;
    }
    tooltip_rect = makeTooltipRect({x:x,y:y});
    canvas.add(tooltip_rect);
    tooltip = makeTooltip({x:x,y:y},obj.floor,obj.area,obj.row,obj.column);
    canvas.add(tooltip);
    canvas.renderAll();
}

function justifySeats(obj) {

    let left = obj.left;
    let to_left_gap = left-parseInt(left/seat_size)*seat_size;
    let to_right_gap = seat_size - to_left_gap;
    obj.left = to_left_gap<=to_right_gap?left-to_left_gap:left+to_right_gap;

    let top = obj.top;
    let to_top_gap = top - parseInt(top/seat_size)*seat_size;
    let to_bottom_gap = seat_size - to_top_gap;
    obj.top = to_top_gap<=to_bottom_gap?top-to_top_gap:top+to_bottom_gap;

    obj.setCoords();
    canvases[canvas_pointer].canvas.renderAll();
    console.log(obj.left+"  "+obj.top);
}







