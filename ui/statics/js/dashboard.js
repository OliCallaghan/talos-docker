$(function () {
	var newmon = false;

	$(document).keyup(function(e) {
		if (newmon) {
			if (e.keyCode === 27) { // escape
				$("monitornew").addClass('remove');
				newmon = false;
				setTimeout(function () {
					$('monitornew').css('visibility', 'hidden');
				}, 500);
			}
			if (e.keyCode === 13) { // enter
				createSite();
			}
		}
	});

	$('#new').click(function () {
		if (!newmon) {
			newmon = true;

			$('monitornew').css('visibility', 'visible');

			$('monitornew').removeClass('remove');
		}
	});

	function createSite() {
		socket.emit("create site", {
			user: userID,
			protocol: $('type.selected').attr('protocol'),
			refreshRate: $('#pollingrate').val() || 5,
			url: $("#new-name").val()
		}, function(success, site) {
			if (success) {
				console.log(site)
				var $newSite = $("<monitor data-site='"+site.id+"'><header>" + site.displayName + "</header><button id='dropdown'><i class='fa fa-angle-down' aria-hidden='true'></i></button><button id='remove'><i class='fa fa-trash' aria-hidden='true'></i></button>");
				$('monitornew').after($newSite);
				$('monitornew').addClass('remove');
				bindMonitorBehaviour();
				newmon = false;
				setTimeout(function () {
					$('monitornew').css('visibility', 'hidden');
					$("#new-name").val("");
				}, 500);
			} else {
				alert(site) // this becomes the error message
			}
		});
	}

	$("monitornew button").on("click", function(){
		createSite();
	});

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
		setTimeout(function () {
			$('monitornew').css('visibility', 'hidden');
		}, 500);
	});

	function bindMonitorBehaviour() {
		$('button#remove').off('click');
		$('monitor').children('#dropdown').off('click');

		$('monitor').children('#dropdown').click(function () {
			$(this).parent().toggleClass('extend');
			$(this).toggleClass('selected');
		});

		$('button#remove').click(function () {
			var msg = "confirm"
			if ($(this).text() == msg) {
				// TODO: Delete Element
				$(this).parent().addClass('remove');
				setTimeout(function () {
					$('monitor.remove').remove();
				}, 500);
			} else {
				$(this).text(msg);
				$(this).addClass('marked');
				setTimeout(function () {
					$('button.marked').html(`<i class="fa fa-trash" aria-hidden="true"></i>`);
					$('button.marked').removeClass('marked');
				}, 1000);
			}
		});
	}

	bindMonitorBehaviour();
});

var socket = io();
setInterval(function(){
	socket.emit("refresh sites", userID, function(sites) {
		console.log(sites);
	});
}, 2000);
