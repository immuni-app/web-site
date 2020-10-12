import Chart from 'chart.js';
import "chartjs-chart-geo";
import { feature } from "topojson-client";
import generalInfo from './../assets/json/general_info.json';
import downloadDataset from './../assets/json/download_trend.json';
import notificationDataset from './../assets/json/notification_trend.json';
import 'datatables.net-dt'
import 'datatables-bulma'

var $ = require("jquery")

var moment = require('moment');

Number.prototype.round = function(places) {
	return +(Math.round(this + "e+" + places)  + "e-" + places);
}

//Region
import europe from './../assets/json/europe.json';
import italyRegions from './../assets/json/italy-regions.json';
import regioniDataset from './../assets/json/use_trend_by_region.json';

const labelBackgroundColor = "#182C57";
const primaryChartColor = '#5851FF';
const primaryChartColorTrasparency = "rgba(68,110,255,0.4)";
const secondaryChartColor = '#9f9eff';

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
				backgroundColor: labelBackgroundColor,
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
	
	$('#example').DataTable();
	
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
		lastUpdateDiv.innerHTML =  lastUpdate.format('Do MMMM YYYY')
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
			borderColor: primaryChartColor,
			backgroundColor: primaryChartColorTrasparency,
			pointRadius: 5,
			pointHoverRadius: 6,
			pointBackgroundColor: primaryChartColor,

		}]
		window.configDownloadTrend = generateChartConfig(downloadLabels, dataset, "download", labels[lang].day, "Download")
		window.downloadTrendChart = new Chart(downloadTrend, configDownloadTrend);		
	} 

	let notificationTrendDiv = document.getElementById('notificationTrend')
	if (notificationTrendDiv) {
		var notificationTrend = notificationTrendDiv.getContext('2d');
		//var notificationTrend = document.getElementById('notificationTrend').getContext('2d');
		var notificationLabels = []
		var notificationData = []
		var positiveUserData = []
		Object.keys(notificationDataset).forEach(function (day) {

			var notifiche = notificationDataset[day].notifiche;
			var utenti_positivi = notificationDataset[day].utenti_positivi;
			day = moment(day).format('ll');
			notificationLabels.push(day);
			notificationData.push(notifiche);
			positiveUserData.push(utenti_positivi)

		})

		notificationData = notificationData.slice(Math.max(notificationData.length - 7, 0))
		positiveUserData = positiveUserData.slice(Math.max(positiveUserData.length - 7, 0))
		notificationLabels = notificationLabels.slice(Math.max(notificationLabels.length - 7, 0))

		let dataset = [{
			data: notificationData,
			fill: true,
			borderColor: primaryChartColor,
			backgroundColor: primaryChartColorTrasparency,
			pointRadius: 5,
			pointHoverRadius: 6,
			pointBackgroundColor: primaryChartColor,

		},
	]
		window.configNotificationTrend = generateChartConfig(notificationLabels, dataset, "notifiche", labels[lang].day, "Notifiche")
		window.notificationTrendChart = new Chart(notificationTrend, window.configNotificationTrend);		
	} 


	//Doughnut chart
	let downloadDeviceDiv = document.getElementById('downloadDevice')
	if (downloadDeviceDiv) {
		var configDevice = {
			type: 'doughnut',
			data: {
				datasets: [{
					data: [
						iosDownload[iosDownload.length - 1], androidDownload[androidDownload.length - 1]
					],
					backgroundColor: [
						secondaryChartColor, primaryChartColor,
					],
				}],
				labels: [
					'iOS',
					'Android'
				]
			},
			options: {
				responsive: true,
				tooltips: {
						intersect: true,
						backgroundColor: labelBackgroundColor,
						displayColors: false,
						callbacks: {
						  title: function(tooltipItem, data) {
							return data['labels'][tooltipItem[0]['index']];
						  },
						  label: function(tooltipItem, data) {
							var dataset = data['datasets'][0];
							var percent = ((dataset['data'][tooltipItem['index']] / (dataset['data'][0]+dataset['data'][1])) * 100).round(2)
							return valueFormat(data['datasets'][0]['data'][tooltipItem['index']]) + '  (' + percent + '%)';;
						  }
						  
						},
				}
			}
		};

		window.downloadDeviceChart = new Chart(downloadDeviceDiv, configDevice);
	}

	//Chart with map
	/*
	var downloadMap = document.getElementById('downloadMap').getContext('2d');
	if(downloadMap){
		const regions = feature(italyRegions, italyRegions.objects.ITA_adm1).features.filter((item) => item.properties.NAME_0 === 'Italy');
		const countries = feature(europe, europe.objects.continent_Europe_subunits).features;
		const Italy = countries.find((d) => (d.properties.geounit == 'Italy' && d.geometry != null));

		let pointRadius = []
		for(var i=0;i<regioniDataset.length;i++){
			pointRadius.push(i);
		}
		  

		const config = {
			type: 'bubbleMap',
			data: {
				labels: regioniDataset.map((d) => d.denominazione_regione),

				datasets: [{
					outline: Italy,
					showOutline: true,
					backgroundColor: "rgba(88,81,255,0.8)",
					data: regioniDataset.map((d) => Object.assign(d, { value: d.utilizzo_percentuale})),

					outlineBackgroundColor: "#ffffff",
					outlineBorderColor: primaryChartColor,
					outlineBorderWidth: 2,
					

				}]
			},
			options: {
				tooltips: {
					mode: 'index',
					intersect: true,
					backgroundColor: labelBackgroundColor,
					displayColors: false,
					callbacks: {
						label: function (tooltipItem, data) {
							return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].denominazione_regione + ": " + tooltipItem.value + " %"
						}
					}
				},
				legend: {
					display: false,

				},
				plugins: {
					datalabels: {
						align: 'top',
						formatter: (v) => {
							return v.denominazione_regione;
						}
					}
				},

				scale: {
					projection: 'equalEarth',

				},
				geo: {
					radiusScale: {
						display: false,
						size: [0, 1],
					},
				},
			}
		}


		window.dowloadChartMap = new Chart(downloadMap, config);
	}
	*/
	//Penetration chart
	let penetrationByRegion = document.getElementById('penetrationByRegion')
	if (penetrationByRegion) {

		var penetrationChartData = {
			labels:  regioniDataset.map((d) => d.denominazione_regione),
			datasets: [{
				label: 'Download',
				backgroundColor: primaryChartColor,
				data: regioniDataset.map((d) => d.utenti_attivi),
			}, {
				label: 'Popolazione con età superiore ai 14 anni',
				backgroundColor: secondaryChartColor,
				tooltip: false,
				data: regioniDataset.map((d) =>  d.popolazione_superiore_14anni),
			}]

		};


		var configDevice = {
			type: 'bar',
			data: penetrationChartData,
			options: {
				title: {
					display: false
				},
				tooltips: {
					mode: 'index',
					intersect: false,
					backgroundColor: labelBackgroundColor,
					displayColors: false,
					callbacks: {
						title:function (tooltipItem, data) {

							
							var utentiAttivi = tooltipItem[0].value
							var utentiTotali = tooltipItem[1].value
							var percent = ((utentiAttivi / utentiTotali) * 100).round(1)

							return ""+tooltipItem[0].label+" ("+percent+"%)"
						},
						label: function (tooltipItem, data) {
							return data.datasets[tooltipItem.datasetIndex].label+": " + valueFormat(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
						},
						
					},
					


				},
				responsive: true,
				scales: {
					xAxes: [{
						stacked: true,
					}],
					yAxes: [{
						stacked: true
					}]
				}
			}
		}

		window.penetrationChart = new Chart(penetrationByRegion, configDevice);
	}

	//Notification and positive chart
	let notificationByRegion = document.getElementById('notificationByRegion')
	if (notificationByRegion) {

		var penetrationChartData = {
			labels:  regioniDataset.map((d) => d.denominazione_regione),
			datasets: [{
				label: 'Notifiche inviate',
				backgroundColor: primaryChartColor,
				data: regioniDataset.map((d) => d.notifiche_inviate),
			}, {
				label: 'Utenti positivi',
				backgroundColor: secondaryChartColor,
				tooltip: false,
				data: regioniDataset.map((d) =>  d.utenti_positivi),
			}]

		};


		var configDevice = {
			type: 'horizontalBar',
			data: penetrationChartData,
			options: {
				title: {
					display: false
				},
				tooltips: {
					mode: 'index',
					intersect: false,
					backgroundColor: labelBackgroundColor,
					displayColors: false,
					callbacks: {
						title:function (tooltipItem, data) {
							
							return ""+tooltipItem[0].label
						},
						label: function (tooltipItem, data) {
							return data.datasets[tooltipItem.datasetIndex].label+": " + valueFormat(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
						},
						
					},
					


				},
				responsive: true,
			}
		}

		window.notificationByRegionChart = new Chart(notificationByRegion, configDevice);
	}

	
	
	
};




export function updateChartLang() {

	const lang = localStorage.getItem("language");
	moment.locale(lang); 
	
	let lastUpdateDiv = document.getElementById('lastUpdate')
	if (lastUpdateDiv) {
		let lastDate = Object.keys(downloadDataset).sort().pop();
		var lastUpdate = moment(lastDate)
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

	downloadData = downloadData.slice(Math.max(downloadData.length - 7, 0))
	downloadLabels = downloadLabels.slice(Math.max(downloadLabels.length - 7, 0))

	if(window.configDownloadTrend){
		window.configDownloadTrend.data.labels = downloadLabels;
		window.configDownloadTrend.options.scales.xAxes[0].scaleLabel.labelString = labels[lang].day;
		window.downloadTrendChart.update();
	}
	

  }