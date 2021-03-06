const aid = getUrlParam("aid");
const pid = getUrlParam("pid");
const way = getUrlParam("way");



if(way==="online"){
    $("#venue-nav").css("display","none");
}else {
    $('#member-nav').css("display","none");
}
console.log(aid);
$.post("/api/activity/getLayouts",{
    "aid": aid,
}).done(function (data) {
    console.log(data);
    data.map(function (layout,index) {
        createCanvas(layout,index);
    });
}).fail(function (data) {
    console.log(data.responseText);
    layer.msg(data.responseText);
});



let canvases = [];
let canvas_pointer = 0;
let gs_tooltip = null;
let gs_tooltip_rect = null;
let gs_tooltip_width = 120;
let gs_tooltip_height = 100;
let area_name_single_width = 40;
let area_name_height = 60;


let seat_tooltip = null;
let seat_tooltip_rect = null;
let seat_tooltip_width = 120;
let seat_tooltip_height = 200;
let seat_size = 40;

let added_obj = [];

// const prices = window.localStorage.getItem("a_choose_seat_prices").split("_");
const prices = decodeURI(getUrlParam2("prices")).split("_");

//初始化标题
// let v_name = window.localStorage.getItem("v_name");
let v_name = decodeURI(getUrlParam2("vname"));
// let a_period = window.localStorage.getItem("a_period");
let a_period = decodeURI(getUrlParam2("aperiod"));
// let a_name = window.localStorage.getItem("a_name");
let a_name = decodeURI(getUrlParam2("aname"));

$("#chosen-color").css("background-color",chosen);
$("#unavailable-color").css("background-color",unavailable);
prices.map((price,idx)=>{
    if(idx===0){
        return;
    }
    const color = level[idx-1];
    const level_span = "<div style='display: inline'>" +
        "<label class='level-block' style='background-color:"+color+"'></label>"+
        "<label class='price-block'>¥"+price+"</label>"+
    "</div>";
    $("#level-part").append(level_span);
});
function findPriceColor(price) {
    for(let i=1;i<prices.length;i++){
        if(price===prices[i])return level[i-1];
    }
    return level[0];
}


// let hoverTimer = null;

let seats = [];

//初始化画布大小
let canvases_width = parseInt($("#canvases").css("width").substring(0,$("#canvases").css("width").length-2));
if(canvases_width>1120){
    let padding = (canvases_width-1080)/2;
    $("#canvases").css({
        "padding-left":padding+"px",
        "padding-right":padding+"px",
    })
}



$("#venue-header").css("display","block");
// $("#venue-header").text(v_name);
$("#activity-guide").text(a_name);
$("#period-guide").text(a_period);
$("#gs-header").css("display","none");

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
        if(obj.type.split('-')[0]==="grandstand"){
            initArea(obj);
            // if(obj.hasCanvas){
            //     console.log(obj);
            //     added_obj.push(makeGSTooltipRect({x:obj.left+(obj.width-gs_tooltip_width)/2,y:obj.top+(obj.height-gs_tooltip_height)/2}));
            //     added_obj.push(makeGSTooltip({x:obj.left+(obj.width-gs_tooltip_width)/2,y:obj.top+(obj.height-gs_tooltip_height)/2},obj));
            // }
        }
    });

    canvas.renderAll();
    canvas.on({
        'mouse:over':onMouseOver,
        'mouse:out': onMouseOut,
        'mouse:move': onMouseMove,
        'mouse:down':onSelectCreated,
    });
    if(index===0){
        added_obj.map(function (obj) {
            canvas.add(obj);
            obj.hasControls = false;
            obj.lockMovementX = true;
            obj.lockMovementY = true;
        });
        $("#"+canvas_wrapper_id).css({
            "display":"block"
        });
    }else {
        $("#"+canvas_wrapper_id).css({
            "display":"none"
        });
    }
    canvas.renderAll();
    canvases.push(canvas);
}


function initArea(obj) {
    if(obj.hasCanvas){
        obj.set("fill",findPriceColor(obj.highestPrice));
        obj.set("stroke",findPriceColor(obj.highestPrice));
        added_obj.push(makeGsName(obj));
        // added_obj.push(makeGSTooltip({x:obj.left+(obj.width-gs_tooltip_width)/2,y:obj.top+(obj.height-gs_tooltip_height)/2},obj));
    }
}

function makeGsName(obj) {
    let name = obj.name;
    let width = area_name_single_width*name.length;
    let height = area_name_height;
    console.log(name);
    return new fabric.IText(name, {
        left: obj.left+(obj.width-width)/2,
        top: obj.top+(obj.height-height)/2,
        fontFamily: 'optima',
        // fill: '#333333',
        fill: '#ffffff',
        fontSize: 36
    });
}

function onMouseOver(event) {
    let obj = event.target;
    if(obj){
        if(obj.type!==null){
            let canvas = canvases[canvas_pointer];
            if(obj.type==='seat-rect'){
                let pointer = canvas.getPointer();
                obj.setShadow({ color: 'rgba(0,0,0,0.7)',blur: 10 });
                showTooltip(obj,canvas,pointer);
                // checkSeatState(obj,canvas,pointer);

                // hoverTimer = window.setTimeout(function () {
                //     checkSeatState(obj,canvas,pointer);
                // },200);
                // checkSeatState(obj);
            }else if(obj.type.split('-')[0] === 'grandstand'){
                obj.setShadow({ color: 'rgba(0,0,0,0.7)',blur: 10 });
                showGSTooltip(obj);
                canvas.renderAll();
            }
        }

    }
}
function onMouseOut(event) {
    // clearTimeout(hoverTimer);
    // hoverTimer = -1;
    let obj = event.target;
    if(obj){
        if(obj.type!==null){
            let canvas = canvases[canvas_pointer];
            if(obj.type === 'seat-rect'){
                obj.setShadow({ color: 'rgba(0,0,0,0.0)',blur: 0 });
                hideToolTip();
            }else if(obj.type.split('-')[0]==='grandstand'){
                obj.setShadow({ color: 'rgba(0,0,0,0.0)',blur: 0 });
                hideGsToolTip();
                canvas.renderAll();
            }
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
        if(obj.type!==null){
            if(obj && obj.type.split('-')[0] === 'grandstand'){
                //如果该图形已经被设置为看台，即已经建立了画布，则直接显示信息
                if(obj.hasCanvas) {
                    hideGsToolTip();
                    changeCanvasPointer(obj.g_id);
                }
            }else if(obj.type === 'seat-rect'){
                addToChart(obj);
            }
        }
    }

}

//将选择的座位添加进购物车
function addToChart(obj) {
    hideToolTip();
    if(obj.state==="不可售"){
        layer.msg("该座位已经被抢走了");
        return;
    }
    if($("#ticket-part").find("#"+obj.seatid).length>0){
        //从购物车之中删除
        removeFromChart(obj);
    }else {
        if($("#ticket-part").find('.ticket-item').length>=5){
            layer.msg("您最多只可一次购买五张票");
            return;
        }
        //将所选座位加进购物车
        let dom =
            "<div class='ticket-item' id='"+obj.seatid+"' price-fill='"+obj.fill+"'>"+
            "<div style='overflow: auto'><i class='delete'>&#xe610;</i> </div>"+
            "<div class='seat-wrapper'>" +
            "<div><i class='seat' style='color: "+obj.fill+"'>&#xe63a;</i></div>" +
            "<div class='seat-price' style='color: "+obj.fill+"'>¥<span>"+obj.price+"</span></div>" +
            "</div>"+
            "<div class='seat-info'>" +
            "<div>座号：<span class='seat-location'>"+obj.row+"排"+obj.column+"座"+"</span></div>"+
            "<div>区域：<span class='gs'>"+obj.area+"</span></div>"+
            "<div>楼层：<span class='floor'>"+obj.floor+"</span></div>"+
            "</div>"+
            "</div>";
        $("#ticket-part").append(dom);
        $("#"+obj.seatid).find(".delete").on('click',function () {
            removeFromChart(obj);
        });
        obj.set('state','已选择');
        obj.set('fill',chosen);
        obj.set('stroke',chosen);
        canvases[canvas_pointer].renderAll();
        //计算总票数
        $("#total-seats").text(parseInt($("#total-seats").text())+1);
        //计算总价格
        let totalPrice = parseFloat($("#total-price").text());
        totalPrice = totalPrice + parseFloat(obj.price);
        $("#total-price").text(totalPrice);
        //判断是否要将按钮设为可点
        if($("#ticket-part").find('.ticket-item').length===0){
            $("#orderTicktets").css({
                "cursor":"not-allowed",
                "opacity":0.2
            });
        }else {
            $("#orderTicktets").css({
                "cursor":"pointer",
                "opacity":1
            });
        }
        // $.post("/api/subscribe/orderSeat",{
        //     "pid":pid,
        //     "layout_sid":obj.seatid,
        // }).done(function (data) {
        //
        // }).fail(function (data) {
        //     layer.msg(data.responseText);
        // });
    }
}
//从购物车删除座位
function removeFromChart(obj) {
    let seatid = obj.seatid;
    obj.set('state','可售');
    let fill = $("#"+seatid).attr('price-fill');
    obj.set('fill',fill);
    obj.set('stroke',fill);
    canvases[canvas_pointer].renderAll();
    let price = $("#"+seatid).find('.seat-price span').text();
    $("#"+seatid).remove();
    //计算总票数
    $("#total-seats").text(parseInt($("#total-seats").text())-1);
    //计算总价格
    let totalPrice = parseFloat($("#total-price").text());
    console.log(totalPrice);
    console.log(parseFloat(price));
    totalPrice = totalPrice - parseFloat(price);
    $("#total-price").text(totalPrice);
    //判断是否要将按钮设为不可点
    if($("#ticket-part").find('.ticket-item').length===0){
        $("#orderTicktets").css({
            "cursor":"not-allowed",
            "opacity":0.2
        });
    }else {
        $("#orderTicktets").css({
            "cursor":"pointer",
            "opacity":1
        });
    }

}

function showTooltip(obj,canvas,pointer) {
    // let canvas = canvases[canvas_pointer];
    // let pointer = canvas.getPointer();
    if(canvas_pointer===0)return;
    hideToolTip();
    hideGsToolTip();
    canvas.discardActiveObject();
    canvas.discardActiveGroup();
    canvas.renderAll();
    console.log("after:"+pointer.x+"-----"+pointer.y);
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
    seat_tooltip = makeTooltip({x:x,y:y},obj);
    canvas.add(seat_tooltip);
    canvas.renderAll();
}

function hideToolTip() {
    let canvas = canvases[canvas_pointer];
    if(seat_tooltip){
        canvas.remove(seat_tooltip);
        canvas.remove(seat_tooltip_rect);
        canvas.renderAll();
        seat_tooltip = null;
        seat_tooltip_rect = null;
    }
}

function showGSTooltip(obj) {
    if(canvas_pointer!==0)return;
    hideGsToolTip();
    hideToolTip();
    let canvas = canvases[canvas_pointer];
    let pointer = canvas.getPointer();
    canvas.discardActiveObject();
    canvas.discardActiveGroup();
    canvas.renderAll();
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
    gs_tooltip = makeGSTooltip({x:x,y:y},obj);
    canvas.add(gs_tooltip);
    canvas.renderAll();
}

function hideGsToolTip() {
    let canvas = canvases[canvas_pointer];
    if(gs_tooltip){
        canvas.remove(gs_tooltip);
        canvas.remove(gs_tooltip_rect);
    }
    gs_tooltip = null;
    gs_tooltip_rect = null;
    canvas.renderAll();
}

function moveGSTooltip() {
    let canvas = canvases[canvas_pointer];
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
    // return  new fabric.Rect({
    //     left:pointer.x,
    //     top: pointer.y,
    //     width: gs_tooltip_width,
    //     height: gs_tooltip_height,
    //     strokeWidth: 1,
    //     fill: '#ffffff',
    //     stroke: '#ffffff',
    //     // shadow: 'rgba(0,0,0,0.3) 6px 6px 12px'
    // });
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

function makeGSTooltip(pointer,obj) {
    let position_item = '楼层：'+obj.floor+'\n\n看台：'+obj.name+'\n\n价格：'+obj.lowestPrice+"~"+obj.highestPrice;
    if(obj.lowestPrice===obj.highestPrice){
        position_item = '楼层：'+obj.floor+'\n\n看台：'+obj.name+'\n\n价格：'+obj.lowestPrice;
    }
    return new fabric.IText(position_item, {
        left: pointer.x+10,
        top: pointer.y+10,
        fontFamily: 'optima',
        // fill: '#333333',
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

function makeTooltip(pointer,obj) {
    let position_item = '楼层：'+obj.floor+'\n\n看台：'+obj.area+'\n\n位置：'+obj.row+'排'+obj.column+'座'+'\n\n等级：'+obj.level+'\n\n价格：'+obj.price+'\n\n状态：'+obj.state;
    return new fabric.IText(position_item, {
        left: pointer.x+10,
        top: pointer.y+10,
        fontFamily: 'optima',
        fill: '#ffffff',
        fontSize: 12
    });
}

//显示指定的画布
function changeCanvasPointer(to) {
    hideToolTip();
    hideGsToolTip();


    canvases[canvas_pointer].discardActiveObject();
    if(to===0){
        $("#venue-header").css("display","block");
        $("#gs-header").css("display","none");
        $("#gs-wrapper-"+canvas_pointer).css("display","none");
        canvas_pointer = to;
        $("#gs-wrapper-"+canvas_pointer).css("display","block");
        $(".color-part").css({
            "display":"none"
        });
    }else {
        $(".color-part").css({
            "display":"block"
        });
        const loading_index = layer.load();
        $("#venue-header").css("display","none");
        $("#gs-header").css("display","block");
        //将不可售的座位设为灰色
        let seats = {};
        let seatids = [];
        canvases[to].forEachObject(function (obj) {
            if(obj.type==='seat-rect'&&obj.state!=='已选择'){
                seats[obj.seatid] = obj;
                seatids.push(obj.seatid);
            }
        });
        $.post("/api/subscribe/isAllAvailable",{
            "pid":pid,
            "layout_sids":JSON.stringify(seatids),
        }).done(function (data) {
            let results = data;
            for(let result in results){
                if(results.hasOwnProperty(result)){
                    const isAvailable = results[result];
                    console.log(isAvailable);
                    if(seats.hasOwnProperty(result)){
                        let obj = seats[result];
                        setSeatState(obj,isAvailable);
                    }
                }
            }
            canvases[to].renderAll();
            hideGsToolTip();
            layer.close(loading_index);
            $("#gs-wrapper-"+canvas_pointer).css("display","none");
            canvas_pointer = to;
            $("#gs-wrapper-"+canvas_pointer).css("display","block");
        }).fail(function (data) {
            layer.msg(data.responseText);
        });
    }
}

function setSeatState(obj,isAvailable) {
    if(!isAvailable){
        obj.set('fill',unavailable);
        obj.set('stroke',unavailable);
        // obj.set('opacity','0.1');
        obj.set('state','不可售');
    }else {
        // obj.set("stroke",obj.fill);
        obj.set("stroke",obj.origin_fill);
        // obj.set('fill',obj.fill);
        obj.set('fill',obj.origin_fill);
        obj.set('state','可售');
    }
}

//提交订单
function submitOrder() {
    const totalAmount = parseInt($("#total-seats").text());
    if(totalAmount===0)return;
    let prices = "";
    let layout_sids = [];
    //封装订单信息
    $("#ticket-part .ticket-item").each(function () {
        const layout_sid = $(this).attr("id");
        layout_sids.push(layout_sid);
        prices = `${prices},${$(this).find(".seat-price").text()}`;
    });

    //线下购票
    if(way==="offline"){
        layer.open({
            "title":"输入会员账号",
            "content":"<input id='member-email-input' type='email'>",
            yes:function (index,dom) {
                let email = $("#member-email-input").val();
                if(email===""){
                    email = null;
                }
                const loading_index = layer.load();
                $.post("/api/subscribe/offlinePurchase",{
                    "layoutSids":JSON.stringify(layout_sids),
                    "email":email,
                    "pid":pid,
                    "totalAmount":totalAmount,
                    "prices":prices.substring(1),
                    "totalPrice":parseFloat($("#total-price").text()),
                }).done(function (data) {
                    layer.close(loading_index);
                    layer.alert(`现场购票成功,实付金额${data.toFixed(2)}`,function (index) {
                        layer.close(index);
                        forward("/pages/venue/activity/choose-seat.html?way=offline&aid="+getUrlParam("aid")+"&pid="+getUrlParam("pid"));
                    });
                }).fail(function (data) {
                    layer.close(loading_index);
                    if(data.responseText==="晚了一步，部分座位已被抢走"){
                        layer.alert(data.responseText,function (index) {
                            layer.close(index);
                            forward("/pages/venue/activity/choose-seat.html?way=offline&aid="+getUrlParam("aid")+"&pid="+getUrlParam("pid"));
                        });
                    }else {
                        layer.msg(data.responseText);
                    }
                })
            }
        });

    //线上购票
    }else if(way==="online"){
        const loading_index = layer.load();
        $.post("/api/subscribe/seatPurchase",{
            "layoutSids":JSON.stringify(layout_sids),
            "mid":getMid(),
            "pid":pid,
            "totalAmount":totalAmount,
            "prices":prices.substring(1),
            "totalPrice":parseFloat($("#total-price").text()),
        }).done(function (data) {
            layer.close(loading_index);
            forward(`/pages/venue/activity/confirm-order.html?oid=${data}`);
        }).fail(function (data) {
            layer.close(loading_index);
            if(data.responseText==="晚了一步，部分座位已被抢走"){
                layer.alert(data.responseText,function (index) {
                    layer.close(index);
                    forward("/pages/venue/activity/choose-seat.html?way=offline&aid="+getUrlParam("aid")+"&pid="+getUrlParam("pid"));
                });
            }else {
                layer.msg(data.responseText);
            }
        });
    }

}

$(".give-up").on('click',function () {
    forward(`/pages/venue/activity/activity-info.html?aid=${aid}`);
});

$("#activity-guide").on('click',function () {
    forward(`/pages/venue/activity/activity-info.html?aid=${aid}`);
});
$("#period-guide").on('click',function () {
    forward(`/pages/venue/activity/activity-info.html?aid=${aid}`);
});


