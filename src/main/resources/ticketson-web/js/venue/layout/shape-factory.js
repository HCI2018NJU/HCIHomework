/**
 * Created by shea on 2018/1/31.
 */
function makeRect(pointer) {
    return new fabric.GrandstandRect({
        left: pointer.x,
        top: pointer.y,
        strokeWidth: 1,
        stroke: 'black',
        fill: '#ffffff',
        origin_fill: '#ffffff',
        originX: 'left', originY: 'top',
        width: 5,
        height: 5,
        hasCanvas:false
    });
}

function makeSelectRect(pointer) {
    return new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        strokeWidth: 1,
        stroke: 'black',
        fill: '#ffffff',
        originX: 'left', originY: 'top',
        width: 5,
        height: 5,
        hasControls: false,
        strokeDashArray:[4,2]
    });
}

function makeTriangle(pointer) {
    return new fabric.GrandstandTriangle({
        left: pointer.x,
        top: pointer.y,
        strokeWidth: 1,
        stroke: 'black',
        fill: '#ffffff',
        origin_fill: '#ffffff',
        originX: 'left', originY: 'top',
        width: 5,
        height: 5,
        hasCanvas:false
    });
}

function makeEllipse(pointer) {
    return new fabric.GrandstandEllipse({
        left: pointer.x,
        top: pointer.y,
        strokeWidth: 1,
        stroke: 'black',
        fill: '#ffffff',
        origin_fill: '#ffffff',
        originX: 'left', originY: 'top',
        rx: 5,
        ry: 1,
        hasCanvas:false
    });
}

function makeLine(x1,y1,x2,y2,hasControls) {
    return new fabric.Line([x1,y1,x2,y2],{
        stroke: 'black',
        strokeWidth: 1,
        hasControls: hasControls,
        selectable: hasControls,
        hasBorders: hasControls
    });

}

function makePoly(poly_pointers) {
    return new fabric.GrandstandPolygon(poly_pointers,{
        stroke: 'black',
        strokeWidth: 1,
        fill: '#ffffff',
        origin_fill: '#ffffff',
        hasCanvas: false
    });
}

function makeSeat(pointer) {
    return new fabric.SeatRect({
        height: seat_edge_length,width:seat_edge_length,top:pointer.y,left:pointer.x,
        strokeWidth: 1, fill: '#fff', stroke: '#000', objectCaching: false
    });
}
function makeItext() {
    let itext =  new fabric.IText('Tap and Type', {
        left: 50,
        top: 100,
        fontFamily: 'optima',
        fill: '#9a9a9a',
        fontSize: 20
    });
    console.log(itext.toJSON());
    return itext;
}

function makeTooltipRect(pointer) {
    return  new fabric.Rect({
        left:pointer.x,
        top: pointer.y,
        width: tooltip_width,
        height: tooltip_height,
        strokeWidth: 1,
        fill: '#000000',
        stroke: '#000000',
        shadow: 'rgba(0,0,0,0.3) 6px 6px 12px'
    });
}

function makeTooltip(pointer,floor,grandstand,row,column) {
    let position_item = '楼层：'+floor+'\n\n看台：'+grandstand+'\n\n位置：'+row+'排'+column+'座';
    return new fabric.IText(position_item, {
        left: pointer.x+10,
        top: pointer.y+10,
        fontFamily: 'optima',
        fill: '#ffffff',
        fontSize: 12
    });
}
