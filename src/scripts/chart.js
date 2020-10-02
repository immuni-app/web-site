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
	// Nine Zeroes for Billions
	return Math.abs(Number(labelValue)) >= 1.0e+9

		? Math.abs(Number(labelValue)) / 1.0e+9 + "B"
		// Six Zeroes for Millions 
		: Math.abs(Number(labelValue)) >= 1.0e+6

			? Math.abs(Number(labelValue)) / 1.0e+6 + "M"
			// Three Zeroes for Thousands
			: Math.abs(Number(labelValue)) >= 1.0e+3

				? Math.abs(Number(labelValue)) / 1.0e+3 

				: Math.abs(Number(labelValue));

}

function generateChartConfig(labels, data, valueLabel, xLabel, yLabel) {
	return {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				data: data,
				fill: true,
				borderColor: "#5751ff",
				backgroundColor: "rgba(68,110,255,0.4)",
				pointRadius: 5,
				pointHoverRadius: 6,
				pointBackgroundColor: "#5751ff",

			}]
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

	let nOfDownload = document.getElementById('nOfDownload')
	if (nOfDownload) {
		nOfDownload.innerHTML =  Number(generalInfo.nOfDownload).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
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
		var lastUpdate = moment(generalInfo.lastUpdate)
		lastUpdateDiv.innerHTML =  lastUpdate.format('Do MMMM YYYY')
	} 


	let downloadTrendDiv = document.getElementById('downloadTrend')
	if (downloadTrendDiv) {
		var downloadTrend = downloadTrendDiv.getContext('2d');
		//var notificationTrend = document.getElementById('notificationTrend').getContext('2d');
		var downloadLabels = []
		var downloadData = []
		Object.keys(downloadDataset).forEach(function (day) {
			var total = downloadDataset[day].total;
			day = moment(day).format('ll');
			downloadLabels.push(day);
			downloadData.push(total);
		})
		window.configDownloadTrend = generateChartConfig(downloadLabels, downloadData, "download", labels[lang].day, "Download")
		window.downloadTrendChart = new Chart(downloadTrend, configDownloadTrend);
	} 

	
	
	


};




export function updateChartLang() {

	const lang = localStorage.getItem("language");
	moment.locale(lang); 
	
	let lastUpdateDiv = document.getElementById('lastUpdate')
	if (lastUpdateDiv) {
		var lastUpdate = moment(generalInfo.lastUpdate)
		lastUpdateDiv.innerHTML =  lastUpdate.format('Do MMMM YYYY')
	} 


	var downloadLabels = []
	var downloadData = []
	Object.keys(downloadDataset).forEach(function (day) {
		var total = downloadDataset[day].total;
		day = moment(day).format('ll');
		downloadLabels.push(day);
		downloadData.push(total);
	})

	if(window.configDownloadTrend){
		window.configDownloadTrend.data.labels = downloadLabels;
		window.configDownloadTrend.options.scales.xAxes[0].scaleLabel.labelString = labels[lang].day;
		window.downloadTrendChart.update();
	}
	

  }