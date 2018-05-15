/**
 * Created by shea on 2018/2/14.
 */
let type_choices = [
    ['演唱会','流行','民族','摇滚','音乐节'],
    ['音乐会','声乐','古乐','独奏','管弦乐'],
    ['曲苑杂坛','戏曲','杂技','相声','马戏','魔术'],
    ['舞蹈','舞剧','舞蹈','芭蕾'],
    ['话剧歌剧','儿童剧','歌剧','歌舞剧','话剧','音乐剧'],
    ['体育比赛','冰雪','排球','搏击运动','格斗','球类运动','篮球','赛车','足球']
];
let type_filter =
    "<div id='type-wrapper' onmouseleave='hideTypeChoice()'>"+
        "<div id='type-container'>"+
            "<input id='type-input' placeholder='类型' onclick='showTypeChoice()'>"+
        "</div>"+
        "<div id='type-choice'></div>"+
    "</div>";
$("#type-part").append(type_filter);
type_choices.map(function (array,i) {
    let type_item =
        "<div class='type-item'>" +
            "<div class='type-title'>"+array[0]+"</div>"+
            "<div class='type-specific'></div>"+
        "</div>";
    $("#type-choice").append(type_item);
    array.map(function (type,j) {
        if(j===0)return;
        let type_dom = "<div onclick='wt(this)'>"+type+"</div>";
        $("#type-choice").children().eq(i).children().eq(1).append(type_dom);
    })
});
function wt(dom) {
    $("#type-input").val($(dom).html());
    hideTypeChoice();
}
function showTypeChoice() {
    $("#type-choice").css("display","block");
}

function hideTypeChoice() {
    $("#type-choice").css("display","none");
}



//发布活动中的类型选择
type_choices.map(function (array,i) {
    let opt_group =
        "<optgroup label='"+array[0]+"'></optgroup>";
    $("#activity-type").append(opt_group);
    array.map(function (type,j) {
        if(j===0)return;
        let type_dom = "<option value='"+type+"'>"+type+"</option>";
        $("#activity-type").children().eq(i+1).append(type_dom);
    })
});