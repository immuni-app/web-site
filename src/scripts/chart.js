import Chart from 'chart.js';
import "chartjs-chart-geo";
import { feature } from "topojson-client";
import generalInfo from './../assets/json/general_info.json';
import downloadDataset from './../assets/json/download_trend.json';
var moment = require('moment');


const labels = {
	it: {
		day: "Giorni"
	},
	en: {
		day: "Day"
	},
	de: {
		day: "Tage"
	},
	fr: {
		day: "Journées"
	},
	es: {
		day: "Dias"
	},
};

function valueFormat(labelValue) {
	return labelValue.toLocaleString()
	
}

function generateChartConfig(labels, data, valueLabel, xLabel, yLabel) {
	return {
		type: 'line',
		data: {
			labels: labels,
			datasets: data
		},
		options: {
			responsive: true,
			title: {
				display: false,
			},
			tooltips: {
				mode: 'index',
				intersect: false,
				backgroundColor: "#182C57",
				displayColors: false,
				callbacks: {
					label: function (tooltipItem, data) {

						return Number(tooltipItem.yLabel).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " " + valueLabel;
					}
				}
			},
			legend: {
				display: false
			},
			hover: {
				mode: 'nearest',
				intersect: true
			},
			scales: {
				xAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: xLabel
					}
				}],
				yAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: yLabel
					},
					ticks: {
						callback: function (value) {
							return valueFormat(value)
						}
					}
				}]
			}
		}
	};
}






window.onload = function () {
	
	const lang = localStorage.getItem("language");
	let lastDate = Object.keys(downloadDataset).sort().pop();
	let lastValue = downloadDataset[lastDate];
	

	let nOfDownload = document.getElementById('nOfDownload')
	if (nOfDownload) {
		nOfDownload.innerHTML =  Number(lastValue.total).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
	} 

	let sentNotifications = document.getElementById('sentNotifications')
	if (sentNotifications) {
		sentNotifications.innerHTML =  valueFormat(generalInfo.sentNotifications);
	} 

	let positiveUsers = document.getElementById('positiveUsers')
	if (positiveUsers) {
		positiveUsers.innerHTML =  valueFormat(generalInfo.positiveUsers);
	} 


	moment.locale(lang); 
	

	let lastUpdateDiv = document.getElementById('lastUpdate')
	if (lastUpdateDiv) {
		let lastDate = Object.keys(downloadDataset).sort().pop();
		var lastUpdate = moment(lastDate)
		lastUpdateDiv.innerHTML =  lastUpdate.format('DD MMMM YYYY')
	} 


	let downloadTrendDiv = document.getElementById('downloadTrend')
	if (downloadTrendDiv) {
		var downloadTrend = downloadTrendDiv.getContext('2d');
		//var notificationTrend = document.getElementById('notificationTrend').getContext('2d');
		var downloadLabels = []
		var downloadData = []
		var iosDownload = []
		var androidDownload = []
		Object.keys(downloadDataset).forEach(function (day) {
			var ios_value = downloadDataset[day].ios;
			var android_value = downloadDataset[day].android;
			var total = downloadDataset[day].total;
			day = moment(day).format('ll');
			downloadLabels.push(day);
			downloadData.push(total);
			
			iosDownload.push(ios_value)
			androidDownload.push(android_value)
		})

		downloadData = downloadData.slice(Math.max(downloadData.length - 7, 0))
		downloadLabels = downloadLabels.slice(Math.max(downloadLabels.length - 7, 0))

		let dataset = [{
			data: downloadData,
			fill: true,
			borderColor: "#5751ff",
			backgroundColor: "rgba(68,110,255,0.4)",
			pointRadius: 5,
			pointHoverRadius: 6,
			pointBackgroundColor: "#5751ff",

		}]
		window.configDownloadTrend = generateChartConfig(downloadLabels, dataset, "download", labels[lang].day, "Download")
		window.downloadTrendChart = new Chart(downloadTrend, configDownloadTrend);		
	} 



	
	
	
};




export function updateChartLang() {

	const lang = localStorage.getItem("language");
	moment.locale(lang); 
	
	let lastUpdateDiv = document.getElementById('lastUpdate')
	if (lastUpdateDiv) {
		let lastDate = Object.keys(downloadDataset).sort().pop();
		var lastUpdate = moment(lastDate)
		lastUpdateDiv.innerHTML =  lastUpdate.format('DD MMMM YYYY')
	} 


	var downloadLabels = []
	var downloadData = []
	Object.keys(downloadDataset).forEach(function (day) {
		var total = downloadDataset[day].total;
		day = moment(day).format('ll');
		downloadLabels.push(day);
		downloadData.push(total);
	})

	downloadData = downloadData.slice(Math.max(downloadData.length - 7, 0))
	downloadLabels = downloadLabels.slice(Math.max(downloadLabels.length - 7, 0))

	if(window.configDownloadTrend){
		window.configDownloadTrend.data.labels = downloadLabels;
		window.configDownloadTrend.options.scales.xAxes[0].scaleLabel.labelString = labels[lang].day;
		window.downloadTrendChart.update();
	}
	

  }