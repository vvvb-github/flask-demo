var chart_right = echarts.init(document.getElementById("chart-right"))
var app = {};
option_right = null;
var colors = [ '#675bba'];
var symbolSize = 20;
var elec_propagate_loss_data = [[0, 0], [40, 190], [62, 10], [95, 185], [120, 15],[148,190],[170,18],[200,150]];

function nextElecData(){
	if(updateCount<5){
		updateCount ++;
	}else{
		elec_propagate_loss_data[0] = [Math.floor(Math.random()*10-5+10),Math.floor(Math.random()*50-25+25)];
		elec_propagate_loss_data[1] = [Math.floor(Math.random()*10-5+40),Math.floor(Math.random()*50-25+150)];
		elec_propagate_loss_data[2] = [Math.floor(Math.random()*10-5+60),Math.floor(Math.random()*50-25+25)];
		elec_propagate_loss_data[3] = [Math.floor(Math.random()*10-5+90),Math.floor(Math.random()*50-25+150)];
		elec_propagate_loss_data[4] = [Math.floor(Math.random()*10-5+130),Math.floor(Math.random()*50-25+25)];
		elec_propagate_loss_data[5] = [Math.floor(Math.random()*10-5+150),Math.floor(Math.random()*50-25+150)];
		elec_propagate_loss_data[6] = [Math.floor(Math.random()*10-5+175),Math.floor(Math.random()*50-25+25)];
		elec_propagate_loss_data[7] = [Math.floor(Math.random()*10-5+190),Math.floor(Math.random()*50-25+150)];
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
				  data: ['电磁波损失'],
				  left: 10,
				  textStyle:{lineStyle:{  
												 color:'#729BA9'  
											 }  }
				 
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
				  name:'(高度：m)',
				  min: 0,
				  max: 200,
				  type: 'value',
				  minInterval:50,
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
					  name: '高度',
					  id: 'a',
					  type: 'line',
					  smooth: true,
					  data: elec_propagate_loss_data
				  }
			  ]
};
			
			
			setTimeout(function () {
			  // Add shadow circles (which is not visible) to enable drag.
			  chart_right.setOption({
				  graphic: echarts.util.map(elec_propagate_loss_data, function (item, dataIndex) {
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
				  graphic: echarts.util.map(elec_propagate_loss_data, function (item, dataIndex) {
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
			  data[dataIndex] = chart_right.convertFromPixel('grid', this.position);
			
			  // Update data
			  chart_right.setOption({
				  series: [{
					  id: 'a',
					  data: elec_propagate_loss_data
				  }]
			  });
			};
			
			chart_right.setOption(option_right, true);
			

			function setoption(){
				nextvalue();
				nextElecData();
				console.log(ifUpdate);
				if(ifUpdate){
					document.getElementById('chart-left').removeAttribute('_echarts_instance_');
					document.getElementById('chart-right').removeAttribute('_echarts_instance_');
					var chart_left = echarts.init(document.getElementById("chart-left"))
					var chart_right = echarts.init(document.getElementById("chart-right"))
					chart_left.setOption(option_left,true);
					chart_right.setOption(option_right,true);
					console.log(refractionData)
					ifUpdate = false;
				}	
			}
			self.setInterval("setoption()", 1000)	