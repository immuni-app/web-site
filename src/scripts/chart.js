import Chart from 'chart.js';
import "chartjs-chart-geo";
import { feature } from "topojson-client";
import europe from './../assets/json/europe.json';
import italyRegions from './../assets/json/italy-regions.json';
import generalInfo from './../assets/json/general_info.json';
import downloadDataset from './../assets/json/download_trend.json';
import regioniDataset from './../assets/json/use_trend_by_region.json.json';


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

				? Math.abs(Number(labelValue)) / 1.0e+3 + "K"

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

	//General INFO
	document.getElementById('millionsOfDownload').innerHTML = generalInfo.millionsOfDownload;
	document.getElementById('sentNotifications').innerHTML = generalInfo.sentNotifications;
	document.getElementById('containedOutbreaks').innerHTML = generalInfo.containedOutbreaks;
	document.getElementById('positiveUsers').innerHTML = generalInfo.positiveUsers;


	//Linear chart for trends
	var downloadTrend = document.getElementById('downloadTrend').getContext('2d');
	//var notificationTrend = document.getElementById('notificationTrend').getContext('2d');
	var downloadMap = document.getElementById('downloadMap').getContext('2d');

	var downloadLabels = []
	var downloadData = []
	Object.keys(downloadDataset).forEach(function (day) {
		var total = downloadDataset[day].total;
		downloadLabels.push(day);
		downloadData.push(total);
	})
	let configDownloadTrend = generateChartConfig(downloadLabels, downloadData, "download", labels[lang].day, "Download")
	var downloadTrendChart = new Chart(downloadTrend, configDownloadTrend);


	//Chart with map

	const regions = feature(italyRegions, italyRegions.objects.ITA_adm1).features.filter((item) => item.properties.NAME_0 === 'Italy');
	const countries = feature(europe, europe.objects.continent_Europe_subunits).features;
	const Italy = countries.find((d) => (d.properties.geounit == 'Italy' && d.geometry != null));

	const config = {
		type: 'bubbleMap',
		data: {
			labels: regioniDataset.map((d) => d.label),

			datasets: [{
				outline: Italy,
				showOutline: true,
				backgroundColor: "rgba(88,81,255,0.8)",
				data: regioniDataset,

				outlineBackgroundColor: "#ffffff",
				outlineBorderColor: "#5751ff",
				outlineBorderWidth: 1,

			}]
		},
		options: {
			tooltips: {
				mode: 'index',
				intersect: true,
				backgroundColor: "#182C57",
				displayColors: false,
				callbacks: {
					label: function (tooltipItem, data) {
						return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].label + ": " + tooltipItem.value + " %"
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
						return v.label;
					}
				}
			},

			scale: {
				projection: 'equalEarth',

			},
			geo: {
				radiusScale: {
					display: false,
					size: [1, 10],
				},
			},
		}
	}


	const chart = new Chart(downloadMap, config);


};
