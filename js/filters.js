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

	filter_obj = {}
	filter_obj.name ="Ruby on Rails session";
	filter_obj.description = "Marshalled ruby object: " + marshalled_object;
	cookie.filters.push(filter_obj);
	return cookie;
}

filters = [
	filter_check_if_rails_session,
]