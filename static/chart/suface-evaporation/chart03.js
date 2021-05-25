var myChart3 = echarts.init(document.getElementById("chart3"));

function count(o){
    var t = typeof o;
    if(t == 'string'){
        return o.length;
    }
    else if(t == 'object'){
        var n = 0;
        for(var i in o){
            n++;
        }
        return n;
    }
    return false;
}
showmeteo()
var colorList = ['#9370DB', '#FFDEAD'];

merge_data = merge_data.map(function (item, index) {
    return {
        value: item,
        itemStyle: {
            color: colorList[index],
        }
    };
});

function renderItem(params, api) {
    var yValue = api.value(2);
    // 加上0.1的偏移，防止堵塞坐标值
    var start = api.coord([0, api.value(1)]);
    var size = api.size([yValue, api.value(1)-api.value(0)]);
    var style = api.style();
    return {
        type: 'rect',
        shape: {
            x: start[0],
            y: start[1],
            width: size[0],
            height: size[1]
        },
        style: style
    };
}

option3 = {
    title: {
        text: '表面波导与悬空波导信息',
        subtext: '高度与强度信息',
        left: 'center'
    },
    toolbox:{
        show:true,
        orient:'vertical',
        itemSize:20,
        showTitle:true,
        feature: {
            saveAsImage: {
                show: true,
                title: '保存为图片'
            },
            dataView: {
                show: true,
                title: '数据查阅'
            },
        },
    },
    tooltip: {
    },
    legend:{
        data:["表面波导", "悬空波导"]
    },
    xAxis: {
        scale: true,
        min:0,
        name:'大气波导强度',
        nameLocation:'end',
        //type:category
    },
    yAxis: {
        scale: true,
        name:'大气波导高度',

        //type:category
    },
    itemStyle:{
        borderRadius:5,
        borderColor:'#E6E6FA',
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 4,
        opacity:0.5
    },
    series: [{
        type: 'custom',
        renderItem: renderItem,
        label: {
            show: false,
            position: 'top'
        },
        dimensions: ['波导底高', '波导顶高', '波导强度'],
        encode: {
            x: 2,
            y: [0, 1],
            tooltip: [0, 1, 2],
            itemName: 3
        },
        data: merge_data
    }]
};
console.log(merge_data)
// 初始化加载时加载数据
myChart2.setOption(option2);
myChart3.setOption(option3);
// 被调用时显示数据
function setoption(newdata){
	nextvalue(newdata);
	option2.series.data = Refraction;
	merge_data = merge_data.map(function (item, index) {
    return {
        value: item,
        itemStyle: {
            color: colorList[index],
        }
    };
});
    option3.series.data = merge_data;
    console.log(merge_data);
	myChart2.setOption(option2, true);
	myChart3.setOption(option3, true);
}

// 接受前端发送的数据
$(document).ready(function() {
    namespace = '/surface';
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace, {transports: ['websocket']});
    socket.on('server_response', function(res) {
        var basicdata = res.surf;
        console.log(basicdata)
        setoption(basicdata)
    });
});
