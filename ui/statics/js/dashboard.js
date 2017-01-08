$(document).ready(function () {
	var newmon = false;

	$('#new').click(function () {
		if (!newmon) {
			newmon = true;

			$('monitornew').removeClass('remove');

			$('unit').click(function () {
				$('#pollingrate').focus();
			});

			$('type').click(function () {
				$('type').removeClass('selected');
				$(this).addClass('selected');
			});

			$('btn').click(function () {
				$(this).parent().parent().addClass('remove');
				newmon = false;
			});
		}
	});
});

var socket = io();
setInterval(function(){
	socket.emit("refresh sites", userID, function(sites) {
		console.log(sites);
	});
}, 2000);
socket.emit("create site", {
	user: userID,
	refreshRate: 2,
	url: "https://finnian.io/random"
}, function(success, site) {
	if (success) {

	} else {
		alert(site) // this becomes the error message
	}
})