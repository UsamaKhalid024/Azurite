

function isLightnig() {

	return window.location.href.indexOf('lightning') >= 0;
}

function parseUrlQueryString(queryString) {
	var params = {};
	if (typeof queryString !== 'string') {
		return params;
	}

	if (queryString.charAt(0) === '?') {
		queryString = queryString.slice(1);
	}

	if (queryString.length === 0) {
		return params;
	}

	var pairs = queryString.split('&');
	for (var i = 0; i < pairs.length; i++) {
		var pair = pairs[i].split('=');
		params[pair[0]] = !!pair[1] ? decodeURIComponent(pair[1]) : null;
	}

	return params;
}


function redirectWithOpenCTIAuth(url, params) {
	var isLightning = isLightnig();
	if(isLightning) {
		var sfdcIframeOrigin = params['sfdcIframeOrigin'];
		var mode = params['mode'];
		var nonce = params['nonce'];
		var ltn_app_id = params['ltn_app_id'];
		var isdtp = params['isdtp'];
		var clc = params['clc'];
		var errorCode = params['errorCode'];



		var redirect_uri_ = url + '?sfdcIframeOrigin='
						+ sfdcIframeOrigin
						+ '&mode=' + mode
						+ '&ltn_app_id=' + ltn_app_id
						+ '&isdtp=' + isdtp
						+ '&clc=' + clc
						+ '&nonce=' + nonce
						+ '&lightning=true';
		if(errorCode) {
			redirect_uri_ = redirect_uri_ + '&errorCode=' + errorCode;
		}
		//window.location.href = redirect_uri_;
		window.location.replace(redirect_uri_);

	} else {
		var sfdcIFrameOrigin = params['sfdcIFrameOrigin'];
		var nonce = params['nonce'];
		var errorCode = params['errorCode'];
		var redirect_uri_ = url + '?sfdcIFrameOrigin=' + sfdcIFrameOrigin + '&nonce=' + nonce;
		if(errorCode) {
			redirect_uri_ = redirect_uri_ + '&errorCode=' + errorCode;
		}
		//window.location.href = redirect_uri_;
		window.location.replace(redirect_uri_);
	}
}