function tracking_cookie(regex, category, description) {
	var tc = new Object();
	tc.regex = regex;
	tc.category = category;
	tc.description = description;
	return tc;
}

// good source: http://sociable.co/cookies/
tracking_cookies_definitions = {
	"__qca": null, // Quantacast, http://www.quantcast.com/how-we-do-it/consumer-choice/privacy-policy/
	"Google Analytics": [
		"^__utma$",
		"^__utmb$",
		"^__utmc$",
		"^__utmv$",
		"^__utmx$",
		"^__utmz$",
		"^_ga$",
	],
	"Webtrends": [
		"^WT_FPC$",
		"^WEBTRENDS_ID$",
	],
	"gaug.es": [ // Gitub tracking
		"^_gauges_unique_year$",
		"^_gauges_unique$",
		"^_gauges_unique_month$",
		"^_gauges_unique_hour$",
		"^_gauges_unique_day$",
	],
	"Piwik Web Analytics": [
		"^_pk_id\.1\.[a-fA-F0-9]{4}$",
		"^_pk_ref\.1\.[a-fA-F0-9]{4}$",
		"^_pk_cvar\.1\.[a-fA-F0-9]{4}$",
		"^_pk_ses\.1\.[a-fA-F0-9]{4}$",
	],
	"opentracker": [
		"^_otor$",
		"^_ots$",
		"^_otr$",
		"^_otui$",
		"^_otpe$",
	],
}

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

function get_domain_from_url(url) {
	// Regex from http://stackoverflow.com/questions/3689423/google-chrome-plugin-how-to-get-domain-from-url-tab-url
	return url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
}

function get_cookies_of_current_tab(callback) {
	get_current_tab(function(tab){
		chrome.cookies.getAll({"url":tab[0].url},function (cookie){
			var cookies = []
			for(var i=0;i<cookie.length;i++){
				cookies.push(cookie[i])
			}
			callback(cookie);
		});
	});
}

function is_tracking_cookie(cookiename) {
	for(var category in tracking_cookies_definitions) {
		for(var signature in tracking_cookies_definitions[category]) {
			var category_name = category;
			if(cookiename.match(tracking_cookies_definitions[category][signature])) {
				return {
					category: category_name,
					signature: tracking_cookies_definitions[category][signature]
				};
			}
		}
	}
	return null;
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
	cookie.is_tracking = false;
	cookie.tracking = {}
	cookie.is_known = false;
	cookie.prefilters = [];
	cookie.filters = [];

	cookie.undecoded_value = cookie.value;
	cookie.value = decodeURIComponent(cookie.value)

	var tracking;
	if(tracking = is_tracking_cookie(cookie.name)) {
		cookie.is_tracking = true;
		cookie.tracking = tracking;
	}

	cookie = prefilter_cookie(cookie);
	cookie = filter_cookie(cookie);
	return cookie;
}

function purify_cookie(cookie, url) {
	var ret = {};
	ret.url = url;
	ret.name = cookie.name;
	ret.value = cookie.value;
	ret.domain = cookie.domain;
	ret.path = cookie.path;
	ret.secure = cookie.secure;
	ret.httpOnly = cookie.httpOnly;
	ret.expirationDate = cookie.expirationDate;
	ret.storeId = cookie.storeId;
	return ret;
}

function CookieListCtrl($scope, $rootScope) {
	$scope.tracking_categories_opened = {}
	$scope.tracking_categories = {}
	$scope.cookies = [];
	$scope.curl_command = "";
	$scope.url = "";
	
	get_url_of_current_tab(function(url) {
		$scope.url = url;
		$scope.$apply("url");
	});

	$rootScope.$on('refreshCookies', function() {
		$scope.refresh_cookies();
	});

	$scope.refresh_cookies = function() {
		$scope.tracking_categories = {};
		$scope.cookies = [];
		
		get_cookies_of_current_tab(function(cookies) {
			curl_command = "curl -LO --cookie '";
			wget_command = "wget --no-cookies --header '";
			for(var i=0; i < cookies.length; i++) {
				cookies[i] = update_cookie_object(cookies[i])

				// Set up tracking cookie categories
				if(cookies[i].is_tracking) {
					var category = cookies[i].tracking.category;
					if(!(category in $scope.tracking_categories)) {
						$scope.tracking_categories[category] = [];
					}
					$scope.tracking_categories[category].push(cookies[i])
				}
				
				curl_command += cookies[i].name+"="+cookies[i].undecoded_value+";";
				wget_command += cookies[i].name+"="+cookies[i].undecoded_value+"; ";
			}

			curl_command += "' '"+$scope.url+"'";
			wget_command += "' '"+$scope.url+"'";

			cookies.sort(function(a,b) {
				var ta = a.name.toUpperCase();
				var tb = b.name.toUpperCase();
				return (ta < tb) ? -1 : (ta > tb) ? 1 : 0;
			});

			$scope.cookies = cookies;
			$scope.wget_command = wget_command;
			$scope.curl_command = curl_command;
			$scope.$apply("cookies");
			$scope.$apply("curl_command");
		});
	}
	$scope.refresh_cookies();

	$scope.save_cookie = function(cookie) {
		cookie.value = cookie.local_value;
		var ck = purify_cookie(cookie, $scope.url);

		chrome.cookies.set(ck, function() {
			$scope.$emit('refreshCookies');
		});
	}

	$scope.delete_cookie = function(cookie) {
		chrome.cookies.remove({url: $scope.url, name: cookie.name}, function() {
			$scope.$emit('refreshCookies');
		})
	}

	$scope.clear_cookies = function() {
		for(var i in $scope.cookies) {
			$scope.delete_cookie($scope.cookies[i]);
		}
	}
	
	// analyse cookie functions. Will take a cookie and a method to return value for the vield cookie.analysis
	$scope.analyse = function(cookie,method) {
		console.log("run analysis "+method);
		cookie.analysis = analysis_methods[method](cookie);
	}
}

function CookieSnapshotsCtrl($scope, $rootScope) {
	$scope.tab = null;
	$scope.cookies = [];
	

	$scope.snapshots = [];

	$rootScope.$on('refreshCookies', function() {
		$scope.refresh_cookies();
	});

	$scope.refresh_cookies = function() {
		get_current_tab(function(tab) {
			$scope.tab = tab[0];
			$scope.$apply("tab");
		});
		get_cookies_of_current_tab(function(cookies) {
			$scope.cookies = cookies;
			$scope.$apply("cookies");
		});
	}
	$scope.refresh_cookies();

	$scope.refresh_snapshots = function() {
		$scope.snapshots = [];
		chrome.storage.local.get(null, function(items) {
			for(var item in items) {
				if(items[item].domain !== get_domain_from_url($scope.tab.url)) continue;
				$scope.snapshots.push({
					"name": item,
					"cookies": items[item]});
			}
			$scope.$apply("snapshots");
		});
	}
	$scope.refresh_snapshots();

	$scope.create_snapshot = function() {
		var currentdate = new Date();
		var cookiename = get_domain_from_url($scope.tab.url) + " cookies " + currentdate.toLocaleString();
		var cookie_object = {
			domain: get_domain_from_url($scope.tab.url),
			cookies: $scope.cookies
		};
		var store = {}
		store[cookiename] = cookie_object;
		chrome.storage.local.set(store, function() {
			$scope.refresh_snapshots();
		});
	}

	$scope.get_snapshot = function(name) {
		chrome.storage.local.get(name, function(items) {
			for(var item in items) {
				for(var cookie in items[item].cookies) {
					var ck = items[item].cookies[cookie];

					if(!ck) continue;
					ck.url = $scope.tab.url;

					// Not supported by cookies.set
					delete ck.session;
					delete ck.hostOnly;

					chrome.cookies.set(ck);
				}
				$scope.$emit('refreshCookies');
			}
		});
	}

	$scope.delete_snapshot = function(name) {
		chrome.storage.local.remove(name, function() {
			$scope.refresh_snapshots();
		})
	}
}


function SettingsCtrl($scope, $rootScope) {
	
}