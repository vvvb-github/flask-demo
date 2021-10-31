
// 波导高度柱形图 bar_data
let Chart_bar = echarts.init(document.getElementById('echarts-bar'));
// 电磁波损耗计算图
let Chart_radar = echarts.init(document.getElementById('echarts-radar'));
// 雷达损耗计算图
let Chart_ele = echarts.init(document.getElementById('echarts-ele'))

let radar_data = [];
let elec_min = 0;
let elec_max = 200;

function initial_radar() {
    if (chart_data.ele_data == null) return;
    elec_min = chart_data.ele_data[0][2];
    elec_max = chart_data.ele_data[0][2];
	if(radar_cost>0){
		for(i=0;i<200;i++){
			for(j=0;j<200;j++){
			    if (elec_min > chart_data.ele_data[i*200+j][2]) elec_min = chart_data.ele_data[i*200+j][2];
			    if (elec_max < chart_data.ele_data[i*200+j][2]) elec_max = chart_data.ele_data[i*200+j][2];
			    radar_data.push([chart_data.ele_data[i*200+j][0], chart_data.ele_data[i*200+j][1], chart_data.ele_data[i*200+j][2]]);
				if(chart_data.ele_data[i*200+j][2] > radar_cost) radar_data[i*200+j][2] = 1;
				else radar_data[i*200+j][2] = 0;
			}
		}
	}
	else{
		for(i=0;i<200;i++){
			for(j=0;j<200;j++){
			    radar_data.push([elec_data[i*200+j][0], elec_data[i*200+j][1], elec_data[i*200+j][2]]);
				radar_data[i*200+j][2] = 0;
			}
		}
	}
}

initial_radar();


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

option5 = {
    dataZoom:[
        {
            show: true,
            realtime: true,
            height:13,
            type: 'slider',
            xAxisIndex:0,
            handleStyle: {
            color: '#8A2BE2',
        }
        },
        {
            show: true,
            realtime: true,
            width:13,
            type: 'slider',
            yAxisIndex:0,
            left:'3%',
            handleStyle: {
            color: '#8A2BE2',
        }
        },
        {
            type: 'inside',
            xAxisIndex:0,
        },
        {
            type: 'inside',
            yAxisIndex:0,
        }
    ],
    tooltip: {
        formatter: function (params) {
            let res = function () {
                if (params.data[2]) return "有";
                return "无";
            };
            return (
                '高度(m)：'  + params.data[0] +
                '<br/>距离(km)： ' + params.data[1] +
                '<br/>有无增益效果：' + res()
            );
        }
    },
    toolbox:{
        show:true,
        itemSize:16,
        //showTitle:True,
        feature:{
            dataView:{
                readOnly: true,
                optionToContent: function(opt) {
                    var seriesData = opt.series[0].data;
                    var table = '<table style="width:100%; text-align:center"><tbody><tr>' +
                                '<td>高度(m)</td><td>距离(km)</td><td>有无增益</td>' +
                                '</tr>';
                    for (var i=0, l=seriesData.length; i<l; i++) {
                        let res = function () {
                            if (seriesData[i][2]) return "有";
                            return "无";
                        };
                        table += '<tr>' +
                                 '<td>' + seriesData[i][0] + '</td>' +
                                 '<td>' + seriesData[i][1] + '</td>' +
                                 '<td>' + res() + '</td>' +
                                 '</tr>';
                    }
                    table += '</tbody></table>';
                    return table;
                }
            },
            restore: {},
            saveAsImage: {},
            dataZoom: {},
        },
        left:'center'
    },
    xAxis: {
        type: 'category',
        //data: xData,
        name:'距离/km',
        nameLocation:'center',
        nameTextStyle:{
            padding:10,
            fontSize:16,
        }
    },
    yAxis: {
        type: 'category',
        //data: yData,
        name:'高度/m',
        nameLocation:'center',
        nameTextStyle:{
            padding:20,
            fontSize:16,
        }
    },
    visualMap: {
        min: 0,
        max: 1,
        calculable: true,
        realtime: false,
		right:'2%',
        bottom:'3%',
        inRange: {
            color: ['#1C1C1C', '#363636', '#4F4F4F', '#696969', '#828282', '#9C9C9C', '#B5B5B5', '#CFCFCF', '#E8E8E8']
        }
    },
    series: {
        name: '雷达传输增益',
        type: 'heatmap',
        data: radar_data,
        emphasis: {
            itemStyle: {
                borderColor: '#333',
                borderWidth: 1
            }
        },
        progressive: 1000,
        animation: false
    }
};

Chart_radar.setOption(option5)
console.log(Chart_radar)

option6 = {
    dataZoom:[
        {
            show: true,
            realtime: true,
            height:13,
            type: 'slider',
            xAxisIndex:0,
            handleStyle: {
                color: '#8A2BE2',
            }
        },
        {
            show: true,
            realtime: true,
            width:13,
            type: 'slider',
            yAxisIndex:0,
            left:'3%',
            handleStyle: {
            color: '#8A2BE2',
        }
        },
        {
            type: 'inside',
            xAxisIndex:0,
        },
        {
            type: 'inside',
            yAxisIndex:0,
        }
    ],
    tooltip: {
        formatter: function (params) {
            return (
                '高度(m)：'  + params.data[0] +
                '<br/>距离(km)： ' + params.data[1] +
                '<br/>电磁波损失(dB)：' + params.data[2]
            );
        }
    },
    toolbox:{
        show:true,
        itemSize:16,
        //showTitle:True,
        feature:{
            dataView:{
                readOnly: true,
                optionToContent: function(opt) {
                    let seriesData = opt.series[0].data;
                    let table = '<table style="width:100%; text-align:center"><tbody><tr>' +
                                '<td>高度(m)</td><td>距离(km)</td><td>电磁波传播损失(dB)</td>' +
                                '</tr>';
                    for (let i=0, l=seriesData.length; i<l; i++) {
                        table += '<tr>' +
                                 '<td>' + seriesData[i][0] + '</td>' +
                                 '<td>' + seriesData[i][1] + '</td>' +
                                 '<td>' + seriesData[i][2] + '</td>' +
                                 '</tr>';
                    }
                    table += '</tbody></table>';
                    return table;
                }
            },
            restore: {},
            saveAsImage: {},
            dataZoom: {},
        },
        left:'center'
    },
    xAxis: {
        type: 'category',
        name:'距离/km',
        nameLocation:'center',
        nameTextStyle:{
            padding:10,
            fontSize:16,
        }
    },
    yAxis: {
        type: 'category',
        name:'高度/m',
        nameLocation:'center',
        nameTextStyle:{
            padding:20,
            fontSize:16,
        }
    },
    visualMap: {
        min: elec_min,
        max: elec_max,
        calculable: true,
        realtime: false,
		right:'2%',
        bottom:'3%',
        inRange: {
            color: ['#ad3cff', '#0000ff', '#00b2d3',
                '#ccfff1', '#ffe9a4', '#ffbe3f',
                '#ffa742', '#cf512c', '#980603']
        }
    },
    series: {
        name: '电磁波损失',
        type: 'heatmap',
        data: chart_data.ele_data,
        emphasis: {
            itemStyle: {
                borderColor: '#333',
                borderWidth: 1
            }
        },
        progressive: 1000,
        animation: false
    }
};
Chart_ele.setOption(option6);

option1 = {
  title: {
    text: '波导高度柱形图'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['波导高度'],
    textStyle: {
      fontSize: 16
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['表面波导', '悬空波导', '蒸发波导'],
    axisLabel: {
      fontSize:16
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      fontSize:16
    }
  },
  series: [
    {
      name: '波导底高',
      type: 'bar',
      stack: 'Total',
      itemStyle: {
        borderColor: 'transparent',
        color: 'transparent'
      },
      emphasis: {
        itemStyle: {
          borderColor: 'transparent',
          color: 'transparent'
        }
      },
      data: chart_data.bar_data.bottom
    },
    {
      name: '波导高度',
      type: 'bar',
      stack: 'Total',
      label: {
        show: true,
        position: 'top',
        fontSize: 16
      },
      data: chart_data.bar_data.altitude
    }
  ]
};

Chart_bar.setOption(option1)
