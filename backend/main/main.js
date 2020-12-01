
console.log("Starting server...");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const readline = require("readline").createInterface({
	input:process.stdin,
	output:process.stdout
});
const fs = require("fs");

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

			if(validation.validateUnsignedInt(courseID)) {
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
			} else {
				reject({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
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

	app.post("/getusername", (request, response) => {
		validateUser(request, response).then((userID) => {
			database.getUsername(userID).then((username) => {
				response.json({
					username:username
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

	app.post("/setusername", (request, response) => {
		validateUser(request, response).then((userID) => {
			let username = request.body.username;

			if(validation.validateStringMax(username, 255)) {
				if(username.length == 0) {
					username = null;
				}

				database.setUsername(userID, username).then(() => {
					response.json({
						success:true
					});
				}).catch((error) => {
					response.json({
						error:"Database error",
						errorCode:errorCode.unknownDatabaseError
					});
				});
			} else {
				reject({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/getcoursebyname", (request, response) => {
		validateUser(request, response).then((userID) => {
			const name = request.body.name;

			if(validation.validateStringMax(name, 255)) {
				database.getCourseByName(name, userID).then((course) => {
					response.json(course);
				}).catch(() => {
					response.json({
						error:"Database error",
						errorCode:errorCode.unknownDatabaseError
					});
				});
			} else {
				reject({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
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

			if(validation.validateUnsignedInt(courseID) && validation.validateStringMax(name, 255)) {
				database.getModuleByName(courseID, name).then((module) => {
					response.json(module);
				}).catch((e) => {
					response.json({
						error:"Database error",
						errorCode:errorCode.unknownDatabaseError
					});
				});
			} else {
				reject({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/getmodules", (request, response) => {
		validateUser(request, response).then((userID) => {
			const courseID = parseInt(request.body.courseID, 10);

			if(validation.validateUnsignedInt(courseID)) {
				database.getModules(courseID, userID).then((modules) => {
					response.json(modules);
				}).catch(() => {
					response.json({
						error:"Database error",
						errorCode:errorCode.unknownDatabaseError
					});
				});
			} else {
				reject({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/getquestions", (request, response) => {
		validateUser(request, response).then((userID) => {
			const moduleID = parseInt(request.body.moduleID, 10);

			if(validation.validateUnsignedInt(moduleID)) {
				database.getQuestions(moduleID).then((questions) => {
					response.json(questions);
				}).catch(() => {
					response.json({
						error:"Database error",
						errorCode:errorCode.unknownDatabaseError
					});
				});
			} else {
				reject({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/getrandomunansweredquestion", (request, response) => {
		validateUser(request, response).then((userID) => {
			const moduleID = parseInt(request.body.moduleID, 10);

			if(validation.validateUnsignedInt(moduleID)) {
				database.getRandomUnansweredQuestionID(moduleID, userID).then((questionID) => {
					if (questionID === null) {
						// There are no unanswered questions in the module
						response.json({
							error:"There are no unanswered questions in this module for this user",
							errorCode:errorCode.noUnansweredQuestions
						});
					} else {
						database.getQuestionSegments(questionID).then((segments) => {
							response.json({
								id:questionID,
								segments:segments
							});
						}).catch(() => {
							response.json({
								error:"Database error",
								errorCode:errorCode.unknownDatabaseError
							});
						});
					}
				}).catch(() => {
					response.json({
						error:"Database error",
						errorCode:errorCode.unknownDatabaseError
					});
				});
			} else {
				reject({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/getquestionsegments", (request, response) => {
		validateUser(request, response).then((userID) => {
			const questionID = parseInt(request.body.questionID, 10);

			if(validation.validateUnsignedInt(questionID)) {
				database.getQuestionSegments(questionID).then((question) => {
					response.json(question);
				}).catch(() => {
					response.json({
						error:"Database error",
						errorCode:errorCode.unknownDatabaseError
					});
				});
			} else {
				reject({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/answer", (request, response) => {
		validateUser(request, response).then((userID) => {
			const questionID = parseInt(request.body.questionID, 10);
			let answers;

			try {
				answers = JSON.parse(request.body.answers);
			} catch {
				answers = null;
			}

			if(validation.validateUnsignedInt(questionID) && validation.validateStringMaxWithNullArray(answers, 64, 16384)) {
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
			} else {
				response.json({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
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

					if(validation.validateStringMax(name, 255) && validation.validateStringMax(description, 65535) && validation.validateHexColor(color)) {
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
							error:"Malformed input",
							errorCode:errorCode.malformedInput
						});
					}
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
			const courseID = parseInt(request.body.courseID, 10);
			const name = request.body.name;
			const description = request.body.description;

			if(validation.validateUnsignedInt(courseID) && validation.validateStringMax(name, 255) && validation.validateStringMax(description, 65536)) {
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
			} else {
				response.json({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/createquestion", (request, response) => {
		validateUser(request, response).then((userID) => {
			const moduleID = parseInt(request.body.moduleID, 10);
			let types;
			let content;
			let answers;

			try {
				types = JSON.parse(request.body.types);
				content = JSON.parse(request.body.content);
				answers = JSON.parse(request.body.answers);
			} catch {
				types = null;
				content = null;
				answers = null;
			}

			if(validation.validateUnsignedInt(moduleID) && validation.validateStringMaxArray(types, 64, 255) && validation.validateStringMaxWithNullArray(content, 64, 65535) && validation.validateStringMaxWithNullArray(answers, 64, 65535)) {
				const length = types.length;

				//Make sure all lists have same length
				if(content.length != length || answers.length != length) {
					response.json({
						error:"Malformed input",
						errorCode:errorCode.malformedInput
					});
				} else {
					database.isUserModeratorOfModule(userID, moduleID).then((isModerator) => {
						if(isModerator) {
							database.createQuestion(moduleID, types, content, answers).then(() => {
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
				}
			} else {
				response.json({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/updatecourse", (request, response) => {
		validateUser(request, response).then((userID) => {
			const courseID = parseInt(request.body.courseID, 10);

			database.isUserModeratorOfCourse(userID, courseID).then((isModerator) => {
				if(isModerator) {
					const name = request.body.name;
					const description = request.body.description;
					const color = request.body.color;

					if(validation.validateStringMax(name, 255) && validation.validateStringMax(description, 65535) && validation.validateHexColor(color)) {
						database.updateCourse(courseID, name, description, color).then(() => {
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
							error:"Malformed input",
							errorCode:errorCode.malformedInput
						});
					}
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

	app.post("/deletecourse", (request, response) => {
		validateUser(request, response).then((userID) => {
			const courseID = parseInt(request.body.courseID, 10);

			if(validation.validateUnsignedInt(courseID)) {
				database.isUserModeratorOfCourse(userID, courseID).then((isModerator) => {
					if(isModerator) {
						database.softDeleteCourse(courseID).then(() => {
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
			} else {
				response.json({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/updatemodule", (request, response) => {
		validateUser(request, response).then((userID) => {
			const moduleID = parseInt(request.body.moduleID, 10);
			const name = request.body.name;
			const description = request.body.description;

			if(validation.validateUnsignedInt(moduleID) && validation.validateStringMax(name, 255) && validation.validateStringMax(description, 65535)) {
				database.isUserModeratorOfModule(userID, moduleID).then((isModerator) => {
					if(isModerator) {
						database.updateModule(moduleID, name, description).then(() => {
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
			} else {
				response.json({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/deletemodule", (request, response) => {
		validateUser(request, response).then((userID) => {
			const moduleID = parseInt(request.body.moduleID, 10);

			if(validation.validateUnsignedInt(moduleID)) {
				database.isUserModeratorOfModule(userID, moduleID).then((isModerator) => {
					if(isModerator) {
						database.softDeleteModule(moduleID).then(() => {
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
			} else {
				response.json({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/updatequestion", (request, response) => {
		validateUser(request, response).then((userID) => {
			const questionID = parseInt(request.body.questionID, 10);
			let types = null;
			let content = null;
			let answers = null;

			try {
				types = JSON.parse(request.body.types);
				content = JSON.parse(request.body.content);
				answers = JSON.parse(request.body.answers);
			} catch {
				types = null;
				content = null;
				answers = null;
			}

			if(validation.validateUnsignedInt(questionID) && validation.validateStringMaxArray(types, 64, 255) && validation.validateStringMaxWithNullArray(content, 64, 65535) && validation.validateStringMaxWithNullArray(answers, 64, 65535)) {
				const length = types.length;

				//Make sure all lists have same length
				if(content.length != length || answers.length != length) {
					response.json({
						error:"Malformed input",
						errorCode:errorCode.malformedInput
					});
				} else {
					database.isUserModeratorOfQuestion(userID, questionID).then((isModerator) => {
						if(isModerator) {
							database.updateQuestion(questionID, types, content, answers).then(() => {
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
				}
			} else {
				response.json({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/deletequestion", (request, response) => {
		validateUser(request, response).then((userID) => {
			const questionID = parseInt(request.body.questionID, 10);

			if(validation.validateUnsignedInt(questionID)) {
				database.isUserModeratorOfQuestion(userID, questionID).then((isModerator) => {
					if(isModerator) {
						database.softDeleteQuestion(questionID).then(() => {
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
			} else {
				response.json({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/addmoderator", (request, response) => {
		validateUser(request, response).then((userID) => {
			const username = request.body.username;
			const courseID = parseInt(request.body.courseID, 10);

			if(validation.validateStringMax(username, 255) && validation.validateUnsignedInt(courseID)) {
				database.isUserModeratorOfCourse(userID, courseID).then((isModerator) => {
					if(isModerator) {
						database.addModerator(username, courseID).then(() => {
							response.json({
								success:true
							});
						}).catch((error) => {
							response.json(error);
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
			} else {
				response.json({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/deletemoderator", (request, response) => {
		validateUser(request, response).then((userID) => {
			const moderatorID = parseInt(request.body.moderatorID, 10);
			const courseID = parseInt(request.body.courseID, 10);

			if(validation.validateUnsignedInt(moderatorID) && validation.validateUnsignedInt(courseID)) {
				database.isUserModeratorOfCourse(userID, courseID).then((isModerator) => {
					if(isModerator) {
						database.deleteModerator(moderatorID, courseID).then(() => {
							response.json({
								success:true
							});
						}).catch((error) => {
							response.json(error);
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
			} else {
				response.json({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
		}).catch((error) => {
			response.json(error);
		});
	});

	app.post("/getmoderators", (request, response) => {
		validateUser(request, response).then((userID) => {
			const courseID = parseInt(request.body.courseID, 10);

			if(validation.validateUnsignedInt(courseID)) {
				database.isUserModeratorOfCourse(userID, courseID).then((isModerator) => {
					if(isModerator) {
						database.getModerators(courseID).then((moderators) => {
							response.json(moderators);
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
			} else {
				response.json({
					error:"Malformed input",
					errorCode:errorCode.malformedInput
				});
			}
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

	function purgeExpiredData() {
		database.purgeExpiredCourses().catch(() => {
			//Errors printed in database.js
		});
		database.purgeExpiredModules().catch(() => {
			//Errors printed in database.js
		});
		database.purgeExpiredQuestions().catch(() => {
			//Errors printed in database.js
		});
	}

	purgeExpiredData();
	setInterval(() => {
		purgeExpiredData();
	}, 60 * 60 * 1000);
}

function initDatabase() {
	database.connect().then(() => {
		init();
	}).catch((error) => {
		console.error(error);
		console.error("Shutting down...");
		process.exit(1);
	});
}

if(token.isSkippingVerification()) {
	console.log("WARNING skipping access token verification! For debug purposes only!");
	initDatabase();
} else {
		try {
			if(token.setPublicKey(fs.readFileSync("public_key"))) {
				console.log("Public key is valid");
				initDatabase();
			} else {
				console.error("Invalid public key!");
				console.error("Shutting down...");
				process.exit(2);
			}
		} catch {
			console.error("Missing public key!");
			console.error("Shutting down...");
			process.exit(2);
		}
	}
