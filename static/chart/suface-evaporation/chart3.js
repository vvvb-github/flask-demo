var dom = document.getElementById("chart3");
var myChart3 = echarts.init(dom);

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
var dataAll = [
 [
	 [370, 100],
	 [368, 90],
	 [370, 78],
	 [375, 75],
	 [380, 50],
	 [377, 30],
	 [380, 20],
	 [378, 18],
	 [383, 13],
	 [385, 2],
	 
 ],
 [
	 [410, 10],
	 [390, 90],
	 [400, 175],
	 [417, 200],
	 [413, 240],
	 [420, 270],
	 [430, 330],
	 [450, 420],
	 [455, 480],
	 [460, 470],
	 [475, 560],
	 [477, 545],
	 [480, 600],
	 [470, 660],
	 [472, 665],
	 [475, 670],
	 [477, 690],
	 [480, 820],
	 [495, 950],
	 [510, 975],
	 [515, 990],
	 [505, 1050],
	 [508, 1090],
	 [510, 1140],
 ],

];

var newdata1 = []
var newdata2 = []
option3 = {
 legend: {
	 data: ['表面波导', '悬空波导'],
	 left: 10
 },
 grid: [{
	 left: '5%',
	 width:'38%',
 }, {
	 left: '55%',
	 width: '38%',
 }],
 tooltip: {
	 formatter: 'Group {a}: ({c})'
 },
xAxis: [
	 {
		 name: 'Refractivity(M-units)',
		 type: 'value',
		 boundaryGap: false,
		 axisLine: {onZero: true},
		 //max:365,
		 min:365,
	 },
	 {
		 gridIndex: 1,
		 name: 'Refractivity(M-units)',
		 type: 'value',
		 boundaryGap: false,
		 axisLine: {onZero: true},
		 //max:380,
		 min:380,
	 }
 ],
 yAxis: [
	 {
		 name: '高度(m)',
		 type: 'value',
		 min:0,
		 max:100
	 },
	 {
		 gridIndex: 1,
		 name: '高度(m)',
		 type: 'value',
		 min:0,
		 max:1200
	 }
 ],
 series: [
	 {
		 name: 'I',
		 type: 'line',
		 xAxisIndex: 0,
		 yAxisIndex: 0,
		 data: newdata1,
		 // markLine: markLineOpt,
		 smooth:true
	 },
	 {
		 name: 'II',
		 type: 'line',
		 xAxisIndex: 1,
		 yAxisIndex: 1,
		 data: newdata2,
		 smooth:true
		 // markLine: markLineOpt
	 }
 ]
};;

function setChart3(){
	num1 = count(dataAll[0])
	num2 = count(dataAll[1])
	newdata1.length = 0
	newdata2.length = 0
	for(i=0;i<num1;i++){
		x1 = dataAll[0][i][0] + Math.random()*dataAll[0][i][0] * 0.1*2
		y1 = dataAll[0][i][1] + Math.random()*dataAll[0][i][1] * 0.1*2
		newdata1.push([x1, y1])
	}
	for(i=0;i<num2;i++){
		x2 = dataAll[1][i][0] + Math.random()*dataAll[1][i][0] * 0.05*2
		y2= dataAll[1][i][1] + Math.random()*dataAll[1][i][1] * 0.01*2
		newdata2.push([x2, y2])
	}
	myChart3.setOption(option3)
}

function UpdataAll(){
	setChart1()
	setChart2()
	setChart3()
}
self.setInterval("UpdataAll()", 2000)
