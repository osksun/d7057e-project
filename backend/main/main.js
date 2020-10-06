
console.log("Starting server...");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const readline = require("readline").createInterface({
	input:process.stdin,
	output:process.stdout
});

const config = require("./config.json");
const database = require("./database.js");
const token = require("./token.js");
require("../replaceAll_polyfill.js");

function init() {
	const app = express();

	app.use(cors({
		origin:"http://127.0.0.1:3000",
		optionsSuccessStatus:200
	}));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:true}));

	app.post("/getxp", (request, response) => {
		const email = request.body.email;
		const tokenExpireTime = request.body.tokenExpireTime;
		const accessToken = request.body.token;

		//TODO validate input

		if(token.validateAccessToken(email, tokenExpireTime, accessToken)) {
			database.getXP(email).then((xp) => {
				response.end(JSON.stringify({
					xp:xp
				}));
			}).catch(() => {
				response.end(JSON.stringify({
					error:"Database error"
				}));
			});
		} else {
			response.end(JSON.stringify({
				error:"Invalid token"
			}));
		}
	});

	app.post("/getcourses", (request, response) => {
		const email = request.body.email;
		const tokenExpireTime = request.body.tokenExpireTime;
		const accessToken = request.body.token;

		//TODO validate input

		if(token.validateAccessToken(email, tokenExpireTime, accessToken)) {
			database.getCourses().then((courses) => {
				response.end(JSON.stringify(courses));
			}).catch(() => {
				response.end(JSON.stringify({
					error:"Database error"
				}));
			});
		} else {
			response.end(JSON.stringify({
				error:"Invalid token"
			}));
		}
	});

	app.post("/getmodules", (request, response) => {
		const email = request.body.email;
		const tokenExpireTime = request.body.tokenExpireTime;
		const accessToken = request.body.token;

		const courseName = request.body.course;

		//TODO validate input

		if(token.validateAccessToken(email, tokenExpireTime, accessToken)) {
			database.getModules(courseName).then((modules) => {
				response.end(JSON.stringify(modules));
			}).catch(() => {
				response.end(JSON.stringify({
					error:"Database error"
				}));
			});
		} else {
			response.end(JSON.stringify({
				error:"Invalid token"
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

function initDatabase() {
	database.connect().then(() => {
		init();
	}).catch(() => {
		console.error("Shutting down...");
		process.exit(1);
	});
}

if(token.isSkippingVerification) {
	console.log("WARNING skipping access token verification! For debug purposes only!");
	initDatabase();
} else {
	readline.question("Input auth public key: ", (publicKey) => {
		publicKey = publicKey.replaceAll("\\n", "\n");
		if(token.setPublicKey(publicKey)) {
			console.log("Public key is valid");
			initDatabase();
		} else {
			console.error("Invalid public key!");
			console.error("Shutting down...");
			process.exit(2);
		}
	});
}
