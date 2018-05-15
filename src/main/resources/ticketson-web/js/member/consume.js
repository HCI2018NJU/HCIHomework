// 基于准备好的dom，初始化echarts实例
const consumeLineChart = echarts.init(document.getElementById("consume-line-chart"));
const consumeOrderTypePieChart = echarts.init(document.getElementById("consume-order-type-pie-chart"));
const consumeTypePieChart = echarts.init(document.getElementById("consume-type-pie-chart"));



function setData(data) {
    const typeData = data.typeData.map(function(obj,index){
        return {name: obj.name, value: obj.value.toFixed(2)}
    });
    const trendData = data.trendData.map(function (obj) {
        return obj.toFixed(2);
    });

    //设置top3
    const background_color = ["#ff2432","#ff8627","#f5c026"];
    data.top3.map(function (order,index) {
        const level = index+1;
        let dom =
            "<div style='margin-top: 20px'>" +
                "<span style='background-color: "+background_color[index]+";border-radius: 50%;color: white;padding: 4px;margin-right: 4px'>"+level+"</span>"+
                "<span>"+order.aName+"</span>"+
                "<span style='float: right'>¥"+order.payPrice.toFixed(2)+"("+order.totalAmount+"张)</span>"+
            "</div>";
        $("#top3-content").append(dom);
    });
    //以下设置图表
    const option = {
        title: {
            text: '| 消费走势',
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
            text:'| 消费类型',
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
    consumeLineChart.setOption(option);
    consumeOrderTypePieChart.setOption(orderTypeOption);
    consumeTypePieChart.setOption(typeOption);


}




function test1() {
    consumeTypePieChart.setOption(orderTypeOption);
}