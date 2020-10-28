var chart2 = echarts.init(document.getElementById("main"))
				
				var RSME = [];
				var MAPE = [];
				function getRSME(y, y_hat){
					return Math.abs(y - y_hat)
				}
				function getMAPE(y, y_hat){
					return Math.abs(y - y_hat) / Math.abs(y) * 100
				}
				function getR2_total(){
					num = count(timeData)
					sum=0
					for(i=0;i<num;i++){
						sum = sum + actual[i]
					}
					mean = sum/num
					up = 0
					down = 0
					for(i=0;i<num;i++){
						up = up + (actual[i] - forecast[i])*(actual[i] - forecast[i])
						down = down + (actual[i] - mean)*(actual[i] - mean)
					}
					R2_total = 1 - up/down
					return R2_total
				}
				
				function getMAP_total(){
					num = count(timeData)
					MAP_total = 0
					for(i=0;i<num;i++){
						MAP_total = MAP_total + Math.abs(actual[i] - forecast[i])/actual[i]
					}
					MAP_total = MAP_total/num
					return MAP_total
				}
				
				function getMAPE_total(){
					num = count(timeData)
					MAPE_total = 0
					for(i=0;i<num;i++){
						MAPE_total = MAPE_total + Math.abs(actual[i] - forecast[i])
					}
					MAPE_total = MAPE_total/num
					return MAPE_total
				}
				
				function getRSME_total(){
					num = count(timeData)
					RSME_total = 0
					for(i=0;i<num;i++){
						RSME_total = RSME_total + (actual[i] - forecast[i]) * (actual[i] - forecast[i])
					}
					RSME_total = Math.sqrt(RSME_total/num)
					return RSME_total
				}
				
				function Total(){
					RMSE_html = document.getElementById("rmse");
					MAPE_html = document.getElementById("mape");
					MAP_html = document.getElementById("map");
					NV_html = document.getElementById("nextvalue");
					R2_html = document.getElementById("r2");
					R2_total = getR2_total()
					
					MAPE_total = getMAPE_total()
					
					MAP_total = getMAP_total()
					RMSE_total = getRSME_total()

					RMSE_html.value = RMSE_total.toString().substring(0, 6)

					MAPE_html.value = (MAPE_total * 100).toString().substring(0, 6) + "%"
					MAP_html.value = MAP_total.toString().substring(0, 6)
					R2_html.value = (R2_total * 100).toString().substring(0, 6) + "%"
					NextValue = Math.random() * 100
					NV_html.value = NextValue.toString().substring(0, 6)
				}
				function push_RSME_MAPE(){
					num = count(timeData)
					i = 0
					while (i < num) {
					  i++
					  RSME.push(getRSME(actual[i], forecast[i]))
					  MAPE.push(getMAPE(actual[i], forecast[i]))
					}
				}
				
			function renew_RSME_MAPE(){
					num = count(timeData)
					if(num > 300){
						RSME.shift()
						MAPE.shift()
						RSME.push(getRSME(actual[num-1], forecast[num-1]))
						MAPE.push(getMAPE(actual[num-1], forecast[num-1]))
					}
					else{
						//alert(getRSME(actual[num-1], forecast[num-1]))
						RSME.push(getRSME(actual[num-1], forecast[num-1]))
						MAPE.push(getMAPE(actual[num-1], forecast[num-1]))
					}
				}
				
			option1 = {
				title: {
				  text: "蒸发波导高度预测评估",
				  left: 'center'
				},
				tooltip: {
				  trigger: "axis"
				},
				grid: [
				  {
					left: "5%",
					top: "20%",
					width: "40%",
					height: "70%"
				  },
				  {
					left: "55%",
					top: "20%",
					width: "40%",
					height: "70%"
				  }
				],
				xAxis: [
				  {
					data: timeData,
				  },
				  {
					gridIndex: 1,
					data: timeData,
				  }
				],
				yAxis: [
				  {
						gridIndex:0,
						name: "RSME",
						//splitLine: {
					  //show: false
					  //}
				  },
				  {
					name: "MAPE(%)",
					gridIndex: 1,
					//splitLine: {
					//  show: false
					//}
				  }
				],
				toolbox: {
				  left: "right",
				  feature: {
					dataZoom: {
					  yAxisIndex: "none"
					},
					restore: {},
					saveAsImage: {}
				  }
				},
				dataZoom: [
				  {
						type: 'inside',
						show: true,
						realtime: true,
						start: 90,
						end: 100,
						xAxisIndex: [0, 1]
				  },
				  {
						
						show: true,
						realtime: true,
						start: 90,
						end: 100,
						xAxisIndex: [0, 1]
				  }
				],
				visualMap: [
				  {
					seriesIndex: 0,
					top: "8%",
					right: 600,
					pieces: [
					  {
						gt: 0,
						lte: 3,
						color: "#096"
					  },
					  {
						gt: 3,
						lte: 5,
						color: "#ffde33"
					  },
					  {
						gt: 5,
						lte: 7,
						color: "#ff9933"
					  },
					  {
						gt: 7,
						color: "#660099"
					  }
					],
					outOfRange: {
					  color: "#999"
					}
				  },
				  {
					seriesIndex: 1,
					top: "8%",
					right: 50,
					pieces: [
					  {
						gt: 0,
						lte: 10,
						color: "#096"
					  },
					  {
						gt: 10,
						lte: 25,
						color: "#ffde33"
					  },
					  {
						gt: 25,
						lte: 50,
						color: "#ff9933"
					  },
					  {
						gt: 50,
						color: "#660099"
					  }
					],
					outOfRange: {
					  color: "#999"
					}
				  }
				],
				series: [
				  {
					name: "RSME",
					type: "bar",
					data: RSME
				  },
				  {
					name: "MAPE",
					type: "bar",
					xAxisIndex: 1,
					yAxisIndex: 1,
					data: MAPE
				  }
				]
				}

function setoption(timeData){
	newtime(timeData);
	nextvalue();
	renew_RSME_MAPE()
	Total()
	chart1.setOption(option)
	chart2.setOption(option1)
}

push_RSME_MAPE()
Total()
//chart_right.setOption(option);
setoption(timeData)

self.setInterval("setoption(timeData)", 2000)
				