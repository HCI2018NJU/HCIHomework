// 基于准备好的dom，初始化echarts实例
const financeLineChart = echarts.init(document.getElementById("finance-line-chart"));
const financeOrderTypePieChart = echarts.init(document.getElementById("finance-order-type-pie-chart"));
const financeTypePieChart = echarts.init(document.getElementById("finance-type-pie-chart"));


function setData(data) {

    const typeData = data.typeData.map(function(obj,index){
        return {name: obj.name, value: obj.value.toFixed(2)}
    });
    const trendData = data.trendData.map(function (obj) {
        return obj.toFixed(2);
    });

    //设置top3
    const background_color = ["#ff2432","#ff8627","#f5c026"];
    data.top3.map(function (activity,index) {
        const level = index+1;
        let dom =
            "<div style='margin-top: 20px'>" +
            "<span style='background-color: "+background_color[index]+";border-radius: 50%;color: white;padding: 4px;margin-right: 4px'>"+level+"</span>"+
            "<span>"+activity.name+"</span>"+
            "<span style='float: right'>¥"+activity.earn.toFixed(2)+"</span>"+
            "</div>";
        $("#top3-content").append(dom);
    });
    //以下设置图表
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
            name: '预订金额',
            type: 'line',
            data: trendData,
        }]
    };

    const typeOption = {
        title:{
            text:'| 收入类型',
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
                radius: ['30%', '70%'],
                center: ['50%', '50%'],
                data:typeData,
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

    const orderTypeOption = {
        title: {
            text: '| 订单类型',
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {},
        series: [{
            name: '类型',
            type: 'pie',
            radius : '55%',
            center: ['40%', '50%'],
            data: data.subscribeData,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };


// 使用刚指定的配置项和数据显示图表。
    financeLineChart.setOption(option);
    financeOrderTypePieChart.setOption(orderTypeOption);
    financeTypePieChart.setOption(typeOption);
}

function toFinanceTable() {
    forward("/pages/venue/finance-table.html");
}
