var dom = document.getElementById("chart-right");
var chart_right = echarts.init(dom);
var app = {};
option_right = null;
var colors = [ '#2F4554'];
var symbolSize = 20;
var radar_100_data = [[0, 110], [3, 125], [5, 115], [7, 120], [10, 118],[16,128],[18,121],[20, 110], [23, 125], [25, 115], [27, 130], [30, 140]];

function nextRadarData(){
	if(updateCount<5){
		updateCount ++;
	}else{
		radar_100_data[0] = [Math.floor(Math.random()*10-5+5),Math.floor(Math.random()*10-5+105)];
		radar_100_data[1] = [Math.floor(Math.random()*10-5+10),Math.floor(Math.random()*10-5+120)];
		radar_100_data[2] = [Math.floor(Math.random()*10-5+20),Math.floor(Math.random()*10-5+105)];
		radar_100_data[3] = [Math.floor(Math.random()*10-5+30),Math.floor(Math.random()*10-5+120)];
		radar_100_data[4] = [Math.floor(Math.random()*10-5+40),Math.floor(Math.random()*10-5+130)];
		radar_100_data[5] = [Math.floor(Math.random()*10-5+50),Math.floor(Math.random()*10-5+130)];
		radar_100_data[6] = [Math.floor(Math.random()*10-5+60),Math.floor(Math.random()*10-5+140)];
		radar_100_data[7] = [Math.floor(Math.random()*10-5+70),Math.floor(Math.random()*10-5+140)];
		radar_100_data[8] = [Math.floor(Math.random()*10-5+120),Math.floor(Math.random()*10-5+140)];
		radar_100_data[9] = [Math.floor(Math.random()*10-5+150),Math.floor(Math.random()*10-5+150)];
		radar_100_data[10] = [Math.floor(Math.random()*10-5+160),Math.floor(Math.random()*10-5+150)];
		radar_100_data[11] = [Math.floor(Math.random()*10-5+170),Math.floor(Math.random()*10-5+150)];
		ifUpdate =true;
		updateCount = 0;
	}
}


option_right = {
  color: colors,
  tooltip: {
	   trigger: 'axis',
	   axisPointer: {
		   animation: false
	   }
   },
   legend: {
	  data: ['雷达探测距离'],
	  left: 10,
  },
  grid: {
	   left: '5%',
	   
	   width:'75%'
   },
  xAxis: {
	  name:'(距离：km )',
	  min: 0,
	  max: 200,
	  type: 'value',
	  minInterval:50,
	  axisLine: {onZero: false}
  },
  yAxis: {
	  
	  min: 100,
	  max: 160,
	  type: 'value',
	  inverse:true,
	  minInterval:20,
	  axisLine: {onZero: false}
  },
  dataZoom: [
	  {
		  type: 'slider',
		  yAxisIndex: 0,
		  calculable: true,
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
		  name: '雷达探测距离',
		  id: 'a',
		  type: 'line',
		  smooth: true,
		  // symbolSize: symbolSize,
		  data: radar_100_data,
		  markLine:{
				symbol:'none',
			 lineStyle: {
				 normal: {
					 // type: 'solid'
				 },
				 
			 },
			 data : [
				 { yAxis:140 ,name:'min'},
				 
			 ]
		  }
	  }
  ]
};


setTimeout(function () {
  // Add shadow circles (which is not visible) to enable drag.
  chart_right.setOption({
	  graphic: echarts.util.map(radar_100_data, function (item, dataIndex) {
		  return {
			  type: 'circle',
			  position: chart_right.convertToPixel('grid', item),
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

chart_right.on('dataZoom', updatePosition);

function updatePosition() {
	chart_right.setOption({
	  graphic: echarts.util.map(radar_100_data, function (item, dataIndex) {
		  return {
			  position: chart_right.convertToPixel('grid', item)
		  };
	  })
  });
}

function showTooltip(dataIndex) {
	chart_right.dispatchAction({
	  type: 'showTip',
	  seriesIndex: 0,
	  dataIndex: dataIndex
  });
}

function hideTooltip(dataIndex) {
	chart_right.dispatchAction({
	  type: 'hideTip'
  });
}

function onPointDragging(dataIndex, dx, dy) {
	radar_100_data[dataIndex] = chart_right.convertFromPixel('grid', this.position);

  // Update data
  chart_right.setOption({
	  series: [{
		  id: 'a',
		  data: radar_100_data
	  }]
  });
};
if (option_right && typeof option_right === "object") {
	chart_right.setOption(option_right, true);
}


function setoption(){
	nextvalue();
	nextRadarData();
	console.log(ifUpdate);
	if(ifUpdate){
		document.getElementById('chart-left').removeAttribute('_echarts_instance_');
		document.getElementById('chart-right').removeAttribute('_echarts_instance_');
		var chart_left = echarts.init(document.getElementById("chart-left"))
		var chart_right = echarts.init(document.getElementById("chart-right"))
		chart_left.setOption(option_left,true);
		chart_right.setOption(option_right,true);
		console.log(radar_15_data)
		ifUpdate = false;
	}	
}
self.setInterval("setoption()", 1000)