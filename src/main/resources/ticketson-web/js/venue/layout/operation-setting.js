function updateSettings() {
    let obj = canvases[canvas_pointer].canvas.getActiveObject();
    if(obj){
        if(obj.type.split('-')[0]==='grandstand'){
            $('#grand-size').css('display','block');
            $('#line-size').css('display','none');
            $('#shape-left-number').val(obj.left);
            $('#shape-top-number').val(obj.top);
            $('#shape-width-number').val(obj.width);
            $('#shape-height-number').val(obj.height);
        }else if(obj.type === 'line'){
            $('#grand-size').css('display','none');
            $('#line-size').css('display','block');
            $('#shape-x1-number').val(obj.x1);
            $('#shape-x2-number').val(obj.x2);
            $('#shape-y1-number').val(obj.y1);
            $('#shape-y2-number').val(obj.y2);
        }else if(obj.type === 'i-text'){
            updateTextSettings(obj);
        }else {
            return;
        }
        $('#shape-scaleX-number').val(obj.scaleX);
        $('#shape-scaleX-range').val(obj.scaleX);
        $('#shape-angle-range').val(obj.angle);
        $('#shape-angle-number').val(obj.angle);
        $('#shape-opacity-number').val(obj.opacity);
        $('#shape-opacity-range').val(obj.opacity);
        $('#shape-stroke-color').val(obj.stroke);
        $('#shape-fill-color').val(obj.fill);
        $('#shape-skewX-range').val(obj.skewX);
        $('#shape-skewX-number').val(obj.skewX);
        $('#shape-skewY-range').val(obj.skewY);
        $('#shape-skewY-number').val(obj.skewY);
        $('#shape-strokeWidth-number').val(obj.strokeWidth);
        $('#shape-strokeWidth-range').val(obj.strokeWidth);
    }
}
function clearSettings() {
    $('#tool-options input').val('');
}
$('#tool-options input').on('input',function () {
    console.log('input');
    let canvas = canvases[canvas_pointer].canvas;
    let obj = canvas.getActiveObject();
    // if(!obj||obj.type.split('-')[0]!=='grandstand'||obj.type!=='line')return;
    const value_type = this.id.split('-')[2];
    const value_name = this.id.split('-')[1];
    let value = parseFloat(this.value);
    if(obj){
        if(obj.type==='i-text'||obj.type==='select-rect')return;
        console.log(value_name+"====="+value);
        if(value_type ==='color'){
            value = this.value;
            obj.set(value_name,value);
            if(value_name === 'fill'){
                obj.set('fill',value);
            }
        }else if(value_type === 'range') {
            obj.set(value_name,value);
            let range_dom = $('#shape-'+value_name+'-number');
            if(range_dom){
                range_dom.val(value);
            }
        }else if(value_type === 'number'){
            obj.set(value_name,value);
            let range_dom = $('#shape-'+value_name+'-range');
            if(range_dom){
                if(value>parseFloat(range_dom.attr('max'))) {
                    value = range_dom.attr('max');
                    $('#' + this.id).val(value);
                }
                range_dom.val(value);
            }
        }
        canvas.renderAll();
    }
});

$('#shape-flipX').on('click',function () {
    let canvas = canvases[canvas_pointer].canvas;
    let obj = canvas.getActiveObject();
    if(obj&&obj.type.split('-')[0]==='grandstand'){
        let flipX = !obj.flipX;

        obj.set('flipX',flipX);
    }
    canvas.renderAll();
});

$('#shape-flipY').on('click',function () {
    let canvas = canvases[canvas_pointer].canvas;
    let obj = canvas.getActiveObject();
    if(obj&&obj.type.split('-')[0]==='grandstand'){
        let flipY = !obj.flipY;
        obj.set('flipY',flipY);
    }
    canvas.renderAll();
});

