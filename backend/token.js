
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const refreshTokens = new Map();
const refreshTokenSaltRounds = 5;

function createRefreshToken(email) {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(48, (error, buffer) => {
			if(error) {
				reject();
			} else {
				const token = buffer.toString("hex");
				bcrypt.hash(token, refreshTokenSaltRounds, (error, tokenHash) => {
					if(error) {
						reject();
					} else {
						//Expire in 1 week
						const expireTime = Date.now() + 7 * 24 * 60 * 60 * 1000;

						let userTokens;
						if(!refreshTokens.has(email)) {
							userTokens = [];
							refreshTokens.set(email, []);
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

