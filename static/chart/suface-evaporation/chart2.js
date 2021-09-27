var dom = document.getElementById("chart2");
var myChart2 = echarts.init(dom);

var ref = [];
var mod = [];

function setChart2(){
	height = 2500
	ref.length = 0
	mod.length = 0
	while(height>0){
	    height -= 25;
	    ref.push([-1.5 + 3*Math.random(), height]);
	    mod.push([-1.5 + 3*Math.random(), height]);
	}
	myChart2.setOption(option2);
}


option2 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    legend: {
        data: ['大气折射指数', '大气修正指数'],
        left: 10
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
        }
    },
    
    grid: [{
        left: '5%',
        width:'38%',
    }, {
        left: '55%',
        width: '38%',
    }],
    xAxis: [
        {
            name: 'dN/dz',
            type: 'value',
            boundaryGap: false,
            axisLine: {onZero: true},
            max:2,
            min:-2,
        },
        {
            gridIndex: 1,
            name: 'dM/dz',
            type: 'value',
            boundaryGap: false,
            axisLine: {onZero: true},
            max:2,
            min:-2,
        }
    ],
    yAxis: [
        {
            name: '高度(m)',
            type: 'value',
        },
        {
            gridIndex: 1,
            name: '高度(m)',
            type: 'value',
        }
    ],

    series: [
        {
            name: '大气折射指数',
            type: 'line',
            hoverAnimation: false,
            data:ref,
            itemStyle: {
            	normal:{
            		 color: '#00CED1'
            	}
            },
        },
        {
            name: '大气修正指数',
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            hoverAnimation: false,
            data:mod,
            itemStyle: {
            	normal:{
            		 color: '#CAFF70'
            	}
            },
        }
    ]
};;
