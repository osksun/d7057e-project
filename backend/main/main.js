
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
const validation = require("../validation.js");
require("../replaceAll_polyfill.js");

function init() {
	const app = express();

	app.use(cors({
		origin:"http://127.0.0.1:3000",
		optionsSuccessStatus:200
	}));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:true}));

	function validateUser(request, response) {
		return new Promise((resolve, reject) => {
			const userID = parseInt(request.body.userID, 10);
			const tokenExpireTime = parseInt(request.body.tokenExpireTime, 10);
			const accessToken = request.body.token;

			if((validation.validateUnsignedInt(userID) && validation.validateTokenExpire(tokenExpireTime) && validation.validateAccessToken(accessToken)) || token.isSkippingVerification()) {
				if(token.validateAccessToken(userID, tokenExpireTime, accessToken)) {
					resolve(userID);
				} else {
					reject("Invalid token");
				}
			} else {
				reject("Malformed input");
			}
		});
	}

	function validateAdmin(request, response) {
		return new Promise((resolve, reject) => {
			validateUser(request, response).then((userID) => {
				database.getUserIsAdmin(userID).then((isAdmin) => {
					if(isAdmin) {
						resolve(userID);
					} else {
						reject("Permission denied");
					}
				}).catch(() => {
					reject("Database error");
				});
			}).catch((error) => {
				reject(error);
			});
		});
	}

	//User functions
	app.post("/getxp", (request, response) => {
		validateUser(request, response).then((userID) => {
			database.getXP(userID).then((xp) => {
				response.end(JSON.stringify({
					xp:xp
				}));
			}).catch(() => {
				response.end(JSON.stringify({
					error:"Database error"
				}));
			});
		}).catch((error) => {
			response.end(JSON.stringify({
				error:error
			}));
		});
	});

	app.post("/getcourses", (request, response) => {
		validateUser(request, response).then((userID) => {
			database.getCourses().then((courses) => {
				response.end(JSON.stringify(courses));
			}).catch(() => {
				response.end(JSON.stringify({
					error:"Database error"
				}));
			});
		}).catch((error) => {
			response.end(JSON.stringify({
				error:error
			}));
		});
	});

	app.post("/getmodules", (request, response) => {
		validateUser(request, response).then((userID) => {
			const courseName = request.body.course;

			//TODO validate input

			database.getModules(courseName).then((modules) => {
				response.end(JSON.stringify(modules));
			}).catch(() => {
				response.end(JSON.stringify({
					error:"Database error"
				}));
			});
		}).catch((error) => {
			response.end(JSON.stringify({
				error:error
			}));
		});
	});

	app.post("/getquestions", (request, response) => {
		validateUser(request, response).then((userID) => {
			const courseName = request.body.course;
			const moduleName = request.body.module;

			//TODO validate input

			database.getQuestions(courseName, moduleName).then((questions) => {
				response.end(JSON.stringify(questions));
			}).catch(() => {
				response.end(JSON.stringify({
					error:"Database error"
				}));
			});
		}).catch((error) => {
			response.end(JSON.stringify({
				error:error
			}));
		});
	});

	app.post("/getquestion", (request, response) => {
		validateUser(request, response).then((userID) => {
			const questionID = request.body.question;

			//TODO validate input

			database.getQuestion(questionID).then((question) => {
				response.end(JSON.stringify(question));
			}).catch(() => {
				response.end(JSON.stringify({
					error:"Database error"
				}));
			});
		}).catch((error) => {
			response.end(JSON.stringify({
				error:error
			}));
		});
	});

	app.post("/answer", (request, response) => {
		validateUser(request, response).then((userID) => {
			const questionID = request.body.question;
			const answer = request.body.answer;

			//TODO validate input

			database.getQuestionAnswer(questionID).then((answerRegex) => {
				const regex = new RegExp(answerRegex);
				if(regex.test(answer)) {
					const xpReward = 100;
					database.addUserXP(userID, xpReward).then(() => {
						response.end(JSON.stringify({
							correct:true
						}));
					}).catch(() => {
						response.end(JSON.stringify({
							error:"Database error"
						}));
					});
				} else {
					response.end(JSON.stringify({
						correct:false
					}));
				}
			}).catch(() => {
				response.end(JSON.stringify({
					error:"Database error"
				}));
			});
		}).catch((error) => {
			response.end(JSON.stringify({
				error:error
			}));
		});
	});

	//Admin functions
	app.post("/createcourse", (request, response) => {
		validateAdmin(request, response).then((userID) => {
			const name = request.body.name;
			const description = request.body.description;
			const color = request.body.color;

			//TODO validate input

			database.createCourse(name, description, color).then(() => {
				response.end(JSON.stringify({
					success:true
				}));
			}).catch(() => {
				response.end(JSON.stringify({
					error:"Database error"
				}));
			});
		}).catch((error) => {
			response.end(JSON.stringify({
				error:error
			}));
		});
	});

	app.post("/createmodule", (request, response) => {
		validateAdmin(request, response).then((userID) => {
			const name = request.body.name;
			const courseName = request.body.course;
			const description = request.body.description;

			//TODO validate input

			database.createModule(name, courseName, description).then(() => {
				response.end(JSON.stringify({
					success:true
				}));
			}).catch(() => {
				response.end(JSON.stringify({
					error:"Database error"
				}));
			});
		}).catch((error) => {
			response.end(JSON.stringify({
				error:error
			}));
		});
	});

	app.post("/createquestion", (request, response) => {
		validateAdmin(request, response).then((userID) => {
			const courseName = request.body.course;
			const moduleName = request.body.module;
			const content = request.body.content;
			const answer = request.body.answer;

			//TODO validate input

			database.createQuestion(courseName, moduleName, content, answer).then(() => {
				response.end(JSON.stringify({
					success:true
				}));
			}).catch(() => {
				response.end(JSON.stringify({
					error:"Database error"
				}));
			});
		}).catch((error) => {
			response.end(JSON.stringify({
				error:error
			}));
		});
	});

	//Start server
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

if(token.isSkippingVerification()) {
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
