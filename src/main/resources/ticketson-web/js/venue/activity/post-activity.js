let form;
layui.use(['form', 'layedit', 'laydate'], function(){
    let laydate = layui.laydate;
    form = layui.form;

    laydate.render({
        elem: '#period-input',
        type: 'datetime',
        range: true,
        calendar: true,
        theme: '#49bab5',
        done: function(value, date){
            let period_dom = "<label class='period-label'>"+value+"</label>";
            $("#period-part").append(period_dom);
            $("#period-input").val("");
            $("#period-create").css("display","inline-block");
            $("#period-input").css("display","none");
            // alert('你选择的日期是：' + value + '\n获得的对象是' + JSON.stringify(date));
        }
    });

    //监听提交
    form.on('submit(post-activity-info)', function(data){
        let field = data.field;
        console.log(field);
        let vid = window.localStorage.getItem("vid");
        let name = field.name;
        let type = field.type;
        let description = field.description;
        let periods = [];
        $("#period-part>label").each(function () {
            periods.push($(this).text());
        });
        let levelPrices = [];
        let prices = '';
        $("#price-part .level-item").each(function () {
            levelPrices.push($(this).children().eq(2).text());
            prices = prices+"_"+$(this).children().eq(2).text();
        });

        $.post("/api/activity/postInfo",{
            "vid":vid,
            "name":name,
            "type":type,
            "description":description,
            "periods":JSON.stringify(periods),
            "url":window.localStorage.getItem("url"),//上传图片之后将图片url保存在localstorage中
            "prices":prices,
        }).done(function (data) {
            console.log(data);
            setLevels(levelPrices,field.level);
            setActivity(data);
            forward("/pages/venue/activity/activity-layout.html");
        }).fail(function (data) {
            layer.msg(data.responseText);
        });
    });
});

function showPeriodInput() {
    $("#period-create").css("display","none");
    $("#period-input").css("display","inline-block");
}

let level_color_pointer = 0;

function showPriceInput() {
    let level_text = (level_color_pointer+1)+"级";
    $("#level-item-input .level-label").text(level_text);
    $("#level-item-input .color-label").css({
        "background-color": level[level_color_pointer],
    });
    $("#level-create").css("display","none");
    $("#level-item-input").css("display","inline-block");
}

function onPriceInputEnter() {
    let e = event || window.event;
    if(e.keyCode === 13){
        finishAddLevel();
    }
}

function finishAddLevel() {
    let price = $("#price-input").val();
    $("#price-input").val("");
    let level_text =  (level_color_pointer+1)+"级";
    let level_color = level[level_color_pointer];
    level_color_pointer++;
    let level_dom =
        "<div class='level-item'>" +
            "<label class='level-label'>"+level_text+"</label>"+
            "<label class='color-label' style='background-color: "+level_color+"'></label>"+
            "<label class='level-label'>"+price+"</label>"+
        "</div>";
    $("#price-part").append(level_dom);
    let level_option = "<option value='"+level_text+"'>"+level_text+"</option>";
    $("#level-type").append(level_option);
    $("#level-create").css("display","inline-block");
    $("#level-item-input").css("display","none");
    form.render('select');

}

function select_level(dom) {
    console.log($(dom).attr('my-value'));
    $("#level-type").parent().find('.layui-select-title>input').attr("value",$(dom).attr('my-value'));
}

layui.use('upload', function(){
    let $ = layui.jquery,
        upload = layui.upload;
    //普通图片上传
    let uploadInst = upload.render({
        elem: '#post-pic',
        url: '/api/activity/postPhoto',
        data: {"vid":window.localStorage.getItem("vid")},
        before: function (obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#activity-pic').attr('src', result);//图片链接（base64）
                $('#activity-pic').css('display','block');
            });
        },
        done: function (res) {
            console.log(res);
            window.localStorage.setItem("url",res["url"]);
        },
        error: function (data) {
            layer.msg(data.responseText);
            //演示失败状态，并实现重传
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <button class="layui-btn">重试</button>');
            demoText.find('.demo-reload').on('click', function () {
                uploadInst.upload();
            });
        }
    });
});