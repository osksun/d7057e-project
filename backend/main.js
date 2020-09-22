
console.log("Starting server...");

const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const bcryptSaltRounds = 10;

const database = require("./database.js");

function registerUser(email, passwordHash) {
	return new Promise((resolve, reject) => {
		bcrypt.hash(passwordHash, bcryptSaltRounds, (error, hash) => {
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

function init() {
	const app = express();

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:true}));

	app.post("/registeruser", (request, response) => {
		const email = request.body.email;
		const passwordHash = request.body.password;

		//TODO validate input

		registerUser(email, passwordHash).then(() => {
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

	app.listen(80);
	console.log("Server running on port 80!");
}

database.connect().then(() => {
	init();
}).catch(() => {
	console.error("Shutting down...");
});
