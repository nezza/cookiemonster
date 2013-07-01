function prefilter_check_if_hex(cookie) {
	var prefilter_obj = {};
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
	var prefilter_obj = {}
	prefilter_obj.shortname = "B64";
	prefilter_obj.name = "Base64";
	prefilter_obj.description = "The object is valid Base64.";
	if(is_valid_base64(cookie.value)) {
		cookie.prefilters.push(prefilter_obj);
	}
	return cookie;
}

function prefilter_check_if_md5(cookie) {
	var prefilter_obj = {}
	prefilter_obj.shortname = "MD5";
	prefilter_obj.name = "MD5 Hash";
	prefilter_obj.description = "The object is a valid MD5 hash.";
	if(is_valid_hex(cookie.value) && cookie.value.length==32) {
		cookie.prefilters.push(prefilter_obj);
	}
	return cookie;
}


function prefilter_check_if_sha1(cookie) {
	var prefilter_obj = {}
	prefilter_obj.shortname = "SHA-1";
	prefilter_obj.name = "SHA-1 Hash";
	prefilter_obj.description = "The object is a valid SHA-1 hash.";
	if(is_valid_hex(cookie.value) && cookie.value.length==40) {
		cookie.prefilters.push(prefilter_obj);
	}
	return cookie;
}

function prefilter_check_if_integer(cookie) {
	var prefilter_obj = {}
	prefilter_obj.shortname = "int";
	prefilter_obj.name = "Integer";
	prefilter_obj.description = "The object is a valid integer number.";
	if(is_valid_int(cookie.value)) {
		cookie.prefilters.push(prefilter_obj);
	}
	return cookie;
}

function prefilter_check_if_float(cookie) {
	var prefilter_obj = {}
	prefilter_obj.shortname = "float";
	prefilter_obj.name = "Float";
	prefilter_obj.description = "The object is a valid float.";
	if(is_valid_float(cookie.value)) {
		cookie.prefilters.push(prefilter_obj);
	}
	return cookie;
}

function prefilter_check_if_timestamp(cookie) {
	prefilter_obj = {}
	prefilter_obj.shortname = "timestamp";
	prefilter_obj.name = "timestamp";
	prefilter_obj.description = "The number could be a timestamp.";
	if(is_valid_int(cookie.value) && cookie.value.length == 10) {
		cookie.prefilters.push(prefilter_obj);
	}
	return cookie;
}

function prefilter_check_if_json(cookie) {
	try {
        JSON.parse(cookie.value);
        prefilter_obj = {}
		prefilter_obj.shortname = "json";
		prefilter_obj.name = "JSON";
		prefilter_obj.description = "The object is valid json.";
		cookie.prefilters.push(prefilter_obj);
        return cookie;
    } catch(e) {
        return cookie;  
    }
}

prefilters = [
	prefilter_check_if_b64,
	prefilter_check_if_hex,
	prefilter_check_if_md5,
	prefilter_check_if_sha1,
	prefilter_check_if_integer,
	prefilter_check_if_float,
	prefilter_check_if_json,
	prefilter_check_if_timestamp,
]