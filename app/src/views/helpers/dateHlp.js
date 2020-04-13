module.exports = function(date) {
	let d = new Date(date);
	let minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes();
	let hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours();
	let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	let days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	return days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ' ' + hours + ':' + minutes;
};