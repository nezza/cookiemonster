// good source: http://sociable.co/cookies/
// TODO: These should be objects with description + subcategories
tracking_cookies = [
	"__qca", // Quantacast, http://www.quantcast.com/how-we-do-it/consumer-choice/privacy-policy/
	"__utma", // Google Analytics Tracking
	"__utmb",
	"__utmc",
	"__utmv",
	"__utmx",
	"__utmz",
	"_ga", // end of google tracking
	"WT_FPC", // Webtrends
	"WEBTRENDS_ID", // end of webtrends
	"_gauges_unique_year", // gaug.es (by github) analytics
	"_gauges_unique",
	"_gauges_unique_month",
	"_gauges_unique_hour",
	"_gauges_unique_day", // end of gaug.es
	"_pk_id\.1\.[a-fA-F0-9]{4}", // piwik.org Web Analytics
	"_pk_ref\.1\.[a-fA-F0-9]{4}",
	"_pk_cvar\.1\.[a-fA-F0-9]{4}",
	"_pk_ses\.1\.[a-fA-F0-9]{4}", // end of piwik
]

function get_current_tab(callback) {
	chrome.tabs.query({"status":"complete","windowId":chrome.windows.WINDOW_ID_CURRENT,"active":true}, function(tab){
		callback(tab);
	});

}

function get_url_of_current_tab(callback) {
	get_current_tab(function(tab) {
		callback(tab[0].url);
	});
}

function get_cookies_of_current_tab(callback) {
	get_current_tab(function(tab){
		chrome.cookies.getAll({"url":tab[0].url},function (cookie){
			cookies = []
			for(i=0;i<cookie.length;i++){
				cookies.push(cookie[i])
			}
			callback(cookie);
		});
	});
}

function prefilter_cookie(cookie) {
	for(var i=0; i < prefilters.length; i++) {
		cookie = prefilters[i](cookie);
	}
	return cookie;
}

function filter_cookie(cookie) {
	for(var i=0; i < filters.length; i++) {
		cookie = filters[i](cookie);
	}
	return cookie;
}

function update_cookie_object(cookie) {
	cookie.is_analytics = false;
	cookie.is_known = false;
	cookie.prefilters = [];
	cookie.filters = [];

	cookie.undecoded_value = cookie.value;
	cookie.value = decodeURIComponent(cookie.value)

	for(var i=0; i < tracking_cookies.length; i++) {
		if(cookie.name.match(tracking_cookies[i])) {
			cookie.is_analytics = true;
		}
	}

	cookie = prefilter_cookie(cookie);
	cookie = filter_cookie(cookie);
	return cookie;
}

function CookieListCtrl($scope) {
	$scope.cookies = [];
	get_cookies_of_current_tab(function(cookies) {
		for(var i=0; i < cookies.length; i++) {
			cookies[i] = update_cookie_object(cookies[i])
		}
		$scope.cookies = cookies;
		$scope.$apply("cookies");
	});
	$scope.url = "";
	get_url_of_current_tab(function(url) {
		$scope.url = url;
		$scope.$apply("url");
	});
}