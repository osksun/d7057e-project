
const captcha = new function() {
	this.trigger = function() {
		return new Promise((resolve, reject) => {
			grecaptcha.ready(function() {
				grecaptcha.execute("6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", {action:"register"}).then((token) => {
					resolve(token);
				}).catch(() => {
					reject();
				});
			});
		});
	};
}();
