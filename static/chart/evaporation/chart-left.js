let chart_left = echarts.init(document.getElementById('chart-left'))

let timeData = []
let height = []
let tem = []
let hum = []
let wind = []
let press = []

let max_save_count = 300
let current_index = 0;

let socket = null
let url = "http://" + document.domain + ":" + location.port

// socket io 初始化相关代码
socket = io.connect(url)
socket.emit('evaporation')

// socket io 监听事件
socket.on('historical_evaporation_data', his_data=>{
    console.log(his_data)
    let i = 0;
    while(i<his_data.length){
        timeData.push(his_data[i].time)
		height.push(his_data[i].height)
        i++
    }
    current_index = his_data.length - 1;
    update_header()
})

socket.on('new_evaporation_data', new_data=>{
    if(current_index >= max_save_count) {
        //timeData.shift()
        tem.shift()
        hum.shift()
        wind.shift()
        press.shift()
        direction.shift()
        current_index --;
    }
    timeData.push(new_data.time)
    tem.push(new_data.tem)
    hum.push(new_data.hum)
    wind.push(new_data.wind)
    press.push(new_data.press)
    direction.push(new_data.direction)
    current_index ++;
    console.log(timeData)
    update_header()
})

//socket io 定时发送请求信息
setInterval(request_data,1000)

function request_data(){
    console.log("request")
    socket.emit('request_evaporation_data')
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

option = {
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
			type: 'category',
			boundaryGap: false,
			axisLine: {onZero: true},
            data: timeData
        },
        yAxis: {
            splitLine: {
                show: false
            }
        },
        toolbox: {
            left: 'center',
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
        dataZoom: [
            {
                show: true,
                realtime: true,
                start: 95,
                end: 100,
            }
        ],
        visualMap: {
            top: 10,
            right: 10,
            pieces: [{
                gt: 0,
                lte: 5,
                color: '#FF83FA'
            }, {
                gt: 5,
                lte: 10,
                color: '#EE7AE9'
            }, {
                gt: 10,
                lte: 15,
                color: '#CD69C9'
            }, {
                gt: 15,
                lte:20,
                color: '#8B4789'
            }],
            outOfRange: {
                color: '#68228B'
            }
        },
        series: {
            name: 'evaporation wave',
            type: 'line',
            data: height,
            markLine: {
                silent: true,
                data: [{
                    yAxis: 5
                }, {
                    yAxis: 10
                }, {
                    yAxis: 15
                }, {
                    yAxis: 20
                }, {
                    yAxis: 25
                }]
            }
        }
    };

//Chart_one.setOption(option);
function setoption(){
	chart_left.setOption(option);
}