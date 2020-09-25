
console.log("Starting server...");

const express = require("express");
const bodyParser = require("body-parser");

const config = require("./config.json");
const database = require("./database.js");

function init() {
	const app = express();

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:true}));

	app.post("/getxp", (request, response) => {
		const email = request.body.email;
		const tokenExpireTime = request.body.tokenExpireTime;
		const token = request.body.token;

		//TODO validate input
		//TODO validate access token

		database.getXP(email).then((xp) => {
			response.end(JSON.stringify({
				xp:xp
			}));
		}).catch(() => {
			response.end(JSON.stringify({
				error:"Database error"
			}));
		});
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
});
