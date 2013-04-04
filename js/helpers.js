function is_valid_hex(data) {
	if((data.length%2) != 0) return false;
	if(data.match(/^([a-fA-F0-9]){2,}$/)) {
		return true;
	}
	return false;
}

function is_valid_base64(data) {
	// RegEx from: http://stackoverflow.com/questions/8571501/how-to-check-whether-the-string-is-base64-encoded-or-not
	if(data.match(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/)) {
		return true;
	}
	return false;
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

function generate_cookie_header_list(cookies) {
	var cookie_list = "";
	for(var i=0; i < cookies.length; i++) {
		cookie_list += cookies[i].name + "=" + cookies[i].undecoded_value + ";";
	}
	return cookie_list;
}

function generate_wget_command(cookies, url) {
	wget_command = "wget --no-cookies --header 'Cookie: "
	wget_command += generate_cookie_header_list(cookies);
	wget_command += "' '" + url + "'";
	return wget_command;
}

function generate_curl_command(cookies, url) {
	curl_command = "curl -LO --cookie '";
	curl_command += generate_cookie_header_list(cookies);
	curl_command += "' '" + url + "'";
	return curl_command;
}
