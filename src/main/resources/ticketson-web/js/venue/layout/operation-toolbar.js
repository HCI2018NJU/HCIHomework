/**
 * ==================toolbar======================
 */
$('#select-icon').css('display','none');
$('#add-seat-icon').css('display','none');
/**
 * 清空画布
 */
function clearCanvas() {
    let canvas = canvases[canvas_pointer].canvas;
    //在清屏之前删除区域导航及画布
    if(canvases[canvas_pointer].type === 'venue'){
        canvas.forEachObject(function (o) {
            onObjectRemoved(o);
        });
    }
    canvas.clear();
}
/**
 * 切换画笔模式为椭圆模式
 */
function switchToEllipse() {
    draw_mode = 'ellipse';
}
/**
 * 切换到矩形选择模式
 */
function switchToSelectRect() {
    if(draw_mode==='select_rect'){
        draw_mode = null;
        if(select_rect){
            canvases[canvas_pointer].canvas.remove(select_rect);
        }
    }else {
        draw_mode = 'select_rect';
    }

}
/**
 * 切换画笔模式为矩形模式
 */
function switchToRect() {
    draw_mode = 'rect';
}
/**
 * 切换画笔模式为直线模式
 */
function switchToLine() {
    draw_mode = 'line';
}
/**
 * 切换画笔模式到多边形模式
 */
function switchToPoly() {
    draw_mode = 'poly';
}
/**
 * 切换画笔模式为三角形模式
 */
function switchToTriangle() {
    draw_mode = 'triangle';
}


/**
 * 填充座位
 */
function addSeats() {
    if(!select_rect)return;
    let canvas = canvases[canvas_pointer].canvas;
    let beginX = parseInt((select_rect.left+seat_size-1)/seat_size)*seat_size;
    let beginY = parseInt((select_rect.top+seat_size-1)/seat_size)*seat_size;
    let gapX = select_rect.width;
    let gapY = select_rect.height;
    let seat;
    console.log('beginX:==='+beginX);
    console.log('beginY:==='+beginY);
    for(let x=beginX;x<beginX+gapX-seat_size;x=x+seat_size){
        for(let y=beginY;y<beginY+gapY-seat_size;y=y+seat_size){
            seat = makeSeat({x:x,y:y});
            canvas.add(seat);
        }
    }
    canvas.renderAll();
    canvas.remove(select_rect);
    select_rect = null;
    addNumber();
}
/**
 * 给座椅编号
 */
function addNumber() {
    let canvas_info = canvases[canvas_pointer];
    let canvas = canvas_info.canvas;
    let seats = [];
    let seats_toremove = [];
    for(let i=0;i<canvas.width/seat_size;i++){
        seats[i] = [];
    }
    canvas.forEachObject(function (o) {
        if(o.type==='seat-rect'){
            let i = parseInt(o.top/seat_size);
            let j = parseInt(o.left/seat_size);
            if(seats[i][j]){
                seats_toremove.push(seats[i][j]);
            }
            seats[i][j] = o;
        }
    });
    seats_toremove.map(function (seat) {
        canvas.remove(seat);
    });
    if(tooltip){
        canvas.remove(tooltip);
        tooltip = null;
    }
    if(tooltip_rect){
        canvas.remove(tooltip_rect);
        tooltip_rect = null;
    }
    canvas.renderAll();
    let line = 0;
    // let seatid = 0;
    for(let i=0;i<seats.length;i++){
        if(seats[i].length>0){
            line ++;
        }
        let column = 0;
        for(let j=0;j<seats[i].length;j++){
            if(seats[i][j]){
                column++;
                seats[i][j].set('row',line);
                seats[i][j].set('column',column);
                // seats[i][j].set('seatid',seatid);
                seats[i][j].set('floor',canvas_info.floor_name);
                seats[i][j].set('area',canvas_info.name);
            }
        }
    }
    seats = null;
    seats_toremove = null;
}
/**
 * 删除选中的对象
 */
function deleteObject() {
    let canvas = canvases[canvas_pointer].canvas;
    if(canvas.getActiveObject()&& canvas.getActiveObject().type === 'line-dot'){
        return;
    }
    if(canvas.getActiveGroup()){
        canvas.getActiveGroup().forEachObject(function(o){ canvas.remove(o); });
        canvas.discardActiveGroup().renderAll();
    } else {
        canvas.remove(canvas.getActiveObject());
        canvas.discardActiveObject().renderAll();
    }
    if(canvases[canvas_pointer].type === 'grandstand'){
        addNumber();
    }
}
/**
 * 添加文字
 */
function addText() {
    let new_text = makeItext();
    let canvas = canvases[canvas_pointer].canvas;
    canvas.add(new_text);
}
function updateTextSettings(obj) {
    $('#fontFamily').val(obj.fontFamily);
    $('#text-fill').val(obj.fill);
    $('#fontSize').val(obj.fontSize);
    $('#textAlign').val(obj.textAlign);
}
$('#fontFamily').on('change',function () {
    let canvas = canvases[canvas_pointer].canvas;
    let obj = canvas.getActiveObject();
    if(obj&&obj.type==='i-text'){
        obj.set('fontFamily',this.value);
    }
    canvas.renderAll();
});
$('#fontSize').on('change',function () {
    let canvas = canvases[canvas_pointer].canvas;
    let obj = canvas.getActiveObject();
    if(obj&&obj.type==='i-text'){
        obj.set('fontSize',parseInt(this.value));
    }
    canvas.renderAll();
});
$('#text-fill').on('change',function () {
    let canvas = canvases[canvas_pointer].canvas;
    let obj = canvas.getActiveObject();
    if(obj&&obj.type==='i-text'){
        obj.set('fill',this.value);
    }
    canvas.renderAll();
});
$('#textAlign').on('change',function () {
    let canvas = canvases[canvas_pointer].canvas;
    let obj = canvas.getActiveObject();
    if(obj&&obj.type==='i-text'){
        obj.set('textAlign',this.value);
    }
    canvas.renderAll();
});

function submitVenue() {
    let layouts = [];
    layouts.push(canvases[0].canvas.toJSON());
    let seatid = 0;
    for(let i=1;i<canvases.length;i++){
//            console.log(canvases[i].canvas.toJSON());
        //todo 判断是否deleted，g_id与i相对应
        canvases[i].canvas.forEachObject(function (obj) {
            if(obj.type==='seat-rect'){
                seatid++;
                obj.set('seatid',seatid);
            }
        });
        layouts.push(canvases[i].canvas.toJSON());
    }
    layouts = JSON.stringify(layouts);
    // console.log(layouts);
    $.post("/api/venue/postLayouts",{
        "vid": getUrlParam("vid"),
        "layouts":layouts,
        "totalSeats":seatid,
    }).done(function () {
        layer.alert("注册信息提交成功，系统已为您生成注册码（"+getUrlParam("vid")+"）,请妥善保管注册码和密码，等待经理审核。您可以登陆检查审核状态",function (index) {
            layer.close(index);
            forward("/pages/venue/login.html");
        });
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}
function saveVenue() {
    let layouts = [];
    layouts.push(canvases[0].canvas.toJSON());
    let seatid = 0;
    for(let i=1;i<canvases.length;i++){
//            console.log(canvases[i].canvas.toJSON());
        //todo 判断是否deleted，g_id与i相对应
        canvases[i].canvas.forEachObject(function (obj) {
            if(obj.type==='seat-rect'){
                seatid++;
                obj.set('seatid',seatid);
            }
        });
        layouts.push(canvases[i].canvas.toJSON());
    }
    layouts = JSON.stringify(layouts);
    console.log(seatid);
    // console.log(layouts);
    $.post("/api/venue/postLayouts",{
        "vid": getUrlParam("vid"),
        "layouts":layouts,
    }).done(function (data) {
        layer.msg("保存成功");
    }).fail(function (data) {
        layer.msg(data.responseText);
    });
}