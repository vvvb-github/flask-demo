var chart_left = echarts.init(document.getElementById("chart-left"))
var app = {};
option_left = null;
var symbolSize = 20;

var refractionData = [[350, 0], [335,40], [333, 65], [338, 99], [370, 300]];
var updateCount = 0;
var heightFirst = 300;
var nextHeight = [];
var ifUpdate = false;


var press = []
var tem = []
var hum = []
var wind = []



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
function nextvalue(){
	var TEM = document.getElementById("tem");
	var HUM = document.getElementById("hum");
	var WIND = document.getElementById("wind");
	var PRESS = document.getElementById("press");

	hum.push(Math.random())
	tem.push(Math.random() * 150 + 150)
	wind.push(Math.random() * 500)
	press.push(Math.random() * 1100)

	num = count(hum)
	if(num>300){
		hum.shift()
		tem.shift()
		wind.shift()
		press.shift()
		
		hum.push(Math.random())
		tem.push(Math.random() * 150 + 150)
		wind.push(Math.random() * 500)
		press.push(Math.random() * 1100)

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

		TEM.innerHTML = tem[num].toString().substring(0, 5) + 'K'
		HUM.innerHTML = (hum[num] * 100).toString().substring(0, 5) + "%"
		WIND.innerHTML = wind[num].toString().substring(0, 5) + 'm/s'
		PRESS.innerHTML = press[num].toString().substring(0, 5) + 'hPa'	
	}

	if(updateCount == 5){
		refractionData[0] = [Math.floor(Math.random()*20-10+350),Math.floor(Math.random()*50-25+25)];
		refractionData[1] = [Math.floor(Math.random()*20-10+330),Math.floor(Math.random()*50-25+50)];
		refractionData[2] = [Math.floor(Math.random()*20-10+320),Math.floor(Math.random()*50-25+100)];
		refractionData[3] = [Math.floor(Math.random()*20-10+350),Math.floor(Math.random()*50-25+200)];
		refractionData[4] = [Math.floor(Math.random()*20-10+370),Math.floor(Math.random()*50-25+300)];
	}
}



		
option_left = {		 
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			animation: false
		}
	},
	legend: {
	   data: ['修正大气折射率'],
	   left: 10
	},
  	grid: {
		left: '5%',
		top: '20%',	
		width:'75%',
		height: '70%'
  	},
  	xAxis: {
	   name:'(修正大气折射指数：M )',
	   type: 'value',
	   minInterval:20,
	   axisLine: {onZero: false}
  	},
  	yAxis: {
	   name:'(高度：m)',
	   type: 'value',
	   minInterval:100,
	   axisLine: {onZero: false}
  	},
  	dataZoom: [
		{
			startValue:320
		},
		{
			type: 'slider',
			yAxisIndex: 0
		},
		{
			type: 'inside',
			xAxisIndex: 0,
			filterMode: 'empty'
		},
		{
			type: 'inside',
			yAxisIndex: 0,
			filterMode: 'empty'
		}
  	],
  	series: [
		{
			name: '高度',
		  	id: 'a',
		  	type: 'line',
		  	smooth: true,
		  	data: refractionData
	  	}
  	]	
};
		
setTimeout(function () {
	// Add shadow circles (which is not visible) to enable drag.
	chart_left.setOption({
		graphic: echarts.util.map(refractionData, function (item, dataIndex) {
			return {
				type: 'circle',
				position: chart_left.convertToPixel('grid', item),
				shape: {
					cx: 0,
					cy: 0,
					r: symbolSize / 2
				},
				invisible: true,
				draggable: true,
				ondrag: echarts.util.curry(onPointDragging, dataIndex),
				onmousemove: echarts.util.curry(showTooltip, dataIndex),
				onmouseout: echarts.util.curry(hideTooltip, dataIndex),
				z: 100
			};
		})
	});
}, 0);
   
window.addEventListener('resize', updatePosition);
   
chart_left.on('dataZoom', updatePosition);
   
function updatePosition() {
	chart_left.setOption({
		graphic: echarts.util.map(refractionData, function (item, dataIndex) {
			return {
				position: chart_left.convertToPixel('grid', item)
			};
		})
	});
}  
   
function showTooltip(dataIndex) {
	chart_left.dispatchAction({
		type: 'showTip',
		seriesIndex: 0,
		dataIndex: dataIndex
	});
}
   
function hideTooltip(dataIndex) {
	chart_left.dispatchAction({
		type: 'hideTip'
	});
}
   
function onPointDragging(dataIndex, dx, dy) {
	data[dataIndex] = chart_left.convertFromPixel('grid', this.position);
   
	// Update data
	chart_left.setOption({
		series: [{
			id: 'a',
			data: refractionData
		}]
	});
};
chart_left.setOption(option_left);


		