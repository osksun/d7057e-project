
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

	//User functions
	app.post("/getxp", (request, response) => {
		validateUser(request, response).then((userID) => {
			database.getXP(userID).then((xp) => {
				response.json({
					xp:xp
				});
			}).catch(() => {
				response.json({
					error:"Database error"
				});
			});
		}).catch((error) => {
			response.json({
				error:error
			});
		});
	});

	app.post("/getcoursebyname", (request, response) => {
		validateUser(request, response).then((userID) => {
			const name = request.body.name;

			//TODO validate input
			database.getCourseByName(name).then((course) => {
				response.json(course);
			}).catch(() => {
				response.json({
					error:"Database error"
				});
			});
		}).catch((error) => {
			response.json({
				error:error
			});
		});
	});

	app.post("/getcourses", (request, response) => {
		validateUser(request, response).then((userID) => {
			database.getCourses().then((courses) => {
				response.json(courses);
			}).catch(() => {
				response.json({
					error:"Database error"
				});
			});
		}).catch((error) => {
			response.json({
				error:error
			});
		});
	});

	app.post("/getmodulebyname", (request, response) => {
		validateUser(request, response).then((userID) => {
			const courseID = parseInt(request.body.courseID, 10);
			const name = request.body.name;

			//TODO validate input

			database.getModuleByName(courseID, name).then((module) => {
				response.json(module);
			}).catch((e) => {
				response.json({
					error:"Database error"
				});
			});
		}).catch((error) => {
			response.json({
				error:error
			});
		});
	});

	app.post("/getmodules", (request, response) => {
		validateUser(request, response).then((userID) => {
			const courseID = parseInt(request.body.courseID, 10);

			//TODO validate input

			database.getModules(courseID).then((modules) => {
				response.json(modules);
			}).catch(() => {
				response.json({
					error:"Database error"
				});
			});
		}).catch((error) => {
			response.json({
				error:error
			});
		});
	});

	app.post("/getquestions", (request, response) => {
		validateUser(request, response).then((userID) => {
			const moduleID = parseInt(request.body.moduleID, 10);

			//TODO validate input

			database.getQuestions(moduleID).then((questions) => {
				response.json(questions);
			}).catch(() => {
				response.json({
					error:"Database error"
				});
			});
		}).catch((error) => {
			response.json({
				error:error
			});
		});
	});

	app.post("/getquestion", (request, response) => {
		validateUser(request, response).then((userID) => {
			const questionID = parseInt(request.body.questionID, 10);

			//TODO validate input

			database.getQuestion(questionID).then((question) => {
				response.json(question);
			}).catch(() => {
				response.json({
					error:"Database error"
				});
			});
		}).catch((error) => {
			response.json({
				error:error
			});
		});
	});

	app.post("/answer", (request, response) => {
		validateUser(request, response).then((userID) => {
			const questionID = parseInt(request.body.questionID, 10);
			const answer = request.body.answer;

			//TODO validate input

			database.getQuestionAnswer(questionID).then((answerRegex) => {
				const regex = new RegExp(answerRegex);
				if(regex.test(answer)) {
					const xpReward = 100;
					database.addUserXP(userID, xpReward).then(() => {
						response.json({
							correct:true
						});
					}).catch(() => {
						response.json({
							error:"Database error"
						});
					});
				} else {
					response.json({
						correct:false
					});
				}
			}).catch(() => {
				response.json({
					error:"Database error"
				});
			});
		}).catch((error) => {
			response.json({
				error:error
			});
		});
	});

	//Admin functions
	app.post("/createcourse", (request, response) => {
		validateUser(request, response).then((userID) => {
			database.getUserIsAdmin(userID).then((isAdmin) => {
				if(isAdmin) {
					const name = request.body.name;
					const description = request.body.description;
					const color = request.body.color;

					//TODO validate input

					database.createCourse(name, description, color).then(() => {
						response.json({
							success:true
						});
					}).catch(() => {
						response.json({
							error:"Database error"
						});
					});
				} else {
					response.json({
						error:"Permission denied"
					});
				}
			}).catch(() => {
				response.json({
					error:"Database error"
				});
			});
		}).catch((error) => {
			response.json({
				error:error
			});
		});
	});

	//Admin & Moderator functions

	app.post("/createmodule", (request, response) => {
		validateUser(request, response).then((userID) => {
			const name = request.body.name;
			const courseID = parseInt(request.body.courseID, 10);
			const description = request.body.description;

			//TODO validate input

			database.isUserModeratorOfCourse(userID, courseID).then((isModerator) => {
				if(isModerator) {
					database.createModule(courseID, name, description).then(() => {
						response.json({
							success:true
						});
					}).catch(() => {
						response.json({
							error:"Database error"
						});
					});
				} else {
					response.json({
						error:"Permission denied"
					});
				}
			}).catch((error) => {
				response.json({
					error:"Database error"
				});
			});
		}).catch((error) => {
			response.json({
				error:error
			});
		});
	});

	app.post("/createquestion", (request, response) => {
		validateUser(request, response).then((userID) => {
			const moduleID = parseInt(request.body.moduleID, 10);
			const content = request.body.content;
			const answer = request.body.answer;

			//TODO validate input

			database.isUserModeratorOfModule(userID, moduleID).then((isModerator) => {
				if(isModerator) {
					database.createQuestion(moduleID, content, answer).then(() => {
						response.json({
							success:true
						});
					}).catch(() => {
						response.json({
							error:"Database error"
						});
					});
				} else {
					response.json({
						error:"Permission denied"
					});
				}
			}).catch((error) => {
				response.json({
					error:"Database error"
				});
			});
		}).catch((error) => {
			response.json({
				error:error
			});
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
