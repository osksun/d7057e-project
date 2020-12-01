
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let captchaSecret = null;

function setSecret(secret) {
	captchaSecret = secret;
}
exports.setSecret = setSecret;

function verify(captchaToken) {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.addEventListener("load", () => {
			let json;
			try {
				json = JSON.parse(request.responseText);
			} catch {
				json = null;
			}

			if(json["success"] == true) {
				resolve();
			} else {
				reject();
			}
		});
		request.addEventListener("error", (e) => {
			reject();
		});
		request.open("POST", "https://www.google.com/recaptcha/api/siteverify?response=" + encodeURIComponent(captchaToken) + "&secret=" + encodeURIComponent(captchaSecret), true);
		request.send();
	});
}
exports.verify = verify;
