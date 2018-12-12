<template lang="jade">
#cell-info(v-if="cell")
	button(class="close-button" @click!="$emit('close')") ×

	p
		button(class="map-info-button" v-if="!showInfo" @click!="showInfo = true") Prikaži razlago
		button(class="map-info-button" v-else @click!="showInfo = false") Skrij razlago
	div(id="map-info" v-if="showInfo")
		p Ploščice so obarvane glede na povprečje vrednosti PM10 vseh senzorjev v celici. Legenda je spodaj levo.
		p Številke v prvem stolpcu predstavljajo ID senzorja. Vrstica "povprečje" vsebuje povprečno vrednost vseh senzorjev v celici.
		//- p Prosimo, upoštevajte: na zemljevidu prikazujemo vrednosti zadnjih 5 minut. Vrednote, ki jih objavijo zadevni državni organi, so podane kot 24-urno povprečje. To lahko povzroči, da se vrednosti na grafikonu bistveno razlikujejo od teh 24-urnih povprečij.
		//- p S klikom na plus pred senzorjem se lahko prikaže 2 grafika. Graf '24 h plavajoče' prikazuje 24-urno gibalno povprečje zadnjih 7 dni. Zaradi tehničnih razlogov na začetku pride do prepada enega dneva, tako da predstavitev dejansko kaže 8 dni, prva pa je prazna. Druga grafika »Zadnjih 24 ur« prikazuje potek dneva v zadnjih 24 urah.

	h3 Št. senzorjev: {{cell.length}}

	table
		tr
			th Sensor ID
			th PM10 µg/m³
			th PM2.5 µg/m³
		tr.mean
			td povprečje
			td {{mean.P1.toFixed(0)}}
			td {{mean.P2.toFixed(0)}}
		template(v-for="sensor in cell")
			tr
				td {{sensor.o.id}}
				td {{sensor.o.data.P1.toFixed(0)}}
				td {{sensor.o.data.P2.toFixed(0)}}
</template>

<script>
import _ from 'lodash'

export default {
	data () {
		return {
			showInfo: false,
		}
	},
	props: {
		'cell': Array
	},
	computed: {
		mean () {
			return {
				P1: _.meanBy(this.cell, (o) => o.o.data.P1),
				P2: _.meanBy(this.cell, (o) => o.o.data.P2)
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
#cell-info
	button
		background transparent
		border none
		color #fff
		cursor pointer
		padding 0

	.close-button
		width 30px
		height 30px
		font-size 40px
		line-height 33px
		overflow hidden

	.map-info-button
		padding 2px 6px

	#map-info
		padding 0 6px
		color #ddd
		p
			font-size 0.85rem

	h3
		padding 0 6px
		font-size 1.5rem
		font-weight 700

	table
		th
		td
			padding 6px 6px
			font-size 1.25rem
		td
			font-family 'Roboto Mono', monospace
			font-weight 300

		th
		td:first-child
			font-weight 500

		td:first-child
			font-size 1rem
			font-family inherit
			text-align left
</style>
