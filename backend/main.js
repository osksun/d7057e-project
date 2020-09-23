
console.log("Starting server...");

const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const bcryptSaltRounds = 10;

const database = require("./database.js");

function registerUser(email, password) {
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, bcryptSaltRounds, (error, hash) => {
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

	app.post("/registeruser", (request, response) => {
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

	app.post("/loginuser", (request, response) => {
		const email = request.body.email;
		const password = request.body.password;

		//TODO validate input

		loginUser(email, password).then(() => {
			console.log("User logged in \"" + email + "\"");
			response.end(JSON.stringify({
				success:true
			}));
		}).catch(() => {
			response.end(JSON.stringify({
				success:false
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
