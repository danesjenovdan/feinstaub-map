/* global fetch */
import _ from 'lodash'
import 'whatwg-fetch'

// const URL = 'http://localhost:80/air-dust-data'
const URL = 'http://zrak.djnd.si/api/air-dust-data'
// const URL = 'https://api.luftdaten.info/static/v2/data.dust.min.json'

let api = {
	fetchNow () {
		return fetch(URL).then((response) => response.json())
	},

	getAllSensors () {
		return api.fetchNow().then((json) => {
			let cells = _.chain(json)
				.groupBy((sensor) => sensor.sensor.id)
				.map((values, key) => {
					let lat = Number(values[0].location.latitude)
					let long = Number(values[0].location.longitude)
					let data = _.reduce(values, (acc, value) => {
						let d = _.keyBy(value.sensordatavalues, 'value_type')
						if (
							typeof d.P1 !== 'undefined' && d.P1 !== null &&
							typeof d.P2 !== 'undefined' && d.P2 !== null &&
							Number(d.P1.value) < 1999 && Number(d.P2.value < 999)
						) {
							acc.P1 += Number(d.P1.value)
							acc.P2 += Number(d.P2.value)
						}
						return acc
					}, {P1: 0, P2: 0})
					return {
						latitude: lat,
						longitude: long,
						id: values[0].sensor.id,
						data: {
							P1: data.P1 / values.length,
							P2: data.P2 / values.length
						}
					}
				})
				.value()

			return Promise.resolve(cells)
		})
	}
}

export default api
