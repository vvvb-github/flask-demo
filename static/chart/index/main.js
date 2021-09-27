
// 蒸发波导折线图 line_data
var Chart_one = echarts.init(document.getElementById('echarts'));
// 波导高度柱形图 bar_data
var Chart_two = echarts.init(document.getElementById('echarts2'));
// HPC热力图
var Chart_tri = echarts.init(document.getElementById('echarts3'));
// TPC热力图
var Chart_for = echarts.init(document.getElementById('echarts4'));
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
var chart_data = {}

// 蒸发波导信息，时间、波导高度
// time
// altitude

// 波导高度信息，（蒸发、表面、悬空）波导底高，波导高度 （底高+高度=顶高）
// bottom
// altitude

// HPC、TPC（保留项）
// altitude、humidity、time
// altitude、temperature、time

function setoption(timeData){
	Chart_one.showLoading();
	Chart_two.showLoading();
	Chart_one.setOption(option);
	Chart_one.hideLoading();
	Chart_two.setOption(option2);
	Chart_two.hideLoading();
}


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
                yAxisIndex: 'none'
            },
            dataView: {readOnly: true},
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
		