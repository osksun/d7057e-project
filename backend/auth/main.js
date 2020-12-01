
console.log("Starting server...");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const config = require("./config.json");
const database = require("./database.js");
const token = require("./token.js");
const captcha = require("./captcha.js");

const errorCode = require("../error_code.js");
const validation = require("../validation.js");

function registerUser(email, password) {
	return new Promise((resolve, reject) => {
		const passwordSaltRounds = 10;
		bcrypt.hash(password, passwordSaltRounds, (error, hash) => {
			if(error) {
				console.error(error);
				reject();
			} else {
				database.createUser(email, hash).then((userID) => {
					resolve(userID);
				}).catch((error) => {
					reject(error);
				});
			}
		});
	});
}

function changeUserPassword(userID, password) {
	return new Promise((resolve, reject) => {
		const passwordSaltRounds = 10;
		bcrypt.hash(password, passwordSaltRounds, (error, hash) => {
			if(error) {
				console.error(error);
				reject();
			} else {
				database.changeUserPassword(userID, hash).then(() => {
					resolve();
				}).catch(() => {
					reject();
				});
			}
		});
	});
}

function loginUser(email, password) {
	return new Promise((resolve, reject) => {
			database.loginUser(email, password).then((user) => {
				resolve(user);
			}).catch(() => {
				reject();
			});
	});
}

function init() {
	const app = express();

	app.use(cors({
		origin:"http://127.0.0.1:3000",
		optionsSuccessStatus:200
	}));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:true}));

	app.post("/register", (request, response) => {
		const email = request.body.email;
		const password = request.body.password;
		let captchaToken = request.body.captcha;
		if(captchaToken == "null") {
			captchaToken = null;
		}

		if(validation.validateEmail(email) && validation.validatePassword(password) && validation.validateStringMaxWithNull(captchaToken)) {
			captcha.verify(captchaToken).then(() => {
				registerUser(email, password).then((userID) => {
					console.log("Registered user \"" + email + "\"");

					token.createRefreshToken(userID).then((refreshToken) => {
						response.json({
							userID:userID,
							refreshToken:refreshToken
						});
					}).catch(() => {
						response.json({
							error:"Failed to create refresh token",
							errorCode:errorCode.failedTokenCreation
						});
					});
				}).catch((error) => {
					response.json(error);
				});
			}).catch(() => {
				response.json({
					error:"Captcha error",
					errorCode:errorCode.captchaError
				});
			});
		} else {
			response.json({
				error:"Malformed input",
				errorCode:errorCode.malformedInput
			});
		}
	});

	app.post("/changepassword", (request, response) => {
		const userID = parseInt(request.body.userID, 10);
		const currentPassword = request.body.currentPassword;
		const newPassword = request.body.newPassword;

		if(validation.validateUnsignedInt(userID) && validation.validatePassword(currentPassword) && validation.validatePassword(newPassword)) {
			database.loginUserID(userID, currentPassword).then(() => {
				changeUserPassword(userID, newPassword).then(() => {
					token.clearRefreshTokens(userID);

					token.createRefreshToken(userID).then((refreshToken) => {
						response.json({
							userID:userID,
							refreshToken:refreshToken
						});
					}).catch(() => {
						response.json({
							error:"Failed to create refresh token",
							errorCode:errorCode.failedTokenCreation
						});
					});
				}).catch(() => {
					response.json({
						error:"Failed to change password",
						errorCode:errorCode.failedPasswordChange
					});
				});
			}).catch(() => {
				response.json({
					error:"Failed to verify current password",
					errorCode:errorCode.failedPasswordVerification
				});
			});
		} else {
			response.json({
				error:"Malformed input",
				errorCode:errorCode.malformedInput
			});
		}
	});

	app.post("/createrefreshtoken", (request, response) => {
		const email = request.body.email;
		const password = request.body.password;

		if(validation.validateEmail(email) && validation.validatePassword(password)) {
			loginUser(email, password).then((user) => {
				const userID = user.id;
				const userDeleted = user.deleted;

				if(userDeleted) {
					response.json({
						userID:userID,
						refreshToken:null
					});
				} else {
					console.log("Created refresh token for \"" + email + "\"");

					token.createRefreshToken(userID).then((refreshToken) => {
						response.json({
							userID:userID,
							refreshToken:refreshToken
						});
					}).catch(() => {
						response.json({
							error:"Failed to create refresh token",
							errorCode:errorCode.failedTokenCreation
						});
					});
				}
			}).catch(() => {
				response.json({
					error:"Login failed",
					errorCode:errorCode.loginFailed
				});
			});
		} else {
			response.json({
				error:"Malformed input",
				errorCode:errorCode.malformedInput
			});
		}
	});

	app.post("/createaccesstoken", (request, response) => {
		const userID = parseInt(request.body.userID, 10);
		const refreshToken = request.body.refreshToken;

		if(validation.validateUnsignedInt(userID) && validation.validateRefreshToken(refreshToken)) {
			token.createAccessToken(userID, refreshToken).then(({expireTime, signature}) => {
				response.json({
					expireTime:expireTime,
					signature:signature
				});
			}).catch(() => {
				response.json({
					error:"Failed to create access token",
					errorCode:errorCode.failedTokenCreation
				});
			});
		} else {
			response.json({
				error:"Malformed input",
				errorCode:errorCode.malformedInput
			});
		}
	});

	app.post("/recover", (request, response) => {
		const email = request.body.email;
		const password = request.body.password;

		if(validation.validateEmail(email) && validation.validatePassword(password)) {
			loginUser(email, password).then((user) => {
				const userID = user.id;
				const userDeleted = user.deleted;
				if(userDeleted) {
					database.recoverUserID(userID).then(() => {
						response.json({
							success:true
						});
					}).catch((error) => {
						response.json(error);
					});
				} else {
					response.json({
						error:"User already recovered",
						errorCode:errorCode.userAlreadyRecovered
					});
				}
			}).catch(() => {
				response.json({
					error:"Failed to verify current password",
					errorCode:errorCode.failedPasswordVerification
				});
			});
		} else {
			response.json({
				error:"Malformed input",
				errorCode:errorCode.malformedInput
			});
		}
	});

	app.post("/delete", (request, response) => {
		const userID = parseInt(request.body.userID, 10);
		const password = request.body.password;

		if(validation.validateUnsignedInt(userID) && validation.validatePassword(password)) {
			database.loginUserID(userID, password).then(() => {
				database.softDeleteUserID(userID).then(() => {
					token.clearRefreshTokens(userID);
					response.json({
						success:true
					});
				}).catch((error) => {
					response.json(error);
				});
			}).catch(() => {
				response.json({
					error:"Failed to verify current password",
					errorCode:errorCode.failedPasswordVerification
				});
			});
		} else {
			response.json({
				error:"Malformed input",
				errorCode:errorCode.malformedInput
			});
		}
	});

	const port = parseInt(config["port"], 10);
	if(isNaN(port)) {
		console.error("Config specifies invalid port");
	} else {
		if(port < 0 || port > 65535) {
			console.error("Config port should be between 0 and 65535");
		} else {
			app.listen(port);
			console.log("Server running on port " + port + "!");
		}
	}

	database.purgeExpiredUsers().catch(() => {
		//Errors printed in database.js
	});
	setInterval(() => {
		database.purgeExpiredUsers().catch(() => {
			//Errors printed in database.js
		});
	}, 60 * 60 * 1000);
}

if(config.hasOwnProperty("captchaSecret")) {
	captcha.setSecret(config["captchaSecret"]);
	database.connect().then(() => {
		init();
	}).catch((error) => {
		console.error(error);
		console.error("Shutting down...");
		process.exit(1);
	});
} else {
	console.error("Error: Captcha secret is not defined");
	console.error("Shutting down...");
	process.exit(1);
}
