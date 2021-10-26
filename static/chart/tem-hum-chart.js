// HPC热力图
let Chart_hum = null
let Chart_tem = null
if(chart_data.flag === 'HPC'){
  Chart_hum = echarts.init(document.getElementById('echarts-hum'));
}else{
  Chart_tem = echarts.init(document.getElementById('echarts-tem'));
}

// TPC热力图


option_hum = {
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      console.log(params)
      params = params[0]
      return (
      "时间:" +
      "<br/>高度" + chart_data.dataset[params.dataIndex][1] +
      "<br/>湿度" + chart_data.dataset[params.dataIndex][2]
      )},
    axisPointer: {
        animation: false
    }
  },
  title: {
        text: '大气湿度廓线图',
        left: 'center',
        top: 0
  },
  visualMap: {
  min: chart_data.min,
  max: chart_data.max,
  orient: 'vertical',
  right: 10,
  top: 'center',
      text: ['HIGH', 'LOW'],
      calculable: true,
      inRange: {
        color: ['#d92c2c', '#d95a2c', '#d9742c','#d9882c',
                'rgb(217,208,44)','#aed92c','#80d92c', '#2cd963',
                '#2cd9a5','#2cd4d9','#2ca5d9', '#2c49d9']
      }
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'cross'
      }
    },
    xAxis: [
      {
        max: chart_data.date_max,
        name: '时间戳',
        splitLine:{
          show:false
        },
        type: 'value'
      }
    ],
    yAxis: [
      {
        name: '高度(m)',
        splitLine:{
          show:false
        },
        type: 'value'
      }
    ],
    series: [
      {
        name: '大气湿度',
        type: 'scatter',
        symbolSize: 12,
        data: chart_data.dataset
      }
    ]
  };

option_tmp = {
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      console.log(params)
      params = params[0]
      return (
      "时间:" +
      "<br/>高度" + chart_data.dataset[params.dataIndex][1] +
      "<br/>温度" + chart_data.dataset[params.dataIndex][2]
      )},
    axisPointer: {
        animation: false
    }
  },
  title: {
        text: '大气温度廓线图',
        left: 'center',
        top: 0
  },
  visualMap: {
  min: chart_data.min,
  max: chart_data.max,
  orient: 'vertical',
  right: 10,
  top: 'center',
      text: ['HIGH', 'LOW'],
      calculable: true,
      inRange: {
         color: [
        '#313695',
        '#4575b4',
        '#74add1',
        '#abd9e9',
        '#e0f3f8',
        '#ffffbf',
        '#fee090',
        '#fdae61',
        '#f46d43',
        '#d73027',
        '#a50026']
      }
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'cross'
      }
    },
    xAxis: [
      {
        max: chart_data.date_max,
        name: '时间戳',
        splitLine:{
          show:false
        },
        type: 'value'
      }
    ],
    yAxis: [
      {
        name: '高度(m)',
        splitLine:{
          show:false
        },
        type: 'value'
      }
    ],
    series: [
      {
        name: '大气温度',
        type: 'scatter',
        symbolSize: 12,
        data: chart_data.dataset
      }
    ]
  };


if (chart_data.flag === 'HPC'){
  Chart_hum.setOption(option_hum)
}else{
  Chart_tem.setOption(option_tmp)
}

