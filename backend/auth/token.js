
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const fs = require("fs");

require("../replaceAll_polyfill.js");

const refreshTokens = new Map();
const refreshTokenSaltRounds = 5;
const refreshTokenSalt = bcrypt.genSaltSync(refreshTokenSaltRounds);

function createRefreshToken(userID) {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(48, (error, buffer) => {
			if(error) {
				reject();
			} else {
				const token = buffer.toString("base64");
				bcrypt.hash(token, refreshTokenSalt, (error, tokenHash) => {
					if(error) {
						reject();
					} else {
						//Expire in 1 week
						const expireTime = Date.now() + 7 * 24 * 60 * 60 * 1000;

						let userTokens;
						if(!refreshTokens.has(userID)) {
							userTokens = [];
							refreshTokens.set(userID, userTokens);
						} else {
							userTokens = refreshTokens.get(userID);
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

function clearRefreshTokens(userID) {
	refreshTokens.set(userID, []);
}
exports.clearRefreshTokens = clearRefreshTokens;

function writeKeyToFile(path, key) {
	const keyString = key.export({type:"pkcs1", format:"pem"});

	fs.writeFileSync(path, keyString);
}

let privateKey = null;
let publicKey = null;

try {
	privateKey = crypto.createPrivateKey(fs.readFileSync("private_key"));
	publicKey = crypto.createPublicKey(privateKey);
} catch {
	const keypair = crypto.generateKeyPairSync("rsa", {
		modulusLength:2048
	});
	privateKey = keypair.privateKey;
	publicKey = keypair.publicKey;

	writeKeyToFile("private_key", privateKey);
} finally {
	writeKeyToFile("public_key", publicKey);
}

function createAccessToken(userID, refreshToken) {
	return new Promise((resolve, reject) => {
		bcrypt.hash(refreshToken, refreshTokenSalt, (error, refreshTokenHash) => {
			if(error) {
				reject();
			} else {
				if(refreshTokens.has(userID)) {
					const userRefreshTokens = refreshTokens.get(userID);

					for(let i = 0; i < userRefreshTokens.length; ++i) {
						if(userRefreshTokens[i].tokenHash == refreshTokenHash) {
							if(Date.now() > userRefreshTokens[i].expireTime) {
								//Refresh token has expired
								reject();
							} else {
								//Expire in 5 minutes
								const expireTime = Date.now() + 5 * 60 * 1000;

								const sign = crypto.createSign("SHA256");
								sign.update(userID + ";" + expireTime);
								sign.end();
								const signature = sign.sign(privateKey).toString("base64");

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
					//User ID not found in refresh tokens list
					reject();
				}
			}
		});
	});
}
exports.createAccessToken = createAccessToken;
