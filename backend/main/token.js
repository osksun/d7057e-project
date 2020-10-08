
const crypto = require("crypto");

const skipVerification = false;
let publicKey = null;

exports.isSkippingVerification = function() {
	return skipVerification;
};

function setPublicKey(pemKey) {
	if(skipVerification) {
		return true;
	}

	try {
		publicKey = crypto.createPublicKey({
			key:pemKey,
			format:"pem",
			type:"pkcs1"
		});
		return true;
	} catch(error) {
		console.error(error);
		return false;
	}
}
exports.setPublicKey = setPublicKey;

function validateAccessToken(id, expireTime, token) {
	if(skipVerification) {
		return true;
	}

	//Check if token has timed out
	if(Date.now() >= expireTime) {
		return false;
	}

	const verifier = crypto.createVerify("SHA256");
	verifier.update(id + ";" + expireTime);
	verifier.end();
	return verifier.verify(publicKey, token, "base64");
}
exports.validateAccessToken = validateAccessToken;
