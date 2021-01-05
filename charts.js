var dom = document.getElementById("container");
var myChart = echarts.init(dom);
var app = {};
option = null;

var colorList = [
	"#4ea397",
	"#22c3aa",
	"#7bd9a5",
	"#d0648a",
	"#f58db2",
	"#f2b3c9"
]
var labelFont = 'bold 12px Sans-serif';

function calculateMA(dayCount, data) {
	var result = [];
	for (var i = 0, len = data.length; i < len; i++) {
		if (i < dayCount) {
			result.push('-');
			continue;
		}
		var sum = 0;
		for (var j = 0; j < dayCount; j++) {
			sum += data[i - j][1];
		}
		result.push((sum / dayCount).toFixed(2));
	}
	return result;
}

let loadData = function() {
	let dates = []
	let data = []
	let volumes = []
	let upper = []
	let median = []
	let lower = []
	let signal = []
	// 取配置的列头

	let time_header = document.getElementById("time").value;
	let high_header = document.getElementById("high").value;
	let low_header = document.getElementById("low").value;
	let open_header = document.getElementById("open").value;
	let close_header = document.getElementById("close").value;
	let volume_header = document.getElementById("volume").value;
	let upper_header = document.getElementById("upper").value;
	let median_header = document.getElementById("median").value;
	let lower_header = document.getElementById("lower").value;
	let signal_header = document.getElementById("signal").value;

	let param = {}
	param[time_header] = 0
	param[high_header] = 0
	param[low_header] = 0
	param[open_header] = 0
	param[close_header] = 0
	param[volume_header] = 0
	param[upper_header] = 0
	param[median_header] = 0
	param[lower_header] = 0
	param[signal_header] = 0


	let file = document.getElementById("file").files[0];
	Papa.parse(file, {
		download: true,
		complete: function(results) {
			let all = results.data, html;
			console.log(all)
			str =''
			all[0].forEach((name, index, arr)=>{
				str = str + '<td>'+name+'</td>'
				if(param[name] == 0){
				  param[name] = index
				}
			})
			console.log(param)
			document.getElementById("list").innerHTML=str;
			for(let n = 0; n<100000; n++){
				if(n == 0) continue
				item = all[n]
				dates.push(item[param[time_header]])
				upper.push(item[param[upper_header]])
				median.push(item[param[median_header]])
				lower.push(item[param[lower_header]])
				data.push([item[param[open_header]], item[param[close_header]], item[param[low_header]], item[param[high_header]], item[param[volume_header]]])
				volumes.push(item[param[volume_header]])
				if (item[param[signal_header]] && item[param[signal_header]] == 1){
					signal.push({name: '买', value: '买', xAxis: item[param[time_header]], yAxis: parseFloat(item[param[high_header]])})
				} else if (item[param[signal_header]] && item[param[signal_header]] == -1){
					signal.push({name: '卖', value: '卖', xAxis: item[param[time_header]], yAxis: parseFloat(item[param[high_header]])})
				} else if (item[param[signal_header]] && item[param[signal_header]] == 0){
					signal.push({name: '平', value: '平', xAxis: item[param[time_header]], yAxis: parseFloat(item[param[high_header]])})
				}
			}
			console.log(dates)
			console.log(data)
			console.log(volumes)
			option = {
				animation: false,
				color: colorList,
				tooltip: {
					triggerOn: 'none',
					transitionDuration: 0,
					confine: true,
					bordeRadius: 4,
					borderWidth: 1,
					borderColor: '#333',
					backgroundColor: 'rgba(255,255,255,0.9)',
					textStyle: {
						fontSize: 12,
						color: '#333'
					},
					position: function (pos, params, el, elRect, size) {
						var obj = {
							top: 60
						};
						obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
						return obj;
					}
				},
				axisPointer: {
					link: [{
						xAxisIndex: [0, 1]
					}]
				},
				dataZoom: [{
					type: 'slider',
					xAxisIndex: [0, 1],
					realtime: false,
					start: 0,
					end: 20,
					top: 10,
					height: 10,
					backgroundColor: "rgba(255,255,255,0)",
					dataBackgroundColor: "rgba(222,222,222,1)",
					fillerColor: "rgba(114,230,212,0.25)",
					handleColor: "#cccccc",
					handleSize: "120%",
					textStyle: {
						color: "#999999"
					}
				},{
					type: 'inside',
					xAxisIndex: [0, 1],
					start: 40,
					end: 70,
					top: 30,
					height: 20
				}],
				xAxis: [{
					type: 'category',
					data: dates,
					boundaryGap : false,
					axisLine: { lineStyle: { color: '#777' } },
					// axisLabel: {
					//     formatter: function (value) {
					//         return echarts.format.formatTime('YYYY-MM-dd hh:mm:ss', value);
					//     }
					// },
					min: 'dataMin',
					max: 'dataMax',
					axisPointer: {
						show: true
					}
				}, {
					type: 'category',
					gridIndex: 1,
					data: dates,
					scale: true,
					boundaryGap : false,
					splitLine: {show: false},
					axisLabel: {show: false},
					axisTick: {show: false},
					axisLine: { lineStyle: { color: '#777' } },
					splitNumber: 20,
					min: 'dataMin',
					max: 'dataMax',
					axisPointer: {
						type: 'shadow',
						label: {show: false},
						triggerTooltip: true,
						handle: {
							show: true,
							margin: 30,
							color: '#B80C00'
						}
					}
				}],
				yAxis: [
					{
						scale: true,
						splitNumber: 10,
						axisLine: { lineStyle: { color: '#777' } },
						splitLine: { show: true },
						axisTick: { show: false },
						axisLabel: {
							inside: true,
							formatter: '{value}\n'
						}
					}, {
						scale: true,
						gridIndex: 1,
						splitNumber: 20,
						axisLabel: {show: false},
						axisLine: {show: false},
						axisTick: {show: false},
						splitLine: {show: false}
					}
				],
				grid: [{
					left: 20,
					right: 20,
					top: 110,
					height: 600
				}, {
					left: 20,
					right: 20,
					height: 40,
					top: 760
				}],
				series: [{
					name: 'Volume',
					type: 'bar',
					xAxisIndex: 1,
					yAxisIndex: 1,
					itemStyle: {
						color: '#7fbe9e'
					},
					emphasis: {
						itemStyle: {
							color: '#140'
						}
					},
					data: volumes
				}, {
					type: 'candlestick',
					name: '日K',
					data: data,
					markPoint: {
						data: signal
					},
					itemStyle: {
						"color": "#d0648a",
						"color0": "transparent",
						"borderColor": "#d0648a",
						"borderColor0": "#22c3aa",
						"borderWidth": "1"
					},
					emphasis: {
						itemStyle: {
							color: 'black',
							color0: '#444',
							borderColor: 'black',
							borderColor0: '#444'
						}
					}
				},{
					data: upper,
					type: 'line',
					itemStyle : {
						normal : {
							lineStyle:{
								color:'#b6a2de'
							}
						}
					}
				},{
					data: median,
					type: 'line',
					itemStyle : {
						normal : {
							lineStyle:{
								color:'#ffb980'
							}
						}
					}
				}, {
					data: lower,
					type: 'line',
					itemStyle : {
						normal : {
							lineStyle:{
								color:'#d87a80'
							}
						}
					}
				}
				]
			};
			;
			if (option && typeof option === "object") {
				myChart.setOption(option, true);
			}

		}
	});
}

