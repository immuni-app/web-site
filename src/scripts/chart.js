import Chart from 'chart.js';
import "chartjs-chart-geo";
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { feature } from "topojson-client";
import downloadDataset from './../assets/json/andamento-download.json';
import andamentoNazionale from './../assets/json/andamento-dati-nazionali.json';
//import andamentoRegionale from './../assets/json/andamento-settimanale-dati-regionali-latest.json';

//import europe from './../assets/json/europe.json';
//import italyRegions from './../assets/json/italy-regions.json';

import regioniDataset from './../assets/json/use_trend_by_region.json';


let namedChartAnnotation = ChartAnnotation;
namedChartAnnotation["id"]="annotation";
Chart.pluginService.register( namedChartAnnotation);




var $ = require("jquery")

import 'datatables.net-responsive'
import 'datatables-bulma'


var moment = require('moment');

Number.prototype.round = function(places) {
	return +(Math.round(this + "e+" + places)  + "e-" + places);
}



const labelBackgroundColor = "#182C57";
const primaryChartColor = '#5851FF';
const primaryChartColorTrasparency = "rgba(68,110,255,0.4)";
const secondaryChartColor = '#9f9eff';
const tertiaryChartColor = '#ffc003';
const maxDayGraph = 14;

const labels = {
	it: {
		day: "Giorni",
		notification: "Notifiche",
		positiveUsers: "Utenti positivi",
		nationalAvg: "Media nazionale",
		over14yo: "Popolazione con età superiore ai 14 anni"
	},
	en: {
		day: "Day",
		notification: "Notifications",
		positiveUsers: "Positive users",
		nationalAvg: "National average",
		over14yo: "Population over 14 years of age"
	},
	de: {
		day: "Tage",
		notification: "Benachrichtigen",
		positiveUsers: "Positive Benutzer",
		nationalAvg: "Nationaler Durchschnitt",
		over14yo: "Bevölkerung über 14 Jahre"
	},
	fr: {
		day: "Journées",
		notification: "Notifier",
		positiveUsers: "Utilisateurs positifs",
		nationalAvg: "Moyenne nationale",
		over14yo: "Population de plus de 14 ans"
	},
	es: {
		day: "Dias",
		notification: "Notificar",
		positiveUsers: "Usuarios positivos",
		nationalAvg: "Promedio nacional",
		over14yo: "Población mayor de 14 años"
	},
};

function valueFormat(labelValue) {
	return labelValue.toLocaleString()
}

function addDot(number){
	return Number(number).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
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
						return addDot(tooltipItem.yLabel)+ " " + valueLabel[tooltipItem.datasetIndex];
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
	/*
	var tableProvince = $('#tableProvince').DataTable( {
		language: {
			"url": "https://cdn.datatables.net/plug-ins/1.10.21/i18n/Italian.json"
		},
		columns: [
			{ "data": "sigla" },
			{ "data": "provincia" },
			{ "data": "regione" },
			{ "data": "numero_positivi" },
			{ "data": "notifiche_inviate"},
			{ "data": "download"}
		  ],
		order: [[ 5, "desc" ]],
		pageLength: 15,
		lengthChange: false,
		fixedColumns: true,

        responsive: true
	} );
	tableProvince.rows.add(provinceDataset)

	*/

	const lang = localStorage.getItem("language");
	let lastDate = downloadDataset[downloadDataset.length-1].data
	
	let lastDownloadValue = downloadDataset[downloadDataset.length-1]
	

	let lastNotificationDate = andamentoNazionale[andamentoNazionale.length-1].data
	let lastNotificationValue = andamentoNazionale[andamentoNazionale.length-1]
	

	let nOfDownload = document.getElementById('nOfDownload')
	if (nOfDownload) {
		nOfDownload.innerHTML =  addDot(lastDownloadValue.ios_android_total)
	} 

	let sentNotifications = document.getElementById('sentNotifications')
	if (sentNotifications) {
		sentNotifications.innerHTML =  addDot(lastNotificationValue.notifiche_inviate_totali)
	} 

	let positiveUsers = document.getElementById('positiveUsers')
	if (positiveUsers) {
		positiveUsers.innerHTML =  addDot(lastNotificationValue.utenti_positivi_totali)
	} 


	moment.locale(lang); 
	

	let lastUpdateDiv = document.getElementById('lastUpdate')
	if (lastUpdateDiv) {
		let lastDate = downloadDataset[downloadDataset.length-1].data
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
		downloadDataset.forEach(function (elem) {
			var ios_value = elem.ios_total;
			var android_value = elem.android_total;
			var total = elem.ios_android_total;
			let day = moment(elem.data).format('ll');
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
		

		window.configDownloadTrend = {
			type: 'line',
			data: {
				labels: downloadLabels,
				datasets: dataset
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
							return addDot(tooltipItem.yLabel)+ " download";
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
							labelString: labels[lang].day
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: "Download",
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


		window.downloadTrendChart = new Chart(downloadTrend, configDownloadTrend);		
	} 

	//NOtification trend chart
	let notificationTrendDiv = document.getElementById('notificationTrend')
	if (notificationTrendDiv) {
		var notificationTrend = notificationTrendDiv.getContext('2d');
		//var notificationTrend = document.getElementById('notificationTrend').getContext('2d');
		var notificationLabels = []
		var notificationData = []
		var positiveUserData = []
		andamentoNazionale.forEach(function (element) {
			let day = element.data
			var notifiche = element.notifiche_inviate;
			var utenti_positivi = element.utenti_positivi;
			day = moment(day).format('ll');
			notificationLabels.push(day);
			notificationData.push(notifiche);
			positiveUserData.push(utenti_positivi)

		})
		
		notificationData = notificationData.slice(Math.max(notificationData.length - maxDayGraph, 0))
		positiveUserData = positiveUserData.slice(Math.max(positiveUserData.length - maxDayGraph, 0))
		notificationLabels = notificationLabels.slice(Math.max(notificationLabels.length - maxDayGraph, 0))

		let dataset = [{
			data: notificationData,
			fill: false,
			borderColor: primaryChartColor,
			backgroundColor: primaryChartColorTrasparency,
			pointRadius: 5,
			pointHoverRadius: 6,
			pointBackgroundColor: primaryChartColor,
			yAxisID: 'notifications',
			label: labels[lang].notification


		},
		{
			data: positiveUserData,
			fill: false,
			borderColor: tertiaryChartColor,
			backgroundColor: primaryChartColorTrasparency,
			pointRadius: 5,
			pointHoverRadius: 6,
			pointBackgroundColor: tertiaryChartColor,
			yAxisID: 'positive_users',
			label: labels[lang].positiveUsers

		}
	]
		window.configNotificationTrend = {
			type: 'line',
			data: {
				labels: notificationLabels,
				datasets: dataset
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
							return addDot(tooltipItem.yLabel)+ " " + [labels[lang].notification.toLowerCase(), labels[lang].positiveUsers.toLowerCase()][tooltipItem.datasetIndex];
						}
					}
				},
				legend: {
					display: true,
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
							labelString: labels[lang].day
						}
					}],
					yAxes: [{
						id: 'notifications',
						display: true,
						type: 'linear',
						position: 'left',
						scaleLabel: {
							display: true,
							labelString: labels[lang].notification
						},
						
					  }, {
						id: 'positive_users',
						type: 'linear',
						position: 'right',
						scaleLabel: {
							display: true,
							labelString: labels[lang].positiveUsers
						},
					  }]
				}
			}
		};


		



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
						tertiaryChartColor, primaryChartColor,
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

	//Penetration chart disabled
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
	

	
	function compare( a, b ) {
		var percentageA = ((a.utenti_attivi / a.popolazione_superiore_14anni) * 100).round(1);
		var percentageB = ((b.utenti_attivi / b.popolazione_superiore_14anni) * 100).round(1);

		if ( percentageA < percentageB ){
		  return 1;
		}
		if ( percentageA > percentageB ){
		  return -1;
		}
		return 0;
	}

	regioniDataset.sort(compare);
	let percentageAverage = 0.0;
	regioniDataset.forEach(a => {
		var percentage = ((a.utenti_attivi / a.popolazione_superiore_14anni) * 100).round(1);
		percentageAverage+=percentage;
	});
	percentageAverage = (percentageAverage/regioniDataset.length).round(1);

	let penetrationByRegion = document.getElementById('penetrationByRegion')
	if (penetrationByRegion) {
		var penetrationChartData = {
			labels:  regioniDataset.map((d) => d.denominazione_regione),
			datasets: [{
				label: '%',
				backgroundColor: "#5851ff",
				data: regioniDataset.map((d) => ((d.utenti_attivi / d.popolazione_superiore_14anni) * 100).round(1)),
			}]

		};


		var configDevice = {
			type: 'bar',
			data: penetrationChartData,
			options: {
				title: {
					display: false
				},
				legend: {
					display: false
				 },
				tooltips: {
					mode: 'index',
					intersect: false,
					backgroundColor: labelBackgroundColor,
					displayColors: false,
					callbacks: {
						title:function (tooltipItem, data) {

							let i = tooltipItem[0].index
							let region = regioniDataset[i]
							var percent = tooltipItem[0].value
							return ""+tooltipItem[0].label+" ("+percent+"%)\nDownload: "+addDot(region.utenti_attivi)+"\n"+labels[lang].over14yo+": "+addDot(region.popolazione_superiore_14anni)
						},
						label: function (tooltipItem, data) {
							return ""
							//return data.datasets[tooltipItem.datasetIndex].label+": " + valueFormat(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
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
				},

				annotation: {
					drawTime: 'afterDatasetsDraw',
					annotations: [{
						id: 'a-line-1',
						type: 'line',
						mode: 'horizontal',
						scaleID: 'y-axis-0',
						value: percentageAverage,
						borderColor: tertiaryChartColor,
						borderWidth: 4,
						label: {
							backgroundColor: tertiaryChartColor,
							content: labels[lang].nationalAvg+' ('+percentageAverage+'%)',
							enabled: true,
							position: "right",
							xAdjust: 10,
							fontColor: "#182c57"

						}
						
					}]
				},
				
				
			}
		}
		window.configPenetration = configDevice;
		window.penetrationChart = new Chart(penetrationByRegion, configDevice);
	}
	
	//Notification and positive chart week
	/*
	let notificationByRegion = document.getElementById('notificationByRegion')
	let lastWeekUpdate = document.getElementById('lastWeekUpdate')
	
	if (notificationByRegion) {
		if(lastWeekUpdate){

			var lastWeek = moment(andamentoRegionale[0].settimana)
			lastWeekUpdate.innerHTML =  lastWeek.format('DD/MM/YYYY')+" - "+lastWeek.add(6, 'days').format('DD/MM/YYYY')
		}
		var penetrationChartData = {
			labels:  andamentoRegionale.map((d) => d.denominazione_regione),
			datasets: [{
				label: labels[lang].notification,
				backgroundColor: primaryChartColor,
				data: andamentoRegionale.map((d) => {if(d.notifiche_inviate==-1)return "< 6"; else return d.notifiche_inviate}),
				xAxisID: 'notifications',
			}, {
				label: labels[lang].positiveUsers,
				backgroundColor: tertiaryChartColor,
				tooltip: false,
				data: andamentoRegionale.map((d) =>  {if(d.utenti_positivi==-1)return "< 6"; else return d.utenti_positivi}),
				xAxisID: 'positive_users',
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
				scales: {
					xAxes: [{
						id: 'notifications',
						display: true,
						type: 'linear',
						position: 'top',
						scaleLabel: {
							display: true,
							labelString: labels[lang].notification
						},
						
						
						
					  }, {
						id: 'positive_users',
						type: 'linear',
						position: 'down',
						scaleLabel: {
							display: true,
							labelString: labels[lang].positiveUsers
						},
						
					  }],
					
				},
				responsive: true,
			}
		}
		window.configWeeklyReport = configDevice;
		window.weeklyReportByRegion = new Chart(notificationByRegion, configDevice);
	}
	*/
	
	
	
};




export function updateChartLang() {

	const lang = localStorage.getItem("language");
	moment.locale(lang); 
	
	let lastUpdateDiv = document.getElementById('lastUpdate')
	if (lastUpdateDiv) {
		let lastDate = downloadDataset[downloadDataset.length-1].data
		var lastUpdate = moment(lastDate)
		lastUpdateDiv.innerHTML =  lastUpdate.format('DD MMMM YYYY')
	} 


	//DOWNLOAD UPD
	var downloadLabels = []
	var downloadData = []
	downloadDataset.forEach(function (elem) {
		var total = elem.ios_android_total;
		let day = moment(elem.data).format('ll');
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

	//NOTIFICATION UPD
	var notificationLabels = []
	var notificationData = []
	var positiveUserData = []
	andamentoNazionale.forEach(function (element) {
		var day = element.data
		var notifiche = element.notifiche_inviate;
		var utenti_positivi = element.utenti_positivi;
		day = moment(day).format('ll');
		notificationLabels.push(day);
		notificationData.push(notifiche);
		positiveUserData.push(utenti_positivi)

	})

	notificationData = notificationData.slice(Math.max(notificationData.length - maxDayGraph, 0))
	positiveUserData = positiveUserData.slice(Math.max(positiveUserData.length - maxDayGraph, 0))
	notificationLabels = notificationLabels.slice(Math.max(notificationLabels.length - maxDayGraph, 0))

	if(window.configNotificationTrend){
		
		window.configNotificationTrend.data.labels = notificationLabels;
		window.configNotificationTrend.data.datasets[0].label = labels[lang].notification;
		window.configNotificationTrend.data.datasets[1].label = labels[lang].positiveUsers;
		window.configNotificationTrend.options.scales.xAxes[0].scaleLabel.labelString = labels[lang].day;
		window.configNotificationTrend.options.scales.yAxes[0].scaleLabel.labelString = labels[lang].notification;
		window.configNotificationTrend.options.scales.yAxes[1].scaleLabel.labelString = labels[lang].positiveUsers;
		window.configNotificationTrend.options.tooltips.callbacks.label=function (tooltipItem, data) {
			if(tooltipItem.datasetIndex==0)
				return addDot(tooltipItem.yLabel)+ " " + labels[lang].notification.toLowerCase();
			if(tooltipItem.datasetIndex==1)
				return addDot(tooltipItem.yLabel)+ " " + labels[lang].positiveUsers.toLowerCase();
		}
		//window.configNotificationTrend.options.scales.xAxes[0].scaleLabel.labelString = labels[lang].day;
		window.notificationTrendChart.update()
		
	}

	//Penetration region
	let percentageAverage = 0.0;
	regioniDataset.forEach(a => {
		var percentage = ((a.utenti_attivi / a.popolazione_superiore_14anni) * 100).round(1);
		percentageAverage+=percentage;
	});
	percentageAverage = (percentageAverage/regioniDataset.length).round(1);

	if(window.configPenetration){

		window.penetrationChart.annotation.elements = [];
		window.configPenetration.options.annotation.annotations[0].label.content = labels[lang].nationalAvg+' ('+percentageAverage+'%)'


		window.configPenetration.options.tooltips.callbacks.title = function (tooltipItem, data) {
			let i = tooltipItem[0].index
			let region = regioniDataset[i]
			var percent = tooltipItem[0].value
			return ""+tooltipItem[0].label+" ("+percent+"%)\nDownload: "+addDot(region.utenti_attivi)+"\n"+labels[lang].over14yo+": "+addDot(region.popolazione_superiore_14anni)
		}
		


		window.penetrationChart.update()
	}


	//Notification by region
	if(window.configWeeklyReport ){

		

		window.configWeeklyReport.data.datasets[0].label = labels[lang].notification;
		window.configWeeklyReport.data.datasets[1].label = labels[lang].positiveUsers;
		window.configWeeklyReport.options.scales.xAxes[0].scaleLabel.labelString = labels[lang].notification;
		window.configWeeklyReport.options.scales.xAxes[1].scaleLabel.labelString = labels[lang].positiveUsers;
		

		window.weeklyReportByRegion.update();

	}
	
	

  }