$(function() {
    var dom = document.getElementById('chart-container');
    var myChart = echarts.init(dom, null, {
                renderer: 'canvas',
                useDirtyRect: false
                });
    var app = {};
    var ROOT_PATH = '.';
    var option;


if ('EventSource' in window) { 
    const url = './beijing_stream'
    const chartData = [];
    var idx = 1;
    var source = new EventSource(url, { withCredentials: true });
    source.addEventListener('message', function (event) {
        var data = eval(event.data);
        // handle message
        // debugger;
        chartData.push(data)
        // console.log((idx++) + "- Receive data: ", data, chartData)
         render(chartData);
    }, false);

    
    source.addEventListener('open', function (event) {
        console.log((idx++) + 'Sse open: ' + event);   
    }, false);

    source.addEventListener('error', function (event) {
        console.error((idx++) + "- Error: " , event); 
    }, false);

    
    // source.addEventListener('foo', function (event) {
    // var data = event.data;
    // // handle message
    // }, false); 
}

function render(data) {
    myChart.setOption(
      (option = {
        title: {
          text: 'Beijing AQI',
          left: '1%'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '5%',
          right: '15%',
          bottom: '10%'
        },
        xAxis: {
          data: data.map(function (item) {
            return item[0];
          })
        },
        yAxis: {},
        toolbox: {
          right: 10,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: [
          {
            startValue: '2000-01-01'
          },
          {
            type: 'inside'
          }
        ],
        visualMap: {
          top: 50,
          right: 10,
          pieces: [
            {
              gt: 0,
              lte: 50,
              color: '#93CE07'
            },
            {
              gt: 50,
              lte: 100,
              color: '#FBDB0F'
            },
            {
              gt: 100,
              lte: 150,
              color: '#FC7D02'
            },
            {
              gt: 150,
              lte: 200,
              color: '#FD0100'
            },
            {
              gt: 200,
              lte: 300,
              color: '#AA069F'
            },
            {
              gt: 300,
              color: '#AC3B2A'
            }
          ],
          outOfRange: {
            color: '#999'
          }
        },
        series: {
          name: 'Beijing AQI',
          type: 'line',
          data: data.map(function (item) {
            return item[1];
          }),
          markLine: {
            silent: true,
            lineStyle: {
              color: '#333'
            },
            data: [
              {
                yAxis: 50
              },
              {
                yAxis: 100
              },
              {
                yAxis: 150
              },
              {
                yAxis: 200
              },
              {
                yAxis: 300
              }
            ]
          }
        }
      })
    );
  }

if (option && typeof option === 'object') {
  myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);
})