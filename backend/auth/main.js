
console.log("Starting server...");

const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const config = require("./config.json");
const database = require("./database.js");
const token = require("./token.js");

function registerUser(email, password) {
	return new Promise((resolve, reject) => {
		const passwordSaltRounds = 10;
		bcrypt.hash(password, passwordSaltRounds, (error, hash) => {
			if(error) {
				reject();
			} else {
				database.createUser(email, hash).then(() => {
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
			database.loginUser(email, password).then(() => {
				resolve();
			}).catch(() => {
				reject();
			});
	});
}

function validateEmail(email) {
	//Checks if email is not undefined
	if(email) {
		//Checks if the email is the correct type (String)
		if(typeof email === "string") {
			//Checks if the email length is within the range 0-254
			if(email.length > 0 && email.length <= 254) {
				//Checks if the email is in a valid form
				const mailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
				if(mailRegex.test(email)) {
					return true;
				}
			}
		}
	}
	return false;
}

function validatePassword(password) {
	//Checks if password is not undefined
	if(password) {
		//Checks if the password is the correct type (String)
		if(typeof password === "string") {
			//Checks if the password length is within the range 0-254
			if(password.length > 0 && password.length <= 254) {
				return true;
			}
		}
	}
	return false;
}

function validateRefreshToken(token) {
	//Checks if token is not undefined
	if(token) {
		//Checks if the token is the correct type (String)
		if(typeof token === "string") {
			//Checks if the token is the correct length
			if(token.length == 96) {
				//Checks if the token is in a valid format
				const tokenRegex = /^[a-f0-9]+$/;
				if(tokenRegex.test(token)) {
					return true;
				}
			}
		}
	}
	return false;
}

function init() {
	const app = express();

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:true}));

	app.post("/register", (request, response) => {
		const email = request.body.email;
		const password = request.body.password;

		if(validateEmail(email) && validatePassword(password)) {
			registerUser(email, password).then(() => {
				console.log("Registered user \"" + email + "\"");
				response.end(JSON.stringify({
					success:true
				}));
			}).catch(() => {
				response.end(JSON.stringify({
					success:false
				}));
			});
		} else {
			response.end(JSON.stringify({
				success:false
			}));
		}
	});

	app.post("/createrefreshtoken", (request, response) => {
		const email = request.body.email;
		const password = request.body.password;

		if(validateEmail(email) && validatePassword(password)) {
			loginUser(email, password).then(() => {
				console.log("Created refresh token for \"" + email + "\"");

				token.createRefreshToken(email).then((refreshToken) => {
					response.end(JSON.stringify({
						refreshToken:refreshToken
					}));
				}).catch(() => {
					response.end(JSON.stringify({
						error:"Failed to create refresh token"
					}));
				});

			}).catch(() => {
				response.end(JSON.stringify({
					error:"Login failed"
				}));
			});
		} else {
			response.end(JSON.stringify({
				error:"Malformed input"
			}));
		}
	});

	app.post("/createaccesstoken", (request, response) => {
		const email = request.body.email;
		const refreshToken = request.body.refreshToken

		if(validateEmail(email) && validateRefreshToken(refreshToken)) {
			token.createAccessToken(email, refreshToken).then(({expireTime, signature}) => {
				response.end(JSON.stringify({
					expireTime:expireTime,
					signature:signature
				}));
			}).catch(() => {
				response.end(JSON.stringify({
					error:"Failed to create access token"
				}));
			});
		} else {
			response.end(JSON.stringify({
				error:"Malformed input"
			}));
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
}

database.connect().then(() => {
	init();
}).catch(() => {
	console.error("Shutting down...");
	process.exit(1);
});
