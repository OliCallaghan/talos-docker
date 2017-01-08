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
	$("monitornew button").on("click", function(){
		socket.emit("create site", {
			user: userID,
			refreshRate: $('#pollingrate').val() || 5,
			url: $("#new-name").val()
		}, function(success, site) {
			if (success) {
				console.log(site)
				var $newSite = $("<monitor data-site='"+site.id+"'><header>" + site.displayName + "</header><button><i class='fa fa-angle-right' aria-hidden='true'></i></button>");
				$newSite.appendTo("#sites");
			} else {
				alert(site) // this becomes the error message
			}
		})
	})
});

var socket = io();
setInterval(function(){
	socket.emit("refresh sites", userID, function(sites) {
		console.log(sites);
	});
}, 2000);
