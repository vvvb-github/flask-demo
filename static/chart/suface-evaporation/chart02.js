var myChart2 = echarts.init(document.getElementById("chart2"));
// 在html文件中已经定义了高度Height与对应的大气折射率Refraction

var merge_data = []
function showmeteo()
{
	document.getElementById("tem").innerText = MeteoData.tem.toString().substring(0, 5) + 'K';
	document.getElementById("hum").innerText = MeteoData.hum.toString().substring(0, 5) + "%";
	document.getElementById("wind").innerText = MeteoData.wind.toString().substring(0, 5) + 'm/s';
	document.getElementById("press").innerText = MeteoData.press.toString().substring(0, 5) + 'hPa';
	SD.push("表面波导");
	ED.push("悬空波导");
	// SD -> 表面波导数据， ED -> 悬空波导数据
	merge_data = [SD, ED];
	// document.getElementById("height").innerText = height[data_num-1].toString().substring(0, 5) + 'm';
}

function nextvalue(newdata){
	//alert('nextvalue')
    document.getElementById("tem").innerText = newdata.tem.toString().substring(0, 5) + 'K';
    document.getElementById("hum").innerText = newdata.hum.toString().substring(0, 5) + "%";
    document.getElementById("wind").innerText = newdata.wind.toString().substring(0, 5) + 'm/s';
    document.getElementById("press").innerText = newdata.press.toString().substring(0, 5) + 'hPa';
    newdata.sd.push("表面波导");
    newdata.ed.push("悬空波导");
    merge_data = [newdata.sd, newdata.ed]
    Refraction = newdata.refraction
}
// echarts 左图
option2 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    legend: {
        data: ['大气折射指数'],
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

    xAxis: [
        {
            name: 'dN/dz',
            type: 'value',
            boundaryGap: false,
            axisLine: {onZero: true},
        },
    ],
    yAxis: [
        {
            name: '高度(m)',
            type: 'value',
        }
    ],

    series: [
        {
            name: '大气折射指数',
            type: 'line',
            hoverAnimation: false,
            data: Refraction,
            itemStyle: {
            	normal:{
            		 color: '#00CED1'
            	}
            },
        },
    ]
};
