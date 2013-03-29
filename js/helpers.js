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