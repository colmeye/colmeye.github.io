var now = new Date(Date.now());

// Get day of the week
var day = now.getDate();

// Get shortened month
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var month = monthNames[now.getMonth()];

// Get hours and minutes
var formatted = now.getHours() + ":" + now.getMinutes();

// Combine them
$('#date-time').html(day + '&nbsp;' + month + '&nbsp;&nbsp;&nbsp;' +formatted);