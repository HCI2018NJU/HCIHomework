// 基于准备好的dom，初始化echarts实例
const memberLevelPieChart = echarts.init(document.getElementById("member-level-pie-chart"));
const venuePassPieChart = echarts.init(document.getElementById("venue-pass-pie-chart"));
const financeLineChart = echarts.init(document.getElementById("finance-line-chart"));


function setData(data) {
    const trendSubscribeData = data.trendSubscribeData.map(function(obj,index){
        return obj.toFixed(2);
    });
    const trendUnsubscribeData = data.trendUnsubscribeData.map(function (obj) {
        return obj.toFixed(2);
    });

    console.log(data.memberLevelData);

    const option = {
        title: {
            text: '| 收入走势',
            // x:'center'
        },
        tooltip: {},
        legend: {},
        xAxis: {
            data: data.months
        },
        yAxis: {},
        series: [{
            name: '预订手续费',
            type: 'line',
            data: trendSubscribeData
        },
            {
                name: '退订手续费',
                type: 'line',
                data: trendUnsubscribeData
            },
            ]
    };
    const memberLevelOption = {
        title:{
            text:'| 用户注册',
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            x : 'center',
            y : 'bottom',
        },
        series:[
            {
                name: '类型',
                type:'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data:data.memberLevelData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    const venuePassOption = {
        title:{
            text:'| 场馆注册',
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            x : 'center',
            y : 'bottom',
        },
        series:[
            {
                name: '类型',
                type:'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data:data.venueRegisterData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    memberLevelPieChart.setOption(memberLevelOption);
    venuePassPieChart.setOption(venuePassOption);
    financeLineChart.setOption(option);

}

