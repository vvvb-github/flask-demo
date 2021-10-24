let Chart_one = echarts.init(document.getElementById('echarts'));
let Chart_two = echarts.init(document.getElementById('echarts2'));
let Chart_tri = echarts.init(document.getElementById('echarts3'));
let Chart_for = echarts.init(document.getElementById('echarts4'));

let TEM = document.getElementById("tem");
let HUM = document.getElementById("hum");
let WIND = document.getElementById("wind");
let PRESS = document.getElementById("press");
let TEXT = document.getElementById("datatext");

let upper_time = null; //用来判断从服务端传递来数据是否是更新过的

let timeData = []
let tem = []
let hum = []
let wind = []
let press = []
let direction = []


let max_save_count = 300
let current_index = 0;

socket.emit('index')

// socket io 监听事件
socket.on('historical_index_data', his_data=>{
    let i = 0;
    while(i<his_data.length){
        timeData.push(his_data[i].time)
        tem.push(his_data[i].tem)
        hum.push(his_data[i].hum)
        wind.push(his_data[i].wind)
        press.push(his_data[i].press)
        direction.push(his_data[i].direction)
        i++
    }
    current_index = his_data.length - 1;
    upper_time = timeData[current_index]
    update_header()
})

socket.on('new_index_data', new_data=>{
    if(current_index >= max_save_count) {
        timeData.shift()
        tem.shift()
        hum.shift()
        wind.shift()
        press.shift()
        direction.shift()
        current_index --;
    }
    if(upper_time === new_data.time){
        console.log("时间相等，数据冗余，将舍弃")
        return
    }else {
        upper_time = new_data.time
        timeData.push(new_data.time)
        tem.push(new_data.tem)
        hum.push(new_data.hum)
        wind.push(new_data.wind)
        press.push(new_data.press)
        direction.push(new_data.direction)
        current_index ++;
        update_header()
    }
})

//socket io 定时发送请求信息
setInterval(request_data,1000)

function request_data(){
    socket.emit('request_index_data')
}

//更新视图
let content_text = ""
let lastlength = []
function update_header(){
	TEM.innerHTML = tem[current_index].toString() + 'K'
	HUM.innerHTML = hum[current_index].toString() + "%"
	WIND.innerHTML = wind[current_index].toString() + 'm/s'
	PRESS.innerHTML = press[current_index].toString() + 'hPa'

    let content_temp = ""
		content_temp += "<b>" + timeData[current_index] + "</b>:<br/>" + "当前采集到的温度为：" + TEM.innerHTML
		content_temp += "<br/>当前采集到的湿度为：" + HUM.innerHTML + "；"
		content_temp += "<br/>当前采集到的风速为：" + WIND.innerHTML + "；"
		content_temp += "<br/>当前采集到的湿度为：" + PRESS.innerHTML + "。"
    content_temp += "<br/>"
	content_text = content_temp + content_text
	if(content_text.length > 1000){
		console.log(lastlength)
		content_text = content_text.substring(0, content_text.length-lastlength[0])
		lastlength.shift()
		TEXT.innerHTML = content_text
	}
	else{
		TEXT.innerHTML = content_text
	}
	lastlength.push(content_temp.length)
    setoption()
}


function setoption(){
	Chart_one.showLoading();
	Chart_two.showLoading();
	Chart_tri.showLoading();
	Chart_for.showLoading();
	Chart_one.setOption(option);
	Chart_one.hideLoading();
	Chart_two.setOption(option2);
	Chart_two.hideLoading();
	Chart_tri.setOption(option3);
	Chart_tri.hideLoading();
	Chart_for.setOption(option4);
	Chart_for.hideLoading();
}

option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    legend: {
        data: ['温度'],
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
            end: 100,
        }
    ],
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            axisLine: {onZero: true},
            data: timeData
        }
    ],
    yAxis: [
        {
            name: '气温(K)',
            type: 'value',
            max: 300,
            min: 130
        }
    ],
    series: [
        {
            name: '温度',
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
            data: tem
        }
    ]
};
option2 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    legend: {
        data: ['气压'],
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
            data: timeData
        }
    ],
    yAxis: [
        {
            name: '气压(hPa)',
            type: 'value',
            max: 1100,
        }
    ],
    series: [
        {
            name: '气压',
            type: 'line',
            symbolSize: 8,
            hoverAnimation: false,
            data: press,
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
        }
    ]
};
option3 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    legend: {
        data: ['湿度'],
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
            end: 100,
        }
    ],
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            axisLine: {onZero: true},
            data: timeData
        }
    ],
    yAxis: [
        {
            name: '湿度(%)',
            type: 'value',
            max: 1,
        }
    ],
    series: [
        {
            name: '湿度',
            type: 'line',
            symbolSize: 8,
			itemStyle: {
            	normal:{
            		 color: '#87CEFA'
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
            data: hum
        }
    ]
};		
option4 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    legend: {
        data: ['风速', '风向'],
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
            end: 100,
            xAxisIndex: [0, 1]
        },
        {
            type: 'inside',
            realtime: true,
            start: 50,
            end: 100,
            xAxisIndex: [0, 1]
        }
    ],
	grid: [{
        left: 50,
        right: 50,
        height: '33%'
    }, {
        left: 50,
        right: 50,
        top: '55%',
        height: '33%'
    }],
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            axisLine: {onZero: true},
            data: timeData
        },
        {
            gridIndex: 1,
            type: 'category',
            boundaryGap: false,
            axisLine: {onZero: true},
            data: timeData,
            position: 'top'
        }
    ],
    yAxis: [
        {
            name: '风速(m/s)',
            type: 'value',
            max: 500
        },
        {
            gridIndex: 1,
            name: '风向(°)',
            type: 'value',
            inverse: true
        }
    ],
    series: [
        {
            name: '风速',
            type: 'line',
            symbolSize: 8,
			itemStyle: {
            	normal:{
            		 color: '#7FFFD4'
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
            data: wind
        },
		{
		    name: '风向',
		    type: 'bar',
		    symbolSize: 8,
			xAxisIndex: 1,
            yAxisIndex: 1,
			itemStyle: {
		    	normal:{
		    		 color: '#54FF9F'
		    	}
		    },
		    hoverAnimation: false,
		    data: direction
		}
    ]
};		


		