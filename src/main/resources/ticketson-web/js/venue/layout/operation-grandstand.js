/**
 * 看台设置的操作
 */


/**
 * ==================grandstand======================
 */
/**
 * 显示当前被选中的看台信息
 * @param obj 当前被选中的看台
 */
function showGrandstandInfos(obj) {
    $('#grandstand-value').text(obj.name);
    $('#floor-value').text(obj.floor);
    $('#grandstand-width-value').text(obj.g_width);
    $('#grandstand-height-value').text(obj.g_height);
    $('#grand-infos').css('display','block');
    $('#grand-options').css('display','none');
}
function hideGrandstandInfos() {
    $('#grandstand-value').text('');
    $('#floor-value').text('');
    $('#grandstand-width-value').text('');
    $('#grandstand-height-value').text('');
    $('#grand-infos').css('display','none');
}
/**
 * 选择一个图形之后显示grand-options
 */
function showGrandOptions() {
    $('#grand-options').css('display','block');
    $('#grand-infos').css('display','none');
}
/**
 * 取消选择之后清空输入框
 */
function hideGrandOptions() {
    $('#grand-options input').val('');
    $('#grand-options').css('display','none');
    canvases[0].canvas.discardActiveObject();
    canvases[0].canvas.renderAll();
}
/**
 * change floor-select to floor-input
 */
function addFloor() {
    $('#floor-select').css('display','none');
    $('#floor-input').css('display','inline');
    $('#add-floor').css('display','none');
    $('#floor-input').focus();
}
/**
 * change floor-input to floor-select
 */
function showSelect() {
    $('#floor-select').css('display','inline');
    $('#floor-input').css('display','none');
    $('#add-floor').css('display','inline');
}
function onAddFloorEnter(event) {
    let e = event || window.event;
    if(e.keyCode === 13){
        finishAddFloor();
    }
}
/**
 * 添加楼层
 */
function finishAddFloor() {
    let floor_name = $('#floor-input').val();
    if(floor_name !== '' && $.inArray(floor_name,floor_names)<0){
        floor_names.push(floor_name);
        createFloorNav(floor_name);
        let new_floor_option =
            "<option value='"+floor_name+"'>"+floor_name+"</option>";
        $('#floor-select').append(new_floor_option);
        $("#floor-select").val(floor_name);
        $('#floor-input').val('');
    }
    showSelect();
}
/**
 * 保存看台信息，建立看台平面图画布，并跳转到指定看台界面
 */
function createNewGrandstand() {
    let g_id = saveGrandstand();
    if(g_id === -1)return;
    showGrandstand(g_id);
}
/**
 * 保存看台信息，建立看台平面图画布，不跳转到指定看台界面，
 * 在此过程中生成g_id，并返回
 * 如果过程中有警告则返回-1
 */
function saveGrandstand() {
    //获取值
    const floor_name = $('#floor-select').val();
    const grandstand_name = $('#grandstand-input').val();
    // const width_input = $('#grandstand-width').val();
    // const height_input = $('#grandstand-height').val();
    //检查是否有输入为空
    if(floor_name===''||grandstand_name===''){
        alert("您有尚未输入的选项");
        $('#grand-options input').val('');
        return -1;
    }
    //判断重复
    for (let i=0;i<canvases.length;i++){
        if(canvases[i].name === grandstand_name && !canvases[i].deleted){
            alert("看台名称不可以重复");
            $('#grand-options input').val('');
            return -1;
        }
    }
    let g_id = canvases.length;
    let canvas = initGS(g_id);
    canvases.push({type:'grandstand',canvas:canvas,name:grandstand_name,floor_name:floor_name,deleted: false});
    //给该画布添加事件监听
    addListener(g_id);
    //把看台信息保存到相应的图形中
    putGsInfoToShape(floor_name,grandstand_name,g_id,true);
    //创建看台导航
    createGrandStandNav(floor_name,grandstand_name,g_id);
    //取消选择
    let present_canvas = canvases[canvas_pointer].canvas;
    present_canvas.discardActiveObject();
    present_canvas.renderAll();
    return g_id;
}
/**
 * 把看台信息保存到图像中
 */
function putGsInfoToShape(floor_name,grandstand_name,g_id,hasCanvas) {
    let canvas = canvases[canvas_pointer].canvas;
    let obj = canvas.getActiveObject();
    obj.set('floor',floor_name);
    obj.set('name',grandstand_name);
    obj.set('g_id',g_id);
    // obj.set('g_width',g_width);
    // obj.set('g_height',g_height);
    obj.set('hasCanvas',hasCanvas);
}

