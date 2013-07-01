// Rails sessions consist of b64 data, a delimiter "--" and an hmac at the end
function filter_check_if_rails_session(cookie) {
	var value_parts = cookie.value.split("--");
	if(value_parts.length != 2) return cookie;
	var b64_part = value_parts[0];
	var hmac_part = value_parts[1];

	if(!is_valid_base64(b64_part)) return cookie;
	if(!is_valid_hex(hmac_part)) return cookie;
	if(hmac_part.length != 40) return cookie;

	var marshalled_object = "";
	try {
		marshalled_object = atob(b64_part);
	} catch(e) {
		return cookie;
	}

	var filter_obj = {}
	filter_obj.name ="Ruby on Rails session";
	filter_obj.shortname = "Rails Session";
	filter_obj.description = "Marshalled ruby object: " + marshalled_object;
	cookie.filters.push(filter_obj);
	return cookie;
}

// django session cookie is a 32byte hash string with the name sessionid
function filter_check_if_django_session(cookie) {
	if(cookie.name!="sessionid") return cookie;
	if(!is_valid_base64(cookie.value)) return cookie;
	if(cookie.value.length!=32) return cookie;

	var filter_obj = {}
	filter_obj.name = "Django session";
	filter_obj.shortname = "Django session";
	filter_obj.description = "Python Web framework django session cookie (https://docs.djangoproject.com/en/dev/topics/http/sessions/)";
	cookie.filters.push(filter_obj);
	return cookie;
}

// django csrf token cookie is a 32byte hash string with the name csrftoken
function filter_check_if_django_csfrtoken(cookie) {
	if(cookie.name!="csrftoken") return cookie;
	if(!is_valid_hex(cookie.value)) return cookie;
	if(cookie.value.length!=32) return cookie;

	var filter_obj = {}
	filter_obj.name = "Django CSRF Token";
	filter_obj.shortname = "Django CSRF";
	filter_obj.description = "Python Web framework django csrf token cookie (https://docs.djangoproject.com/en/dev/ref/contrib/csrf/)";
	cookie.filters.push(filter_obj);
	return cookie;
}

// php session id cookie is a string with the name PHPSESSID
function filter_check_if_php_session(cookie) {
	if(cookie.name!="PHPSESSID") return cookie;
	if(!is_valid_string(cookie.value)) return cookie;
	if(cookie.value.length!=32 && cookie.value.length!=26) return cookie;
	
	var filter_obj = {}
	filter_obj.name = "PHP session";
	filter_obj.shortname = "PHP session"
	filter_obj.description = "PHP session ID cookie (http://www.php.net/manual/en/function.session-id.php)";
	cookie.filters.push(filter_obj);
	return cookie;
}

function filter_check_if_expressionengine(cookie) {
	// http://ellislab.com/expressionengine
	// source: http://moogaloo.com/privacy/
	if(!cookie.name.match(/^exp_.+$/)) {
		return cookie;
	}
	var filter_obj = {}
	filter_obj.name = "ExpressionEngine CMS";
	filter_obj.shortname = "ExpressionEngine"
	filter_obj.description = "EllisLab ExpressionEngine CMS - http://ellislab.com/expressionengine";

	cookie.filters.push(filter_obj);
	return cookie;
}

function filter_check_if_jspsession(cookie) {
	if(cookie.name != "JSESSIONID") return cookie;

	var filter_obj = {}
	filter_obj.name = "JSP session";
	filter_obj.shortname = "JSP session"
	filter_obj.description = "Java Server Pages Session Cookie - http://www.oracle.com/technetwork/java/jsp-138432.html";
	
	cookie.filters.push(filter_obj);
	return cookie;
}

function filter_check_if_cloudflare_id(cookie) {
	if(cookie.name === "__cfduid") {
		var filter_obj = {}
		filter_obj.name = "Cloudflare cookie";
		filter_obj.shortname ="cloudflare";
		filter_obj.description = "Cloudflare Cookie - see https://support.cloudflare.com/entries/22437336-What-does-the-CloudFlare-cfduid-cookie-do-";
		cookie.filters.push(filter_obj);
	}
	return cookie;
}

filters = [
	filter_check_if_rails_session, 
	filter_check_if_django_session,
	filter_check_if_django_csfrtoken,
	filter_check_if_php_session,
	filter_check_if_expressionengine,
	filter_check_if_jspsession,
	filter_check_if_cloudflare_id,
]
