/* global fetch */
import 'whatwg-fetch'
import Chart from 'chart.js'
import querystring from 'querystring'
import moment from 'moment-timezone'

var query = querystring.parse(window.location.search.substring(1))
var sensorId = Number(query.sensor) || 0

export function renderChart () {
	if (sensorId) {
		var canvas = document.getElementById('myChart')
		var ctx = canvas.getContext('2d')
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight * 0.8

		var avgSelect = document.getElementById('average')
		var limSelect = document.getElementById('limit')

		avgSelect.onchange = () => {
			updateData()
		}
		limSelect.onchange = () => {
			updateData()
		}

		var myChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: [],
				datasets: []
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				animation: {
					duration: 0,
				},
			}
		})

		var fetchLimit = (limit) => {
			return new Promise((resolve, reject) => {
				function fetchMore (offset) {
					return fetch(`https://zrak.djnd.si/api/history/${sensorId}?average=${avgSelect.value}&limit=${limit}&offset=${offset || 0}`)
						.then(res => res.json())
				}

				var data = []

				function appendData (newData) {
					if (!newData || !newData.length) {
						resolve(data)
						return
					}
					data = data.concat(newData)
					if (data.length >= limit) {
						resolve(data)
						return
					}
					fetchMore(data.length)
						.then(appendData)
				}

				fetchMore(data.length)
					.then(appendData)
			})
		}

		var updateData = () => {
			fetchLimit(limSelect.value)
				.then(data => {
					console.log(data.length)
					if (data && data[0]) {
						// var sensorId = data[0].sensor.id
						var newData = {
							labels: [],
							datasets: [{
								label: 'PM10 µg/m³',
								data: [],
								backgroundColor: 'rgba(255,0,0,0.1)',
								borderColor: 'rgba(255,0,0,0.5)'
							}, {
								label: 'PM2.5 µg/m³',
								data: [],
								backgroundColor: 'rgba(0,0,255,0.1)',
								borderColor: 'rgba(0,0,255,0.5)'
							}]
						}
						data.reverse().forEach(m => {
							newData.labels.push(moment.tz(m.timestamp, 'Etc/UTC').tz('Europe/Ljubljana').format('MMM D H:mm'))
							var p1 = m.sensordatavalues.find(e => e.value_type === 'P1').value
							var p2 = m.sensordatavalues.find(e => e.value_type === 'P2').value
							newData.datasets[0].data.push(p1)
							newData.datasets[1].data.push(p2)
						})

						myChart.data = newData
						myChart.update()
					}
				})
		}

		updateData()

		setInterval(() => {
			updateData()
		}, 60000)
	}
}
