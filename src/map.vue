<template lang="jade">
.map
</template>

<script>
import leaflet from 'leaflet'
import 'leaflet-hash'
import 'leaflet/dist/leaflet.css'
import config from 'config'
import api from './djnd-api'
import './hexbin-layer'

// Workaround: https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-269750768
/* eslint-disable no-underscore-dangle, global-require */
delete leaflet.Icon.Default.prototype._getIconUrl

leaflet.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})
/* eslint-enable no-underscore-dangle, global-require */

export default {
	mounted () {
		this.$nextTick(() => {
			let map = leaflet.map(this.$el, {
				center: config.center,
				zoom: config.zoom
			})

			var marker

			map.on('dblclick ', (e) => {
				console.log(e.latlng)
				if (!marker) marker = leaflet.marker(e.latlng).addTo(map)
				marker.setLatLng(e.latlng).bindPopup(String(e.latlng)).openPopup()
			})

			leaflet.tileLayer('https://maps.luftdaten.info/tiles/{z}/{x}/{y}.png', {
				attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
				maxZoom: 13,
			}).addTo(map)

			let options = {
				mouseover: () => {
				},
				mouseout: () => {
				},
				click: (data) => {
					this.$emit('cell-selected', data)
					const cellInfo = document.getElementById('cell-info')
					if (cellInfo) {
						cellInfo.style.display = ''
					}
					let i = 0
					let rowCounter = document.getElementsByClassName('cell_info_images')
					for (i = 0; i < rowCounter.length; i++) {
						rowCounter[i].style.display = 'none'
					}
					rowCounter = document.getElementsByClassName('graph_on')
					for (i = 0; i < rowCounter.length; i++) {
						rowCounter[i].style.display = ''
					}
					rowCounter = document.getElementsByClassName('graph_off')
					for (i = 0; i < rowCounter.length; i++) {
						rowCounter[i].style.display = 'none'
					}
				}
			}

			let hexLayer = new leaflet.HexbinLayer(options).addTo(map)

			api.getAllSensors().then((cells) => {
				hexLayer.data(cells)
			})

			// eslint-disable-next-line
			new leaflet.Hash(map)
		})
	}
}
</script>

<style lang="stylus">
</style>
