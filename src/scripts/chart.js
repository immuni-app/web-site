import Chart from 'chart.js';
import "chartjs-chart-geo";
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { feature } from "topojson-client";
import downloadDataset from './../assets/json/andamento-download.json';
import andamentoNazionale from './../assets/json/andamento-dati-nazionali.json';
import andamentoRegionale from './../assets/json/andamento-mensile-dati-regionali-latest.json';

import europe from './../assets/json/europe.json';
import italyRegions from './../assets/json/italy-regions.json';

import percentualeDownloadRegioni from './../assets/json/percentuale-download-regionali-latest.json';
import allowedCountry from './../assets/json/stati-abilitati-interoperabilita.json';
import countriesLang from './../assets/json/countries.json';

let namedChartAnnotation = ChartAnnotation;
namedChartAnnotation["id"] = "annotation";
Chart.pluginService.register(namedChartAnnotation);




var $ = require("jquery")

import 'datatables.net-responsive'
import 'datatables-bulma'


var moment = require('moment');

Number.prototype.round = function (places) {
	return +(Math.round(this + "e+" + places) + "e-" + places);
}



const labelBackgroundColor = "#182C57";
const primaryChartColor = '#5851FF';
const primaryChartColorTrasparency = "rgba(68,110,255,0.4)";
const secondaryChartColor = '#9f9eff';
const tertiaryChartColor = '#ffc003';
const maxDayGraph = 31;

const labels = {
	it: {
		day: "Giorni",
		month: "Mesi",
		notification: "Notifiche",
		positiveUsers: "Utenti positivi",
		nationalAvg: "Media nazionale",
		over14yo: "Popolazione con età superiore ai 14 anni"
	},
	en: {
		day: "Days",
		month: "Months",
		notification: "Notifications",
		positiveUsers: "Positive users",
		nationalAvg: "National average",
		over14yo: "Population over 14 years of age"
	},
	de: {
		day: "Tage",
		month: "Monate",
		notification: "Benachrichtigen",
		positiveUsers: "Positive Benutzer",
		nationalAvg: "Nationaler Durchschnitt",
		over14yo: "Bevölkerung über 14 Jahre"
	},
	fr: {
		day: "Journées",
		month: "Mois",
		notification: "Notifier",
		positiveUsers: "Utilisateurs positifs",
		nationalAvg: "Moyenne nationale",
		over14yo: "Population de plus de 14 ans"
	},
	es: {
		day: "Dias",
		month: "Meses",
		notification: "Notificar",
		positiveUsers: "Usuarios positivos",
		nationalAvg: "Promedio nacional",
		over14yo: "Población mayor de 14 años"
	},
};

function valueFormat(labelValue) {
	return labelValue.toLocaleString()
}

function addDot(number) {
	return Number(number).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}


window.onload = function () {
	/*
	$.when(
	  $.getJSON("https://raw.githubusercontent.com/immuni-app/immuni-dashboard-data/master/dati/andamento-download.json", function(data) {
		  downloadDataset = data;
	  }),
	  $.getJSON("https://raw.githubusercontent.com/immuni-app/immuni-dashboard-data/master/dati/andamento-settimanale-dati-regionali-latest.json", function(data) {
		  andamentoRegionale = data;
	  }),
	  $.getJSON("https://raw.githubusercontent.com/immuni-app/immuni-dashboard-data/master/dati/andamento-dati-nazionali.json", function(data) {
		  andamentoNazionale = data;
	  })
	  ).then(function() {
		  if (!downloadDataset) {
			  downloadDataset=downloadDatasetStatic;
		  }
	  	
		  if (!andamentoRegionale) {
			  andamentoRegionale=andamentoRegionaleStatic
		  }
	  	
		  if (!andamentoNazionale) {
			  andamentoNazionale=andamentoNazionaleStatic
		  }
		  generateChart();
	  	
	  });
	  */

	generateChart();

}
function generateChart() {
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
	console.log("olang", lang)
	let lastDate = downloadDataset[downloadDataset.length - 1].data

	let lastDownloadValue = downloadDataset[downloadDataset.length - 1]


	let lastNotificationDate = andamentoNazionale[andamentoNazionale.length - 1].data
	let lastNotificationValue = andamentoNazionale[andamentoNazionale.length - 1]


	let nOfDownload = document.getElementById('nOfDownload')
	if (nOfDownload) {
		nOfDownload.innerHTML = addDot(lastDownloadValue.ios_android_total)
	}

	let sentNotifications = document.getElementById('sentNotifications')
	if (sentNotifications) {
		sentNotifications.innerHTML = addDot(lastNotificationValue.notifiche_inviate_totali)
	}

	let positiveUsers = document.getElementById('positiveUsers')
	if (positiveUsers) {
		positiveUsers.innerHTML = addDot(lastNotificationValue.utenti_positivi_totali)
	}


	moment.locale(lang);


	let lastUpdateDiv = document.getElementById('lastUpdate')
	if (lastUpdateDiv) {
		let lastDate = andamentoNazionale[andamentoNazionale.length - 1].data
		var lastUpdate = moment(lastDate)
		lastUpdateDiv.innerHTML = lastUpdate.format('D MMMM YYYY')
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

		downloadData = downloadData.slice(Math.max(downloadData.length - 31, 0))
		downloadLabels = downloadLabels.slice(Math.max(downloadLabels.length - 31, 0))
		console.log("dwn", downloadLabels)

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
							return addDot(tooltipItem.yLabel) + " download";
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
	let positiveTrendDiv = document.getElementById('positiveTrend')

	if (notificationTrendDiv && positiveTrendDiv) {
		var notificationTrend = notificationTrendDiv.getContext('2d');
		var positiveTrend = positiveTrendDiv.getContext('2d');

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

		let datasetNotification = [{
			data: notificationData,
			fill: false,
			borderColor: primaryChartColor,
			backgroundColor: primaryChartColorTrasparency,
			pointRadius: 5,
			pointHoverRadius: 6,
			pointBackgroundColor: primaryChartColor,
			yAxisID: 'notifications',
			label: labels[lang].notification


		}]

		let datasetPositive = [{
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
				datasets: datasetNotification
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
							return addDot(tooltipItem.yLabel) + " " + [labels[lang].notification.toLowerCase(), labels[lang].positiveUsers.toLowerCase()][tooltipItem.datasetIndex];
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

					}]
				}
			}
		};

		window.configPositiveTrend = {
			type: 'line',
			data: {
				labels: notificationLabels,
				datasets: datasetPositive
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
							return addDot(tooltipItem.yLabel) + " " + [labels[lang].notification.toLowerCase(), labels[lang].positiveUsers.toLowerCase()][tooltipItem.datasetIndex];
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
						id: 'positive_users',
						type: 'linear',
						position: 'left',
						scaleLabel: {
							display: true,
							labelString: labels[lang].positiveUsers
						},
					}]
				}
			}
		};





		window.notificationTrendChart = new Chart(notificationTrend, window.configNotificationTrend);
		window.positiveTrendChart = new Chart(positiveTrend, window.configPositiveTrend);

	}


	//Doughnut chart
	let downloadDeviceDiv = document.getElementById('downloadDevice')
	var seriesData = [iosDownload[iosDownload.length - 1], androidDownload[androidDownload.length - 1]];
	var total = seriesData.reduce((a, v) => a + v);
	var inPercent = seriesData.map(v => Math.max(v / total * 100, 1));

	if (downloadDeviceDiv) {
		var configDevice = {
			type: 'doughnut',
			data: {
				datasets: [{
					data: inPercent,
					backgroundColor: [
						tertiaryChartColor, primaryChartColor
					],
				}],

				labels: [
					'iOS',
					'Android ⁽⁴⁾',
				]
			},

			options: {

				responsive: true,

				tooltips: {
					intersect: true,
					backgroundColor: labelBackgroundColor,
					displayColors: false,
					callbacks: {
						title: function (tooltipItem, data) {
							return data['labels'][tooltipItem[0]['index']];
						},
						label: function (tooltipItem, data) {
							var value = seriesData[tooltipItem.index];


							var dataset = data['datasets'][0];
							var percent = ((dataset['data'][tooltipItem['index']] / (dataset['data'][0] + dataset['data'][1])) * 100).round(2)
							return valueFormat(value) + '  (' + percent + '%)';
						}

					},
				}
			}
		};

		window.downloadDeviceChart = new Chart(downloadDeviceDiv, configDevice);
	}

	//Europe chart interoperability

	var europeMap = document.getElementById('europeMap');
	if (europeMap) {
		const regions = feature(italyRegions, italyRegions.objects.ITA_adm1).features.filter((item) => item.properties.NAME_0 === 'Italy');
		const countries = feature(europe, europe.objects.continent_Europe_subunits).features;

		const Italy = countries.find((d) => (d.properties.geounit == 'Italy' && d.geometry != null));

		let allowedList = []
		let mapState = {}
		allowedCountry.forEach(element => {
			mapState[element.state_name] = element.ISO;
			allowedList.push(element.state_name)
		});

		let labelsCountry = []
		let finaldataset = []
		countries.forEach(element => {
			let name = element.properties.geounit;

			if (allowedList.includes(name)) {
				let v = { feature: element, value: 100 }
				finaldataset.push(v)
				labelsCountry.push(mapState[name])
			}

		});


		const config = {
			type: 'choropleth',
			data: {
				labels: labelsCountry,

				datasets: [{
					outline: countries,
					showOutline: true,
					backgroundColor: primaryChartColor,
					data: finaldataset,
					outlineBackgroundColor: "#E9EFFF",
					outlineBorderColor: "white",
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
							return countriesLang[lang][data['labels'][tooltipItem.index]]
						}
					}
				},
				legend: {
					display: false,

				},
				scale: {
					projection: 'equalEarth',

				},
				geo: {
					showOutline: false,
					radiusScale: {
						display: false,
						size: [0, 1],
					},
				},
			}
		}

		window.configEuropeMap = config;
		window.europeMap = new Chart(europeMap.getContext('2d'), config);
	}



	//Download percentuale per regione
	//Ordinamento percentuale
	function compare(a, b) {
		var percentageA = ((a.download / a.popolazione_superiore_14anni) * 100).round(1);
		var percentageB = ((b.download / b.popolazione_superiore_14anni) * 100).round(1);

		if (percentageA < percentageB) {
			return 1;
		}
		if (percentageA > percentageB) {
			return -1;
		}
		return 0;
	}

	//Ordinamento nome regione
	function compareStrings(a, b) {
		a = a.toLowerCase();
		b = b.toLowerCase();
		return (a < b) ? -1 : (a > b) ? 1 : 0;
	}

	andamentoRegionale.sort(function (a, b) {
		return compareStrings(a.denominazione_regione, b.denominazione_regione);
	})

	//percentualeDownloadRegioni.sort(compare);
	percentualeDownloadRegioni.sort(function (a, b) {
		return compareStrings(a.denominazione_regione, b.denominazione_regione);
	})

	let percentageAverage = 0.0;
	let sumDownload = 0;
	let sumPopulation = 0;
	percentualeDownloadRegioni.forEach(a => {
		//var percentage = ((a.download / a.popolazione_superiore_14anni) * 100).round(1);
		//percentageAverage+=percentage;
		sumDownload += a.download;
		sumPopulation += a.popolazione_superiore_14anni;
	});
	//percentageAverage = (percentageAverage/percentualeDownloadRegioni.length).round(1);
	percentageAverage = ((sumDownload / sumPopulation) * 100).round(1);


	let lastUpdatePenetrationByRegion = document.getElementById('lastUpdatePenetrationByRegion')
	if (lastUpdatePenetrationByRegion) {
		var lastMonth = moment(percentualeDownloadRegioni[0].mese)
		lastUpdatePenetrationByRegion.innerHTML = lastMonth.format('DD/MM/YYYY')
	}

	//let penetrationByRegion = document.getElementById('penetrationByRegion')
	//if (penetrationByRegion) {
	/*var penetrationChartData = {
		labels:  percentualeDownloadRegioni.map((d) => d.denominazione_regione),
		datasets: [{
			label: '%',
			backgroundColor: "#5851ff",
			data: percentualeDownloadRegioni.map((d) => ((d.download / d.popolazione_superiore_14anni) * 100).round(1)),
		}]

	};*/


	/*var configDevice = {
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
						let region = percentualeDownloadRegioni[i]
						var percent = tooltipItem[0].value
						return ""+tooltipItem[0].label+" ("+percent+"%)\nDownload: "+addDot(region.download)+"\n"+labels[lang].over14yo+": "+addDot(region.popolazione_superiore_14anni)
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
	window.penetrationChart = new Chart(penetrationByRegion, configDevice);*/
	//}

	//Notification and positive chart month
	let monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
		"Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
	];
	let formattedDate = new Date(andamentoRegionale[0]['mese'])
	let meseLabel = monthNames[formattedDate.getMonth()]
	let annoLabel = formattedDate.getFullYear()

	let notificationByRegion = document.getElementById('notificationByRegion')
	let positiveUsersByRegion = document.getElementById('positiveUsersByRegion')
	let lastWeekUpdateNotifications = document.getElementById('lastWeekUpdateNotifications')
	let lastWeekUpdatePositiveUsers = document.getElementById('lastWeekUpdatePositiveUsers')
	if (lastWeekUpdateNotifications && lastWeekUpdatePositiveUsers) {
		//var lastWeek = moment(andamentoRegionale[0].mese)
		//lastWeekUpdateNotifications.innerHTML = lastWeek.format('DD/MM/YYYY') + " - " + lastWeek.add(6, 'days').format('DD/MM/YYYY')
		//lastWeekUpdatePositiveUsers.innerHTML = lastWeekUpdateNotifications.innerHTML
		lastWeekUpdateNotifications.innerHTML = meseLabel + " " + annoLabel
		lastWeekUpdatePositiveUsers.innerHTML = meseLabel + " " + annoLabel
	}

	if (notificationByRegion && positiveUsersByRegion) {

		var notificationsChartData = {
			labels: andamentoRegionale.map((d) => d.denominazione_regione),
			datasets: [{
				label: labels[lang].notification,
				backgroundColor: primaryChartColor,
				data: andamentoRegionale.map((d) => { if (d.notifiche_inviate == -1) return 0; else return d.notifiche_inviate })
			}]

		};
		var positiveUsersChartData = {
			labels: andamentoRegionale.map((d) => d.denominazione_regione),
			datasets: [{
				label: labels[lang].positiveUsers,
				backgroundColor: tertiaryChartColor,
				data: andamentoRegionale.map((d) => { if (d.utenti_positivi == -1) return 0; else return d.utenti_positivi })
			}]

		};


		var configDevice = {
			type: 'bar',
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
						title: function (tooltipItem, data) {

							return "" + tooltipItem[0].label
						},
						label: function (tooltipItem, data) {
							let thisVal = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
							if (thisVal != 0) {
								thisVal = valueFormat(thisVal)
							} else {
								thisVal = "< 6"
							}
							return data.datasets[tooltipItem.datasetIndex].label + ": " + thisVal;
						},

					},
				},
				responsive: true,
				legend: {
					display: false
				},
				scales: {
					xAxes: [{
						display: true,
						ticks: {
							autoSkip: false,
							fontSize: 8
						},

					}]
				}
			}
		}
		configDevice.data = notificationsChartData;
		window.configWeeklyNotificationsReport = configDevice;
		window.weeklyNotificationsReportByRegion = new Chart(notificationByRegion, configDevice);

		let configDevice2 = Object.assign({}, configDevice);
		configDevice2.data = positiveUsersChartData;
		window.configWeeklyPositiveUsersReport = configDevice2;
		window.weeklyPositiveUsersReportByRegion = new Chart(positiveUsersByRegion, configDevice2);
	}






};




export function updateChartLang() {

	const lang = localStorage.getItem("language");
	moment.locale(lang);


	let lastUpdateDiv = document.getElementById('lastUpdate')
	if (lastUpdateDiv) {
		let lastDate = andamentoNazionale[andamentoNazionale.length - 1].data
		var lastUpdate = moment(lastDate)
		lastUpdateDiv.innerHTML = lastUpdate.format('D MMMM YYYY')
	}


	//DOWNLOAD UPD
	var downloadLabels = []
	var downloadData = []
	downloadDataset.forEach(function (elem) {
		var total = elem.total;
		let day = moment(elem.data).format('ll');
		downloadLabels.push(day);
		downloadData.push(total);
	})

	downloadData = downloadData.slice(Math.max(downloadData.length - 31, 0))
	downloadLabels = downloadLabels.slice(Math.max(downloadLabels.length - 31, 0))
	console.log("dwn", downloadLabels)

	if (window.configDownloadTrend) {
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

	if (window.configNotificationTrend) {

		window.configNotificationTrend.data.labels = notificationLabels;
		window.configNotificationTrend.data.datasets[0].label = labels[lang].notification;
		window.configNotificationTrend.options.scales.xAxes[0].scaleLabel.labelString = labels[lang].day;
		window.configNotificationTrend.options.scales.yAxes[0].scaleLabel.labelString = labels[lang].notification;
		window.configNotificationTrend.options.tooltips.callbacks.label = function (tooltipItem, data) {
			if (tooltipItem.datasetIndex == 0)
				return addDot(tooltipItem.yLabel) + " " + labels[lang].notification.toLowerCase();
		}
		//window.configNotificationTrend.options.scales.xAxes[0].scaleLabel.labelString = labels[lang].day;
		window.notificationTrendChart.update()

	}
	if (window.configPositiveTrend) {

		window.configPositiveTrend.data.labels = notificationLabels;
		window.configPositiveTrend.data.datasets[0].label = labels[lang].positiveUsers;
		window.configPositiveTrend.options.scales.xAxes[0].scaleLabel.labelString = labels[lang].day;
		window.configPositiveTrend.options.scales.yAxes[0].scaleLabel.labelString = labels[lang].positiveUsers;
		window.configPositiveTrend.options.tooltips.callbacks.label = function (tooltipItem, data) {
			if (tooltipItem.datasetIndex == 0)
				return addDot(tooltipItem.yLabel) + " " + labels[lang].positiveUsers.toLowerCase();
		}
		//window.configNotificationTrend.options.scales.xAxes[0].scaleLabel.labelString = labels[lang].day;
		window.positiveTrendChart.update()
	}

	//Penetration region
	let percentageAverage = 0.0;

	let sumDownload = 0;
	let sumPopulation = 0;
	percentualeDownloadRegioni.forEach(a => {
		//var percentage = ((a.download / a.popolazione_superiore_14anni) * 100).round(1);
		//percentageAverage+=percentage;

		sumDownload += a.download
		sumPopulation += a.popolazione_superiore_14anni
	});
	//percentageAverage = (percentageAverage/percentualeDownloadRegioni.length).round(1);
	percentageAverage = ((sumDownload / sumPopulation) * 100).round(1);


	if (window.configPenetration) {

		window.penetrationChart.annotation.elements = [];
		window.configPenetration.options.annotation.annotations[0].label.content = labels[lang].nationalAvg + ' (' + percentageAverage + '%)'


		window.configPenetration.options.tooltips.callbacks.title = function (tooltipItem, data) {
			let i = tooltipItem[0].index
			let region = percentualeDownloadRegioni[i]
			var percent = tooltipItem[0].value
			return "" + tooltipItem[0].label + " (" + percent + "%)\nDownload: " + addDot(region.download) + "\n" + labels[lang].over14yo + ": " + addDot(region.popolazione_superiore_14anni)
		}



		window.penetrationChart.update()
	}


	//Notification by region
	if (window.configWeeklyNotificationsReport) {
		window.configWeeklyNotificationsReport.data.datasets[0].label = labels[lang].notification;
		window.weeklyNotificationsReportByRegion.update();
	}
	//Positive users by region
	if (window.configWeeklyPositiveUsersReport) {
		window.configWeeklyPositiveUsersReport.data.datasets[0].label = labels[lang].positiveUsers;
		window.weeklyPositiveUsersReportByRegion.update();
	}


	//Europe MAP
	if (window.configEuropeMap) {
		window.configEuropeMap.options.tooltips.callbacks.label = function (tooltipItem, data) {
			return countriesLang[lang][data['labels'][tooltipItem.index]]
		}
		window.europeMap.update();
	}


}