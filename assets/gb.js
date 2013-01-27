$(function() {
	var localBag = tiddlyweb.status.space.name + '_public',
		allURI = '/bags/' + localBag + '/tiddlers',
		elderURI = allURI + '?sort=modified;limit=20',
		alls = {},
		fronts = {};

	$(document).bind('frontsup', function() {
		var missings = [],
			orphans = [];


		// calculate the data
		$.each(fronts, function(key, value) {
			if (!alls[key]) {
				missings.push(key);
			}
		});
		$.each(alls, function(key, value) {
			if (!fronts[key]) {
				orphans.push(key);
			}
		});

		// update the display
		$('#orphans').empty();
		$.each(orphans, function(index, title) {
			var link = $('<a>').attr('href', '/' + encodeURIComponent(title))
				.text(title);
			var list = $('<li>').append(link);
			$('#orphans').append(list);
		});
		$('#missing').empty();
		$.each(missings, function(index, title) {
			var link = $('<a>').attr({
				'href': '/' + encodeURIComponent(title),
				'title': fronts[title].join(', ')})
				.text(title);
			var list = $('<li>').append(link);
			$('#missing').append(list);
		});
	});

	function startFront(tiddler) {
		links(tiddler, 'frontlinks', addFront);
	}

	function addFront(tiddlers, source_tiddler) {
		$.each(tiddlers, function(index, tiddler) {
			if (tiddler.bag === localBag) {
				if (fronts[tiddler.title]) {
					fronts[tiddler.title].push(source_tiddler.title);
				} else {
					fronts[tiddler.title] = [source_tiddler.title];
				}
			}
		});
		$(document).trigger('frontsup');
	}

	function links(tiddler, path, updater) {
		$.ajax({
			dataType: 'json',
			url: tiddler.uri + '/' + path,
			success: function(tiddlers) {
				updater(tiddlers, tiddler);
			}
		});
	}

	$.ajax({
		dataType: 'json',
		url: allURI,
		success: function(tiddlers) {
			$.each(tiddlers, function(index, tiddler) {
				alls[tiddler.title] = 1;
				startFront(tiddler);
			});
		}
	});

	$.ajax({
		dataType: 'json',
		url: elderURI,
		success: function(tiddlers) {
			$('#elders').empty();
			$.each(tiddlers, function(index, tiddler) {
				var link = $('<a>').attr('href', tiddler.uri).text(tiddler.title);
				var list = $('<li>').append(link);
				$('#elders').append(list);
			});
		}
	});

});
