
// 波导高度柱形图 bar_data
let Chart_bar = echarts.init(document.getElementById('echarts-bar'));
// 电磁波损耗计算图
let Chart_radar = echarts.init(document.getElementById('echarts-radar'));
// 雷达损耗计算图
let Chart_ele = echarts.init(document.getElementById('echarts-ele'))

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
    tooltip: {},
    toolbox:{
        show:true,
        itemSize:16,
        //showTitle:True,
        feature:{
            dataView:{},
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
        max: 200,
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
        data: chart_data.radar_data,
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
    tooltip: {},
    toolbox:{
        show:true,
        itemSize:16,
        //showTitle:True,
        feature:{
            dataView:{},
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
        // min: 0,
        // max: 200,
        calculable: true,
        realtime: false,
		right:'2%',
        bottom:'3%',
        inRange: {
            color: ['#1C1C1C', '#363636', '#4F4F4F', '#696969', '#828282', '#9C9C9C', '#B5B5B5', '#CFCFCF', '#E8E8E8']
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
Chart_ele.setOption(option6)

// option = {
//     tooltip: {
//         trigger: 'axis',
//         axisPointer: {
//             animation: false
//         }
//     },
//     legend: {
//         data: ['蒸发波导高度'],
//         left: 10
//     },
//     toolbox: {
//         feature: {
//             dataZoom: {
//                 yAxisIndex: 'none'
//             },
//             dataView: {readOnly: true},
//             magicType: {type: ['line', 'bar']},
//             restore: {},
//             saveAsImage: {}
//         }
//     },
//     axisPointer: {
//         link: {xAxisIndex: 'all'}
//     },
//     dataZoom: [
//         {
//             show: true,
//             realtime: true,
//             start: 80,
//             end: 100
//         }
//     ],
//     xAxis: [
//         {
//             type: 'category',
//             boundaryGap: false,
//             axisLine: {onZero: true},
//             data: chart_data.line_data.time
//         }
//     ],
//     yAxis: [
//         {
//             name: '高度(m)',
//             type: 'value'
//         }
//     ],
//     series: [
//         {
//             name: '蒸发波导高度',
//             type: 'line',
//             symbolSize: 8,
// 			itemStyle: {
//             	normal:{
//             		 color: '#FF8247'
//             	}
//             },
// 			markPoint: {
// 			    data: [
// 			        {type: 'max', name: '最大值'},
// 			        {type: 'min', name: '最小值'}
// 			    ]
// 			},
// 			markLine: {
// 			    data: [
// 			        {type: 'average', name: '平均值'}
// 			    ]
// 			},
//             hoverAnimation: false,
//             data: chart_data.line_data.altitude
//         }
//     ]
// };

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
