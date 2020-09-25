
console.log("Starting server...");

const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

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

function init() {
	const app = express();

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:true}));

	app.post("/register", (request, response) => {
		const email = request.body.email;
		const password = request.body.password;

		//TODO validate input

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
	});

	app.post("/createrefreshtoken", (request, response) => {
		const email = request.body.email;
		const password = request.body.password;

		//TODO validate input

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
	});

	app.post("/createaccesstoken", (request, response) => {
		const email = request.body.email;
		const refreshToken = request.body.refreshToken;

		//TODO validate input

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
	});

	app.listen(80);
	console.log("Server running on port 80!");
}

database.connect().then(() => {
	init();
}).catch(() => {
	console.error("Shutting down...");
});
