chart1 = echarts.init(document.getElementById('chart1'))

var timeData = [
    '2009/10/8 3:00', '2009/10/8 4:00', '2009/10/8 5:00', '2009/10/8 6:00', '2009/10/8 7:00', '2009/10/8 8:00',
    '2009/10/8 9:00', '2009/10/8 10:00', '2009/10/8 11:00', '2009/10/8 12:00', '2009/10/8 13:00', '2009/10/8 14:00',
    '2009/10/8 15:00', '2009/10/8 16:00', '2009/10/8 17:00', '2009/10/8 18:00', '2009/10/8 19:00', '2009/10/8 20:00', 
    '2009/10/8 21:00', '2009/10/8 22:00', '2009/10/8 23:00', '2009/10/9 0:00', '2009/10/9 1:00', '2009/10/9 2:00',
    '2009/10/9 3:00', '2009/10/9 4:00', '2009/10/9 5:00', '2009/10/9 6:00', '2009/10/9 7:00', '2009/10/9 8:00',
    '2009/10/9 9:00', '2009/10/9 10:00', '2009/10/9 11:00', '2009/10/9 12:00', '2009/10/9 13:00', '2009/10/9 14:00', 
    '2009/10/9 15:00', '2009/10/9 16:00', '2009/10/9 17:00', '2009/10/9 18:00', '2009/10/9 19:00', '2009/10/9 20:00',
    '2009/10/9 21:00', '2009/10/9 22:00', '2009/10/9 23:00', '2009/10/10 0:00', '2009/10/10 1:00', '2009/10/10 2:00',
    '2009/10/10 3:00', '2009/10/10 4:00', '2009/10/10 5:00', '2009/10/10 6:00', '2009/10/10 7:00', '2009/10/10 8:00',
    '2009/10/10 9:00', '2009/10/10 10:00', '2009/10/10 11:00', '2009/10/10 12:00', '2009/10/10 13:00',
    '2009/10/10 14:00', '2009/10/10 15:00', '2009/10/10 16:00', '2009/10/10 17:00', '2009/10/10 18:00',
    '2009/10/10 19:00', '2009/10/10 20:00', '2009/10/10 21:00', '2009/10/10 22:00', '2009/10/10 23:00',
    '2009/10/11 0:00', '2009/10/11 1:00', '2009/10/11 2:00', '2009/10/11 3:00', '2009/10/11 4:00', 
    '2009/10/11 5:00', '2009/10/11 6:00', '2009/10/11 7:00', '2009/10/11 8:00', '2009/10/11 9:00', 
    '2009/10/11 10:00', '2009/10/11 11:00', '2009/10/11 12:00', '2009/10/11 13:00', '2009/10/11 14:00', 
    '2009/10/11 15:00', '2009/10/11 16:00', '2009/10/11 17:00', '2009/10/11 18:00', '2009/10/11 19:00', 
    '2009/10/11 20:00', '2009/10/11 21:00', '2009/10/11 22:00', '2009/10/11 23:00', '2009/10/12 0:00', 
    '2009/10/12 1:00', '2009/10/12 2:00', '2009/10/12 3:00', '2009/10/12 4:00', '2009/10/12 5:00', 
    '2009/10/12 6:00', '2009/10/12 7:00', '2009/10/12 8:00', '2009/10/12 9:00', '2009/10/12 10:00', 
    '2009/10/12 11:00', '2009/10/12 12:00', '2009/10/12 13:00', '2009/10/12 14:00', '2009/10/12 15:00', 
    '2009/10/12 16:00', '2009/10/12 17:00', '2009/10/12 18:00', '2009/10/12 19:00', '2009/10/12 20:00', 
    '2009/10/12 21:00', '2009/10/12 22:00', '2009/10/12 23:00', '2009/10/13 0:00', '2009/10/13 1:00', 
    '2009/10/13 2:00', '2009/10/13 3:00', '2009/10/13 4:00', '2009/10/13 5:00', '2009/10/13 6:00', 
    '2009/10/13 7:00', '2009/10/13 8:00', '2009/10/13 9:00', '2009/10/13 10:00', '2009/10/13 11:00', 
    '2009/10/13 12:00', '2009/10/13 13:00', '2009/10/13 14:00', '2009/10/13 15:00', '2009/10/13 16:00', 
    '2009/10/13 17:00', '2009/10/13 18:00', '2009/10/13 19:00', '2009/10/13 20:00', '2009/10/13 21:00', 
    '2009/10/13 22:00', '2009/10/13 23:00', '2009/10/14 0:00', '2009/10/14 1:00', '2009/10/14 2:00', 
    '2009/10/14 3:00', '2009/10/14 4:00', '2009/10/14 5:00', '2009/10/14 6:00', '2009/10/14 7:00', 
    '2009/10/14 8:00', '2009/10/14 9:00', '2009/10/14 10:00', '2009/10/14 11:00', '2009/10/14 12:00', 
    '2009/10/14 13:00', '2009/10/14 14:00', '2009/10/14 15:00', '2009/10/14 16:00', '2009/10/14 17:00', 
    '2009/10/14 18:00', '2009/10/14 19:00', '2009/10/14 20:00', '2009/10/14 21:00', '2009/10/14 22:00', 
    '2009/10/14 23:00', '2009/10/15 0:00', '2009/10/15 1:00', '2009/10/15 2:00', '2009/10/15 3:00', 
    '2009/10/15 4:00', '2009/10/15 5:00', '2009/10/15 6:00', '2009/10/15 7:00', '2009/10/15 8:00', 
    '2009/10/15 9:00', '2009/10/15 10:00', '2009/10/15 11:00', '2009/10/15 12:00', '2009/10/15 13:00', 
    '2009/10/15 14:00', '2009/10/15 15:00', '2009/10/15 16:00', '2009/10/15 17:00', '2009/10/15 18:00', 
    '2009/10/15 19:00', '2009/10/15 20:00', '2009/10/15 21:00', '2009/10/15 22:00', '2009/10/15 23:00', 
    '2009/10/16 0:00', '2009/10/16 1:00', '2009/10/16 2:00', '2009/10/16 3:00', '2009/10/16 4:00', 
    '2009/10/16 5:00', '2009/10/16 6:00', '2009/10/16 7:00', '2009/10/16 8:00', '2009/10/16 9:00', 
    '2009/10/16 10:00', '2009/10/16 11:00', '2009/10/16 12:00', '2009/10/16 13:00', '2009/10/16 14:00', 
    '2009/10/16 15:00', '2009/10/16 16:00', '2009/10/16 17:00', '2009/10/16 18:00', '2009/10/16 19:00', 
    '2009/10/16 20:00', '2009/10/16 21:00', '2009/10/16 22:00', '2009/10/16 23:00', '2009/10/17 0:00', 
    '2009/10/17 1:00', '2009/10/17 2:00', '2009/10/17 3:00', '2009/10/17 4:00', '2009/10/17 5:00', 
    '2009/10/17 6:00', '2009/10/17 7:00', '2009/10/17 8:00', '2009/10/17 9:00', '2009/10/17 10:00', 
    '2009/10/17 11:00', '2009/10/17 12:00', '2009/10/17 13:00', '2009/10/17 14:00', '2009/10/17 15:00', 
    '2009/10/17 16:00', '2009/10/17 17:00', '2009/10/17 18:00', '2009/10/17 19:00', '2009/10/17 20:00', 
    '2009/10/17 21:00', '2009/10/17 22:00', '2009/10/17 23:00', '2009/10/18 0:00', '2009/10/18 1:00', 
    '2009/10/18 2:00', '2009/10/18 3:00', '2009/10/18 4:00', '2009/10/18 5:00', '2009/10/18 6:00', 
    '2009/10/18 7:00', '2009/10/18 8:00'
];
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
function newtime(timeData){
	num = count(timeData);
	current = timeData[num-1];
	time = current.split(" ");
	hour = time[1].split(":");
	hour = parseInt(hour[0]);
	time = time[0].split("/");
	month = parseInt(time[0]);
	day = parseInt(time[1]);
	hour = hour + 1
	if(hour>24){
		hour = 0;
		day = day + 1;
	}
	if(month%2==0 && day>31){
		month = month + 1;
		day = 0;
	}
	if(month%2==1 && day>30){
		month = month + 1;
		day = 0;
	}
	if(month>12){
		month = 1;
	}
	nexttime = month.toString() + "/" + day.toString() + " " + hour.toString() + ":00";
	if(num>300){
		timeData.shift();
		timeData.push(nexttime);
	}
	else{
		timeData.push(nexttime);
	}
}

function limitedtime(timeData){
	newtimeData = [];
	num = count(timeData);
	if(num > 300){
		for(i=300;i>0;i--){
			newtimeData.push(timeData[num-i]);
		}
		return newtimeData;
	}
	return timeData;
}

timeData = timeData.map(function (str) {
    return str.replace('2009/', '');
});

var actual = []
var forecast = []
var press = []
var tem = []
var hum = []
var wind = []
var NextValue = 100;

function randvalue(timeData){
	var TEM = document.getElementById("tem");
	var HUM = document.getElementById("hum");
	var WIND = document.getElementById("wind");
	var PRESS = document.getElementById("press");
    num = count(timeData);
    var i = 0;
    while(i<num){
        rands = Math.random() * 100
        actual.push(rands)
        forecast.push(rands + Math.random() * 10)
		hum.push(Math.random());
		tem.push(Math.random() * 150 + 150);
		wind.push(Math.random() * 500);
		press.push(Math.random() * 1100);
		absvalue.push(Math.abs(actual[i] - forecast[i]))
		i++;
    }
	TEM.innerHTML = tem[num-1].toString().substring(0, 5) + 'K'
	HUM.innerHTML = (hum[num-1] * 100).toString().substring(0, 5) + "%"
	WIND.innerHTML = wind[num-1].toString().substring(0, 5) + 'm/s'
	PRESS.innerHTML = press[num-1].toString().substring(0, 5) + 'hPa'
}

var absvalue = []
function nextvalue(){
	//alert('nextvalue')
	num = count(hum)
	//alert(num)
	var TEM = document.getElementById("tem");
	var HUM = document.getElementById("hum");
	var WIND = document.getElementById("wind");
	var PRESS = document.getElementById("press");
	//var HEIGHT = document.getElementById("height");
	if(num>300){
		hum.shift()
		tem.shift()
		wind.shift()
		press.shift()
		actual.shift()
		forecast.shift()
		absvalue.shift()
		
		actual.push(NextValue - Math.random() * 10)
		forecast.push(NextValue)
		hum.push(Math.random())
		tem.push(Math.random() * 150 + 150)
		wind.push(Math.random() * 500)
		press.push(Math.random() * 1100)
		absvalue.push(Math.abs(actual[299] - forecast[299]))
		//HEIGHT.innerHTML = height[299].toString().substring(0, 5) + 'm'
		TEM.innerHTML = tem[299].toString().substring(0, 5) + 'K'
		HUM.innerHTML = (hum[299] * 100).toString().substring(0, 5) + "%"
		WIND.innerHTML = wind[299].toString().substring(0, 5) + 'm/s'
		PRESS.innerHTML = press[299].toString().substring(0, 5) + 'hPa'
	}
	else{
		hum.push(Math.random())
		tem.push(Math.random() * 150 + 150)
		wind.push(Math.random() * 500)
		press.push(Math.random() * 1100)
		actual.push(NextValue - Math.random() * 10)
		forecast.push(NextValue)
		absvalue.push(Math.abs(actual[num] - forecast[num]))
		//HEIGHT.innerHTML = height[num].toString().substring(0, 5) + 'm'
		TEM.innerHTML = tem[num].toString().substring(0, 5) + 'K'
		HUM.innerHTML = (hum[num] * 100).toString().substring(0, 5) + "%"
		WIND.innerHTML = wind[num].toString().substring(0, 5) + 'm/s'
		PRESS.innerHTML = press[num].toString().substring(0, 5) + 'hPa'
		
	}
	
}

timeData = limitedtime(timeData)

randvalue(timeData)

option = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['实际值', '预测值', '误差']
    },
    axisPointer: {
        link: {xAxisIndex: 'all'}
    },
    dataZoom: [
		{
            show: true,
            realtime: true,
            start: 90,
            end: 100,
            xAxisIndex: [0, 1]
        },
        {
            type: 'inside',
            realtime: true,
            start: 90,
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
    toolbox: {
        show: true,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
        }
    },
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
            gridIndex:0,
            type: 'value',
            name: '高度(m)'
        },
        {
            gridIndex: 1,
            name: '误差(m)',
            type: 'value',
            inverse: true
        }
    ],
    series: [
        {
            name: '实际值',
            type: 'line',
            data: actual,
            xAxisIndex: 0,
            yAxisIndex: 0,
            markLine: {
                data: [
                    {type: 'average', name: '平均值'}
                ]
            }
        },
        {
            name: '预测值',
            type: 'line',
            data: forecast,
            xAxisIndex: 0,
            yAxisIndex: 0,
            itemStyle: {
		    	normal:{
		    		 color: '#00BFFF'
		    	}
		    },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'},
                ]
            }
        }
        ,
		{
		    name: '误差',
		    type: 'line',
		    symbolSize: 8,
			xAxisIndex: 1,
            yAxisIndex: 1,
            markPoint: {
                data:[
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                ]

            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'},
                ]
            },
			itemStyle: {
		    	normal:{
		    		 color: '#EE9A00'
		    	}
		    },
		    hoverAnimation: false,
		    data: absvalue
		}
    ]
};


//chart_right.setOption(option);
//setoption(timeData)
//self.setInterval("setoption(timeData)", 10000)
