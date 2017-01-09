$(document).ready(function () {
	var newmon = false;

	$('#new').click(function () {
		if (!newmon) {
			newmon = true;

			$('monitornew').css('visibility', 'visible');

			$('monitornew').removeClass('remove');
			$(document).keyup(function(e) {
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
			});
		}
	});

	function createSite() {
		socket.emit("create site", {
			user: userID,
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
		$('monitor').children('#dropdown').click(function () {
			$(this).parent().toggleClass('extend');
			$(this).toggleClass('selected');
		});

		$('button#remove').off('click');

		$('button#remove').click(function () {
			var msg = "confirm"
			if ($(this).text() == msg) {
				// TODO: Delete Element
				alert('delet this');
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
