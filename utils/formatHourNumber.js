export default function formatHourNumber(val) {
	return +parseFloat(val).toFixed(1) > 9 ? +parseFloat(val).toFixed(1) : "0" + +parseFloat(val).toFixed(1);
}