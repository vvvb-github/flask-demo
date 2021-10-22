
// 蒸发波导折线图 line_data
let Chart_line = echarts.init(document.getElementById('echarts-line'));
// 波导高度柱形图 bar_data
let Chart_bar = echarts.init(document.getElementById('echarts-bar'));

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

option1 = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {},
  toolbox: {
    show: true,
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      dataView: { readOnly: false },
      magicType: { type: ['line', 'bar'] },
      restore: {},
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} °C'
    }
  },
  series: [
    {
      name: 'Highest',
      type: 'line',
      data: [10, 11, 13, 11, 12, 12, 9],
      markPoint: {
        data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Min' }
        ]
      },
      markLine: {
        data: [{ type: 'average', name: 'Avg' }]
      }
    },
    {
      name: 'Lowest',
      type: 'line',
      data: [1, -2, 2, 5, 3, 2, 0],
      markPoint: {
        data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }]
      },
      markLine: {
        data: [
          { type: 'average', name: 'Avg' },
          [
            {
              symbol: 'none',
              x: '90%',
              yAxis: 'max'
            },
            {
              symbol: 'circle',
              label: {
                position: 'start',
                formatter: 'Max'
              },
              type: 'max',
              name: '最高点'
            }
          ]
        ]
      }
    }
  ]
};

Chart_line.setOption(option1)

option2 = {
  dataset: {
    source: [
      ['humidity', 'altitude', 'date'],
      [89.3, 58212, '2021/09/01'],
      [57.1, 78254, '2021/09/02'],
      [74.4, 41032, '2021/09/03'],
      [50.1, 12755, '2021/09/04'],
      [89.7, 20145, '2021/09/05'],
      [68.1, 79146, '2021/09/06'],
      [19.6, 91852, '2021/09/07'],
      [10.6, 101852, '2021/09/08'],
      [32.7, 20112, '2021/09/09']
    ]
  },
  grid: { containLabel: true },
  xAxis: { name: 'amount' },
  yAxis: { type: 'category' },
  visualMap: {
    orient: 'horizontal',
    left: 'center',
    min: 10,
    max: 100,
    text: ['High Score', 'Low Score'],
    // Map the score column to color
    dimension: 0,
    inRange: {
      color: ['#65B581', '#FFCE34', '#FD665F']
    }
  },
  series: [
    {
      type: 'bar',
      encode: {
        // Map the "amount" column to X axis.
        x: 'amount',
        // Map the "product" column to Y axis
        y: 'product'
      }
    }
  ]
};

Chart_bar.setOption(option2)





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
//
// option1 = {
//   title: {
//     text: '波导高度柱形图'
//   },
//   tooltip: {
//     trigger: 'axis',
//     axisPointer: {
//       type: 'shadow'
//     }
//   },
//   legend: {
//     data: ['波导高度'],
//     textStyle: {
//       fontSize: 16
//     }
//   },
//   grid: {
//     left: '3%',
//     right: '4%',
//     bottom: '3%',
//     containLabel: true
//   },
//   xAxis: {
//     type: 'category',
//     data: ['表面波导', '悬空波导', '蒸发波导'],
//     axisLabel: {
//       fontSize:16
//     }
//   },
//   yAxis: {
//     type: 'value',
//     axisLabel: {
//       fontSize:16
//     }
//   },
//   series: [
//     {
//       name: '波导底高',
//       type: 'bar',
//       stack: 'Total',
//       itemStyle: {
//         borderColor: 'transparent',
//         color: 'transparent'
//       },
//       emphasis: {
//         itemStyle: {
//           borderColor: 'transparent',
//           color: 'transparent'
//         }
//       },
//       data: chart_data.bar_data.bottom
//     },
//     {
//       name: '波导高度',
//       type: 'bar',
//       stack: 'Total',
//       label: {
//         show: true,
//         position: 'top',
//         fontSize: 16
//       },
//       data: chart_data.bar_data.altitude
//     }
//   ]
// };
