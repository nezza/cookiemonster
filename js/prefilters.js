
function prefilter_check_if_hex(cookie) {
	console.log("CHECK IF HEX");
	prefilter_obj = {};
	prefilter_obj.name = "Hex";
	prefilter_obj.description = "The object is valid Hex.";
	if(is_valid_hex(cookie.value)) {
		cookie.prefilters.push(prefilter_obj);
	}
	return cookie;
}

function prefilter_check_if_b64(cookie) {
	// RegEx from: http://stackoverflow.com/questions/8571501/how-to-check-whether-the-string-is-base64-encoded-or-not
	console.log("CHECK IF b64")
	prefilter_obj = {}
	prefilter_obj.name = "Base64";
	prefilter_obj.description = "The object is valid Base64.";
	if(is_valid_base64(cookie.value)) {
		cookie.prefilters.push(prefilter_obj);
	}
	return cookie;
}

//^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/

prefilters = [
	prefilter_check_if_b64,
	prefilter_check_if_hex,
]