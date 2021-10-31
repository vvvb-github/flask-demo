
// 蒸发波导折线图 line_data
let Chart_line = echarts.init(document.getElementById('echarts-line'));


function count(o){
	var t = typeof o;
	if(t == 'string'){
		return o.length;
	}else if(t == 'object'){
		var n = 0;
		for(var i in o){
			n++;
		}
		return n;
	}
	return false;
}

// 所有信息
// var chart_data = {}

// 蒸发波导信息，时间、波导高度
// time
// altitude

// 波导高度信息，（蒸发、表面、悬空）波导底高，波导高度 （底高+高度=顶高）
// bottom
// altitude

// HPC、TPC（保留项）
// altitude、humidity、time
// altitude、temperature、time

// function setoption(timeData){
// 	Chart_one.showLoading();
// 	Chart_two.showLoading();
// 	Chart_one.setOption(option);
// 	Chart_one.hideLoading();
// 	Chart_two.setOption(option2);
// 	Chart_two.hideLoading();
// }
option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    legend: {
        data: ['蒸发波导高度'],
        left: 10
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none',
            },
            dataView: {
                readOnly: true,
                optionToContent: function(opt) {
                    let axisData = opt.xAxis[0].data;
                    let seriesData = opt.series[0].data;
                    let table = '<table style="width:100%; text-align:center"><tbody><tr>' +
                                '<td>时间</td><td>蒸发波导高度</td>' +
                                '</tr>';
                    for (let i=0, l=axisData.length; i<l; i++) {
                        table += '<tr>' +
                                 '<td>' + axisData[i] + '</td>' +
                                 '<td>' + seriesData[i] + '</td>' +
                                 '</tr>';
                    }
                    table += '</tbody></table>';
                    return table;
                }
            },
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
        }
    },
    axisPointer: {
        link: {xAxisIndex: 'all'}
    },
    dataZoom: [
        {
            show: true,
            realtime: true,
            start: 80,
            end: 100
        }
    ],
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            axisLine: {onZero: true},
            data: chart_data.line_data.time
        }
    ],
    yAxis: [
        {
            name: '高度(m)',
            type: 'value'
        }
    ],
    series: [
        {
            name: '蒸发波导高度',
            type: 'line',
            symbolSize: 8,
			itemStyle: {
            	normal:{
            		 color: '#FF8247'
            	}
            },
			markPoint: {
			    data: [
			        {type: 'max', name: '最大值'},
			        {type: 'min', name: '最小值'}
			    ]
			},
			markLine: {
			    data: [
			        {type: 'average', name: '平均值'}
			    ]
			},
            hoverAnimation: false,
            data: chart_data.line_data.altitude
        }
    ]
};

Chart_line.setOption(option)







