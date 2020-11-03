
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
const errorCode = require("../error_code.js");
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
					reject({
						error:"Invalid token",
						errorCode:errorCode.invalidToken
					});
				}
			} else {
				reject({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
		});
	}

	//User functions
	app.post("/isadmin", (request, response) => {
		validateUser(request, response).then((userID) => {
			database.getUserIsAdmin(userID).then((isAdmin) => {
				response.json({
					isAdmin:isAdmin
				});
			}).catch(() => {
				response.json({
					error:"Database error",
					errorCode:errorCode.unknownDatabaseError
				});
			});
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/ismoderator", (request, response) => {
		validateUser(request, response).then((userID) => {
			const courseID = parseInt(request.body.courseID, 10);

			//TODO validate input

			database.isUserModeratorOfCourse(userID, courseID).then((isModerator) => {
				response.json({
					isModerator:isModerator
				});
			}).catch(() => {
				response.json({
					error:"Database error",
					errorCode:errorCode.unknownDatabaseError
				});
			});
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/getxp", (request, response) => {
		validateUser(request, response).then((userID) => {
			database.getXP(userID).then((xp) => {
				response.json({
					xp:xp
				});
			}).catch(() => {
				response.json({
					error:"Database error",
					errorCode:errorCode.unknownDatabaseError
				});
			});
		}).catch((error) => {
			response.json(error);
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
					error:"Database error",
					errorCode:errorCode.unknownDatabaseError
				});
			});
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/getcourses", (request, response) => {
		validateUser(request, response).then((userID) => {
			database.getCourses(userID).then((courses) => {
				response.json(courses);
			}).catch(() => {
				response.json({
					error:"Database error",
					errorCode:errorCode.unknownDatabaseError
				});
			});
		}).catch((error) => {
			response.json(error);
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
					error:"Database error",
					errorCode:errorCode.unknownDatabaseError
				});
			});
		}).catch((error) => {
			response.json(error);
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
					error:"Database error",
					errorCode:errorCode.unknownDatabaseError
				});
			});
		}).catch((error) => {
			response.json(error);
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
					error:"Database error",
					errorCode:errorCode.unknownDatabaseError
				});
			});
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/getquestionsegments", (request, response) => {
		validateUser(request, response).then((userID) => {
			const questionID = parseInt(request.body.questionID, 10);

			//TODO validate input

			database.getQuestionSegments(questionID).then((question) => {
				response.json(question);
			}).catch(() => {
				response.json({
					error:"Database error",
					errorCode:errorCode.unknownDatabaseError
				});
			});
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/answer", (request, response) => {
		validateUser(request, response).then((userID) => {
			const questionID = parseInt(request.body.questionID, 10);
			let answers = null;

			try {
				answers = JSON.parse(request.body.answers);
			} catch {
				response.json({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}

			//TODO validate input

			if(answers != null) {
				database.getQuestionAnswers(questionID).then((answersRegex) => {
					if(answers.length != answersRegex.length) {
						response.json({
							error:"Malformed input",
							errorCode:errorCode.malformedInput
						});
					} else {
						let correct = true;

						for(let i = 0; i < answersRegex.length; ++i) {
							if(answersRegex[i] != null) {
								const regex = new RegExp(answersRegex[i]);
								if(regex.test(answers[i])) {
									//Correct
								} else {
									correct = false;
								}
							}
						}

						if(correct) {
							//TODO do answer and add XP in transaction
							database.addAnswer(userID, questionID).then(() => {
								const xpReward = 100;
								database.addUserXP(userID, xpReward).then(() => {
									response.json({
										correct:true
									});
								}).catch(() => {
									response.json({
										error:"Database error",
										errorCode:errorCode.unknownDatabaseError
									});
								});
							}).catch(() => {
								response.json({
									error:"Database error",
									errorCode:errorCode.unknownDatabaseError
								});
							});
						} else {
							response.json({
								correct:false
							});
						}
					}
				}).catch((error) => {
					response.json({
						error:"Database error",
						errorCode:errorCode.unknownDatabaseError
					});
				});
			}
		}).catch((error) => {
			response.json(error);
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
							error:"Database error",
							errorCode:errorCode.unknownDatabaseError
						});
					});
				} else {
					response.json({
						error:"Permission denied",
						errorCode:errorCode.permissionDenied
					});
				}
			}).catch(() => {
				response.json({
					error:"Database error",
					errorCode:errorCode.unknownDatabaseError
				});
			});
		}).catch((error) => {
			response.json(error);
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
							error:"Database error",
							errorCode:errorCode.unknownDatabaseError
						});
					});
				} else {
					response.json({
						error:"Permission denied",
						errorCode:errorCode.permissionDenied
					});
				}
			}).catch((error) => {
				response.json({
					error:"Database error",
					errorCode:errorCode.unknownDatabaseError
				});
			});
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/createquestion", (request, response) => {
		validateUser(request, response).then((userID) => {
			const moduleID = parseInt(request.body.moduleID, 10);

			//TODO validate input

			database.isUserModeratorOfModule(userID, moduleID).then((isModerator) => {
				if(isModerator) {
					database.createQuestion(moduleID).then(() => {
						response.json({
							success:true
						});
					}).catch(() => {
						response.json({
							error:"Database error",
							errorCode:errorCode.unknownDatabaseError
						});
					});
				} else {
					response.json({
						error:"Permission denied",
						errorCode:errorCode.permissionDenied
					});
				}
			}).catch((error) => {
				response.json({
					error:"Database error",
					errorCode:errorCode.unknownDatabaseError
				});
			});
		}).catch((error) => {
			response.json(error);
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
