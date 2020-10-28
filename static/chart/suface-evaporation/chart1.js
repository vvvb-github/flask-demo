 var dom = document.getElementById("chart1");
 var myChart1 = echarts.init(dom);
 var tem = [];
 var hum = [];
 var press =[];
 
 option1 = {
	 tooltip: {
		 trigger: 'axis',
		 axisPointer: {
			 animation: false
		 }
	 },
	 legend: {
		 data: ['高度(温)', '高度(湿)', '高度(压)'],
		 left: 10
	 },
	 toolbox: {
		 feature: {
			 dataZoom: {
				 yAxisIndex: 'none'
			 },
			 magicType: {type: ['line', 'bar']},
			 restore: {},
			 saveAsImage: {}
		 }
	 },
	 axisPointer: {
		 link: {xAxisIndex: 'all'}
	 },
	 
	 grid: [{
		 left: '5%',
		 width:'25%',
	 }, {
		 left: '36%',
		 width: '25%',
	 }, {
		 left: '68%',
		 width: '25%',
	 }],
	 xAxis: [
		 {
			 name: '温度(K)',
			 type: 'value',
			 boundaryGap: false,
			 axisLine: {onZero: true},
			 max:298,
			 min:260,
		 },
		 {
			 gridIndex: 1,
			 name: '湿度(%)',
			 type: 'value',
			 boundaryGap: false,
			 axisLine: {onZero: true},
			 max:100,
			 min:0,
		 },
		 {
			 gridIndex: 2,
			 name: '压强(hPa)',
			 type: 'value',
			 boundaryGap: false,
			 axisLine: {onZero: true},
			 max:1200,
			 min:500,
		 }
	 ],
	 yAxis: [
		 {
			 name: '高度(m)',
			 type: 'value',
		 },
		 {
			 gridIndex: 1,
			 name: '高度(m)',
			 type: 'value',
		 },
		 {
			 gridIndex: 2,
			 name: '高度(m)',
			 type: 'value',
		 }
	 ],
	 dataZoom: [{
		 show: true,
		 type: 'inside',
		 filterMode: 'none',
		 xAxisIndex: [0,1,2],
	 }, {
		 show: true,
		 type: 'inside',
		 filterMode: 'none',
		 yAxisIndex: [0,1,2],
	 }],
	 series: [
		 {
			 name: '高度(温)',
			 type: 'line',
			 symbolSize: 1,
			 hoverAnimation: false,
			 data:tem
		 },
		 {
			 name: '高度(湿)',
			 type: 'line',
			 xAxisIndex: 1,
			 yAxisIndex: 1,
			 symbolSize: 1,
			 hoverAnimation: false,
			 data:hum
		 },
		 {
			 name: '高度(压)',
			 type: 'line',
			 xAxisIndex: 2,
			 yAxisIndex: 2,
			 symbolSize: 1,
			 hoverAnimation: false,
			 data:press
		 }
	 ]
 };;
  function setChart1(){
	 tem.length = 0
	 hum.length = 0
	 press.length = 0
 	 var wind;
 	 height = 2500;
 	 t1 = 260 + Math.random() * 10 
 	 h1 = 90
 	 p1 = 100
 	 while(height>0){
 	 	 height -= 50;
 	 	 temp = 33 / 2500 * Math.random();
 	 	 humi = 1/250 * Math.random();
 	 	 t1 += temp * 40;
 	 	 h1 -= humi * 40;
 	 	 p1 = 1000 - height/5 + Math.random()*50;
 	 	 tem.push([t1, height]);
 	 	 hum.push([h1, height]);
 	 	 press.push([p1, height]);
 	 }
 	 wind = Math.random() * 50
 	 document.getElementById("tem").innerHTML = t1.toString().substring(0, 6) + "K"
 	 document.getElementById("hum").innerHTML = h1.toString().substring(0, 6) + "%"
 	 document.getElementById("press").innerHTML = p1.toString().substring(0, 6) + "hPa"
 	 document.getElementById("wind").innerHTML = wind.toString().substring(0, 6) + "m/s"
 	 myChart1.setOption(option1)
 }
  //setChart1()