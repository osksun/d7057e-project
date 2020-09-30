
const crypto = require("crypto");

let publicKey = null;

function setPublicKey(pemKey) {
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

function validateAccessToken(email, expireTime, token) {
	//Check if token has timed out
	if(Date.now() >= expireTime) {
		return false;
	}

	const verifier = crypto.createVerify("SHA256");
	verifier.update(email + ";" + expireTime);
	verifier.end();
	return verifier.verify(publicKey, token, "hex");
}
exports.validateAccessToken = validateAccessToken;
