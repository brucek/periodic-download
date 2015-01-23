var RequestApp = (function() {

	var requestApp = function(options) {
		if (!options.downloadFrequencyMinutes) {
			throw 'downloadFrequencyMinutes is missing from sources.json';
		}

		if (!options.sourceList) {
			throw 'sourceList is missing from sources.json';
		}

		this.frequency = options.downloadFrequencyMinutes;
		this.sources = options.sourceList;

		this.dataStore = new IDBStore({
			storeName: 'rss',
			keyPath: 'rssid',
			autoIncrement: true
		});
	};

	(function(p) {

		p.getTimerInterval = function() {
			var interval = this.frequency / this.sources.length;
			return interval * 60000;
		};

		p.run = function() {
			this.startTimer();
		};

		p.startTimer = function() {
			var timerInterval = this.getTimerInterval();

			this.timer = setInterval(this.tick.bind(this), timerInterval);
		};

		p.tick = function() {
			this.sourcePosition = (this.sourcePosition || 0) + 1;

			if (this.sourcePosition > this.sources.length - 1) {
				this.sourcePosition = 0;
			}

			var source = this.sources[this.sourcePosition];

			this.requestFeed(source[0], source[1]);
		};

		p.requestFeed = function(name, url) {
			var start = new Date();

			var self = this;

			$.ajax({
			    url: url,
			    type: 'GET',
			    dataType: 'text',
			    success: function(response) {
			    	var end = new Date();
			        self.saveData(name, url, response, start, end);
			    }
			});

		};

		p.saveData = function(name, url, data, start, end) {
			var data = {
				rssid: url,
				name: name,
				data: data,
				start: start.toString(),
				end: end.toString()
			};

			this.dataStore.put(data);
		};

	})(requestApp.prototype);

	return requestApp;

})();

var appInstance = null;

$.getJSON(chrome.extension.getURL('/js/sources.json'), function(data) {
	appInstance = new RequestApp(data);
	appInstance.run();
});