function prefilter_check_if_hex(cookie) {
	prefilter_obj = {};
	prefilter_obj.shortname = "Hex";
	prefilter_obj.name = "Hex";
	prefilter_obj.description = "The object is valid Hex.";
	if(is_valid_hex(cookie.value)) {
		cookie.prefilters.push(prefilter_obj);
	}
	return cookie;
}

function prefilter_check_if_b64(cookie) {
	// RegEx from: http://stackoverflow.com/questions/8571501/how-to-check-whether-the-string-is-base64-encoded-or-not
	prefilter_obj = {}
	prefilter_obj.shortname = "B64";
	prefilter_obj.name = "Base64";
	prefilter_obj.description = "The object is valid Base64.";
	if(is_valid_base64(cookie.value)) {
		cookie.prefilters.push(prefilter_obj);
	}
	return cookie;
}

function prefilter_check_if_md5(cookie) {
	prefilter_obj = {}
	prefilter_obj.shortname = "MD5";
	prefilter_obj.name = "MD5 Hash";
	prefilter_obj.description = "The object is a valid MD5 hash.";
	if(is_valid_hex(cookie.value) && cookie.value.length==32) {
		cookie.prefilters.push(prefilter_obj);
	}
	return cookie;
}


function prefilter_check_if_sha1(cookie) {
	prefilter_obj = {}
	prefilter_obj.shortname = "SHA-1";
	prefilter_obj.name = "SHA-1 Hash";
	prefilter_obj.description = "The object is a valid SHA-1 hash.";
	if(is_valid_hex(cookie.value) && cookie.value.length==40) {
		cookie.prefilters.push(prefilter_obj);
	}
	return cookie;
}

//^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/

prefilters = [
	prefilter_check_if_b64,
	prefilter_check_if_hex,
	prefilter_check_if_md5,
	prefilter_check_if_sha1,
]