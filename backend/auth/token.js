
const crypto = require("crypto");
const bcrypt = require("bcrypt");

require("../replaceAll_polyfill.js");

const refreshTokens = new Map();
const refreshTokenSaltRounds = 5;
const refreshTokenSalt = bcrypt.genSaltSync(refreshTokenSaltRounds);

function createRefreshToken(email) {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(48, (error, buffer) => {
			if(error) {
				reject();
			} else {
				const token = buffer.toString("hex");
				bcrypt.hash(token, refreshTokenSalt, (error, tokenHash) => {
					if(error) {
						reject();
					} else {
						//Expire in 1 week
						const expireTime = Date.now() + 7 * 24 * 60 * 60 * 1000;

						let userTokens;
						if(!refreshTokens.has(email)) {
							userTokens = [];
							refreshTokens.set(email, userTokens);
						} else {
							userTokens = refreshTokens.get(email);
						}

						//Remove oldest refresh token
						if(userTokens.length > 20) {
							userTokens.shift();
						}

						userTokens.push({
							expireTime:expireTime,
							tokenHash:tokenHash
						});

						resolve(token);
					}
				});
			}
		});
	});
}
exports.createRefreshToken = createRefreshToken;

const {privateKey, publicKey} = crypto.generateKeyPairSync("rsa", {
  modulusLength:2048
});

let publicKeyString = publicKey.export({type:"pkcs1", format:"pem"});
publicKeyString = publicKeyString.replaceAll("\n", "\\n");
console.log("Auth public key:\n" + publicKeyString);

function createAccessToken(email, refreshToken) {
	return new Promise((resolve, reject) => {
		bcrypt.hash(refreshToken, refreshTokenSalt, (error, refreshTokenHash) => {
			if(error) {
				reject();
			} else {
				if(refreshTokens.has(email)) {
					const userRefreshTokens = refreshTokens.get(email);

					for(let i = 0; i < userRefreshTokens.length; ++i) {
						if(userRefreshTokens[i].tokenHash == refreshTokenHash) {
							if(Date.now() > userRefreshTokens[i].expireTime) {
								//Refresh token has expired
								reject();
							} else {
								//Expire in 5 minutes
								const expireTime = Date.now() + 5 * 60 * 1000;

								const sign = crypto.createSign("SHA256");
								sign.update(email + ";" + expireTime);
								sign.end();
								const signature = sign.sign(privateKey).toString("hex");

								resolve({
									expireTime:expireTime,
									signature:signature
								});
								return;
							}
						}
					}

					//Refresh token not found
					reject();
				} else {
					//Email not found in refresh tokens list
					reject();
				}
			}
		});
	});
}
exports.createAccessToken = createAccessToken;
