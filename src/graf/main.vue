<template>
<div>
	<div>
		<label for="average">Povprečje na:</label>
		<select id="average">
			<option value="none">-----</option>
			<option value="hourly" selected>URO</option>
			<option value="daily">DAN</option>
		</select>
		<label for="limit">Največ:</label>
		<select id="limit">
			<option value="7">7</option>
			<option value="24">24</option>
			<option value="48" selected>48</option>
			<option value="100">100</option>
		</select>
	</div>
  <canvas id="myChart"></canvas>
</div>
</template>

<script>
import { renderChart } from './chart'

export default {
	mounted () {
		renderChart()
	}
}
</script>

<style>
</style>
