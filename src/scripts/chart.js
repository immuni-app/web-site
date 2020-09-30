import Chart from 'chart.js';
//#446EFF

		var chartConfig = {
			type: 'line',
			data: {
				labels: ['10/09', '11/09', '12/09', '13/09', '14/09', '15/09', '16/09'],
				datasets: [{
					data: [
						5,6,7,8,9,11,16
					],
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
                    displayColors:false,
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return Number(tooltipItem.yLabel).toFixed(0)+" download";
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
							labelString: 'Giorno'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Download'
						}
					}]
				}
			}
		};
		

window.onload = function() {
    var downloadTrend = document.getElementById('downloadTrend').getContext('2d');
    var notificationTrend = document.getElementById('notificationTrend').getContext('2d');
	
	let configDownloadTrend = JSON.parse(JSON.stringify(chartConfig));
	let configNotificationTrend = JSON.parse(JSON.stringify(chartConfig));

	configDownloadTrend.data.datasets[0].data = [5,6,7,8,9,11,16]
	configNotificationTrend.data.datasets[0].data = [10,12,15,8,9,7,11]

	var downloadTrendChart = new Chart(downloadTrend, configDownloadTrend);
    var notificationtrendChart = new Chart(notificationTrend, configNotificationTrend);
};

