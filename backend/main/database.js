
const mysql = require("mysql");

const config = require("./database_config.json");
const connection = mysql.createConnection(config);

const errorCode = require("../error_code.js");

function connect() {
	console.log("Connecting MySQL database...");
	return new Promise((resolve, reject) => {
		connection.connect((error) => {
			if(error) {
				console.error("Failed to connect to MySQL database!");
				reject();
			} else {
				console.log("MySQL database connected!");

				const tables = [
					"CREATE TABLE IF NOT EXISTS userdata (id INT NOT NULL, username VARCHAR(255) UNIQUE, xp BIGINT DEFAULT 0, isAdmin BOOL DEFAULT false, PRIMARY KEY(id))",
					"CREATE TABLE IF NOT EXISTS courses (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255) UNIQUE NOT NULL, description TEXT NOT NULL, color CHAR(6) NOT NULL, deleteon DATE, PRIMARY KEY(id))",
					"CREATE TABLE IF NOT EXISTS courseaccess (userID int NOT NULL, courseID INT NOT NULL, lastAccess DATETIME, PRIMARY KEY(userID, courseID), FOREIGN KEY(userID) REFERENCES userdata(id), FOREIGN KEY(courseID) REFERENCES courses(id))",
					"CREATE TABLE IF NOT EXISTS modules (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, courseID int NOT NULL, description TEXT NOT NULL, deleteon DATE, PRIMARY KEY(id), FOREIGN KEY(courseID) REFERENCES courses(id) ON DELETE CASCADE, CONSTRAINT uniqueModuleCourse UNIQUE (name, courseID))",
					"CREATE TABLE IF NOT EXISTS questions (id INT NOT NULL AUTO_INCREMENT, moduleID INT NOT NULL, deleteon DATE, PRIMARY KEY(id), FOREIGN KEY(moduleID) REFERENCES modules(id) ON DELETE CASCADE)",
					"CREATE TABLE IF NOT EXISTS questionsegments (questionID INT NOT NULL, segmentOrder INT NOT NULL, type VARCHAR(255) NOT NULL, content TEXT NOT NULL, answer TEXT, PRIMARY KEY(questionID, segmentOrder), FOREIGN KEY(questionID) REFERENCES questions(id) ON DELETE CASCADE)",
					"CREATE TABLE IF NOT EXISTS answers (userID int NOT NULL, questionID int NOT NULL, PRIMARY KEY(userID, questionID), FOREIGN KEY(userID) REFERENCES userdata(id), FOREIGN KEY(questionID) REFERENCES questions(id) ON DELETE CASCADE)",
					"CREATE TABLE IF NOT EXISTS moderators (userID INT NOT NULL, courseID INT NOT NULL, PRIMARY KEY(userID, courseID), FOREIGN KEY(userID) REFERENCES userdata(id), FOREIGN KEY(courseID) REFERENCES courses(id) ON DELETE CASCADE)"
				];

				function createTable() {
					if(tables.length > 0) {
						const sql = tables.splice(0, 1)[0];
						connection.query(sql, (error, result) => {
							if(error) {
								console.error("Failed to create database tables: " + error);
								reject();
							} else {
								if(tables.length == 0) {
									resolve();
								} else {
									createTable();
								}
							}
						});
					}
				}
				createTable();
			}
		});
	});
}
exports.connect = connect;

function createUserIfNotExist(userID) {
	return new Promise((resolve, reject) => {
		connection.query("INSERT IGNORE INTO userdata (id, xp) VALUES (?, ?)", [userID, 0], (error, result) => {
			if(error) {
				reject();
			} else {
				resolve();
			}
		});
	});
}

function getUserIsAdmin(userID) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT isAdmin FROM userdata WHERE id = ?", [userID], (error, result) => {
			if(error) {
				reject();
			} else {
				if(result.length == 0) {
					//Return false by default
					resolve(false);
				} else if(result.length == 1) {
					resolve(result[0].isAdmin == 1);
				} else {
					reject();
				}
			}
		});
	});
}
exports.getUserIsAdmin = getUserIsAdmin;

function getXP(userID) {
	return new Promise((resolve, reject) => {
		createUserIfNotExist(userID).then(() => {
			connection.query("SELECT xp FROM userdata WHERE id = ?", [userID], (error, result) => {
				if(error) {
					reject();
				} else {
					if(result.length == 0) {
						//Return 0 XP by default
						resolve(0);
					} else if(result.length == 1) {
						resolve(result[0].xp);
					} else {
						reject();
					}
				}
			});
		}).catch(() => {
			reject();
		});
	});
}
exports.getXP = getXP;

function addUserXP(userID, xp) {
	return new Promise((resolve, reject) => {
		createUserIfNotExist(userID).then(() => {
			connection.query("UPDATE userdata SET xp = xp + ? WHERE id = ?", [xp, userID], (error, result) => {
				if(error) {
					reject();
				} else {
					resolve();
				}
			});
		}).catch(() => {
			reject();
		});
	});
}
exports.addUserXP = addUserXP;

function getUsername(userID) {
	return new Promise((resolve, reject) => {
		createUserIfNotExist(userID).then(() => {
			connection.query("SELECT username FROM userdata WHERE id = ?", [userID], (error, result) => {
				if(error) {
					reject();
				} else {
					if(result.length == 1) {
						resolve(result[0].username);
					} else {
						reject();
					}
				}
			});
		}).catch(() => {
			reject();
		});
	});
}
exports.getUsername = getUsername;

function setUsername(userID, username) {
	return new Promise((resolve, reject) => {
		createUserIfNotExist(userID).then(() => {
			connection.query("UPDATE userdata SET username = ? WHERE id = ?", [username, userID], (error, result) => {
				if(error) {
					if(error.code == "ER_DUP_ENTRY") {
						reject({
							error:"Username has already been taken",
							errorCode:errorCode.usernameTaken
						});
					} else {
						console.error(error);
						reject({
							error:"Database error",
							errorCode:errorCode.unknownDatabaseError
						});
					}
				} else {
					resolve();
				}
			});
		}).catch((error) => {
			console.error(error);
			reject({
				error:"Database error",
				errorCode:errorCode.unknownDatabaseError
			});
		});
	});
}
exports.setUsername = setUsername;

function createCourse(name, description, color) {
	return new Promise((resolve, reject) => {
		connection.query("INSERT INTO courses (name, description, color) VALUES (?, ?, ?)", [name, description, color], (error, result) => {
			if(error) {
				reject();
			} else {
				resolve();
			}
		});
	});
}
exports.createCourse = createCourse;

function updateCourse(courseID, name, description, color) {
	return new Promise((resolve, reject) => {
		connection.query("UPDATE courses SET name = ?, description = ?, color = ? WHERE id = ?", [name, description, color, courseID], (error, result) => {
			if(error) {
				console.log(error)
				reject();
			} else {
				resolve();
			}
		});
	});
}
exports.updateCourse = updateCourse;

function softDeleteCourse(courseID) {
	return new Promise((resolve, reject) => {
		connection.query("UPDATE courses SET deleteon = DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY) WHERE id = ?", [courseID], (error, result) => {
			if(error) {
				reject();
			} else {
				resolve();
			}
		});
	});
}
exports.softDeleteCourse = softDeleteCourse;

function purgeExpiredCourses() {
	return new Promise((resolve, reject) => {
		connection.query("DELETE FROM courses WHERE deleteon <= CURRENT_DATE", (error, result) => {
			if(error) {
				console.log(error);
				reject();
			} else {
				resolve();
			}
		});
	});
}
exports.purgeExpiredCourses = purgeExpiredCourses;

function getCourseByName(name, userID) {
	return new Promise((resolve, reject) => {
		connection.beginTransaction(function(error) {
			if(error) {
				reject();
			} else {
				connection.query("SELECT id, name, description, color FROM courses WHERE name=? AND deleteon IS NULL", [name], (error, result) => {
					if(error) {
						reject();
					} else {
						if(result.length == 1) {
							const row = result[0];
							const courseID = row.id;
							connection.query(`
								INSERT INTO courseaccess (userID, courseID, lastAccess) VALUES (?, ?, CURRENT_TIMESTAMP)
								ON DUPLICATE KEY UPDATE lastAccess = CURRENT_TIMESTAMP
								`, [userID, courseID], (error) => {
								if(error) {
									connection.rollback(function() {
										reject();
									});
								} else {
									resolve({id:courseID, name:row.name, description:row.description, color:row.color});
								}
							});
						} else {
							connection.rollback(function() {
								reject();
							});
						}
					}
				});
			}
		});
	});
}
exports.getCourseByName = getCourseByName;

function getCourses(userID) {
	return new Promise((resolve, reject) => {
		connection.query(`
			SELECT id, name, description, color, questionCount, answerCount, CASE WHEN moderators.userID IS NULL THEN False ELSE True END AS isModerator FROM (
				SELECT courses.id, courses.name, courses.description, courses.color,
				COUNT(CASE WHEN questions.moduleID = modules.id AND modules.courseID = courses.id AND modules.deleteon IS NULL AND questions.deleteon IS NULL THEN 1 END) AS questionCount,
				COUNT(CASE WHEN questions.moduleID = modules.id and modules.courseID = courses.id AND answers.questionID = questions.id AND answers.userID = ? AND modules.deleteon IS NULL AND questions.deleteon IS NULL THEN 1 END) AS answerCount FROM courses
					LEFT JOIN modules ON modules.courseID = courses.id
					LEFT JOIN questions ON questions.moduleID = modules.id
					LEFT JOIN answers ON answers.questionID = questions.id AND answers.userID = ?
					WHERE courses.deleteon IS NULL
					GROUP BY courses.id
			) AS selectedCourses
			LEFT JOIN courseaccess ON courseaccess.courseID = selectedCourses.id AND courseaccess.userID = ?
			LEFT JOIN moderators ON moderators.courseID = selectedCourses.id AND moderators.userID = ?
			ORDER BY courseaccess.lastAccess DESC
			`, [userID, userID, userID, userID], (error, result) => {
			if(error) {
				reject();
			} else {
				const courses = [];
				for(let i = 0; i < result.length; ++i) {
					const row = result[i];
					courses.push({
						id:row.id,
						name:row.name,
						description:row.description,
						color:row.color,
						questionCount:row.questionCount,
						answerCount:row.answerCount,
						isModerator:row.isModerator
					});
				}
				resolve(courses);
			}
		});
	});
}
exports.getCourses = getCourses;

function createModule(courseID, name, description) {
	return new Promise((resolve, reject) => {
		connection.beginTransaction(function(error) {
			if(error) {
				reject({
					error:"Database error",
					errorCode:errorCode.unknownDatabaseError
				});
			} else {
				connection.query("SELECT COUNT(*) FROM modules WHERE courseID = ? AND deleteon IS NULL", [courseID], (error, result) => {
					if(error) {
						connection.rollback(function() {
							reject({
								error:"Database error",
								errorCode:errorCode.unknownDatabaseError
							});
						});
					} else {
						if(result.length != 1) {
							connection.rollback(function() {
								reject({
									error:"Database error",
									errorCode:errorCode.unknownDatabaseError
								});
							});
						} else {
							const numberOfModules = result[0]["COUNT(*)"];
							if(numberOfModules >= 256) {
								connection.rollback(function() {
									reject({
										error:"Too many modules in this course",
										errorCode:errorCode.tooManyModulesInCourse
									});
								});
							} else {
								connection.query("INSERT INTO modules (name, courseID, description) VALUES (?, ?, ?)", [name, courseID, description], (error, result) => {
									if(error) {
										connection.rollback(function() {
											reject({
												error:"Database error",
												errorCode:errorCode.unknownDatabaseError
											});
										});
									} else {
										connection.commit(function(error) {
											if(error) {
												connection.rollback(function() {
													reject({
														error:"Database error",
														errorCode:errorCode.unknownDatabaseError
													});
												});
											} else {
												resolve();
											}
										});
									}
								});
							}
						}
					}
				});
			}
		});
	});
}
exports.createModule = createModule;

function updateModule(moduleID, name, description) {
	return new Promise((resolve, reject) => {
		connection.query("UPDATE modules SET name = ?, description = ? WHERE id = ?", [name, description, moduleID], (error, result) => {
			if(error) {
				reject();
			} else {
				resolve();
			}
		});
	});
}
exports.updateModule = updateModule;

function softDeleteModule(moduleID) {
	return new Promise((resolve, reject) => {
		connection.query("UPDATE modules SET deleteon = DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY) WHERE id = ?", [moduleID], (error, result) => {
			if(error) {
				reject();
			} else {
				resolve();
			}
		});
	});
}
exports.softDeleteModule = softDeleteModule;

function purgeExpiredModules() {
	return new Promise((resolve, reject) => {
		connection.query("DELETE FROM modules WHERE deleteon <= CURRENT_DATE", (error, result) => {
			if(error) {
				console.log(error);
				reject();
			} else {
				resolve();
			}
		});
	});
}
exports.purgeExpiredModules = purgeExpiredModules;

function getModuleByName(courseID, name) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT id, name, description FROM modules WHERE courseID=? AND name=? AND deleteon IS NULL", [courseID, name], (error, result) => {
			if(error) {
				reject();
			} else {

				if(result.length == 1) {
					const row = result[0];
					resolve({id:row.id, name:row.name, description:row.description});
				} else {
					reject();
				}
			}
		});
	});
}
exports.getModuleByName = getModuleByName;

function getModules(courseID, userID) {
	return new Promise((resolve, reject) => {
		connection.beginTransaction(function(error) {
			if(error) {
				reject();
			} else {
				connection.query(`
					SELECT modules.id, modules.name, modules.description,
					COUNT(CASE WHEN questions.moduleID = modules.id AND questions.deleteon IS NULL THEN 1 END) AS questionCount,
					COUNT(CASE WHEN answers.userID = ? AND questions.deleteon IS NULL THEN 1 END) AS answerCount FROM modules
					LEFT JOIN questions ON questions.moduleID = modules.id
					LEFT JOIN answers ON answers.questionID = questions.id AND answers.userID = ?
					WHERE modules.courseID = ? AND modules.deleteon IS NULL
					GROUP BY modules.id
					`, [userID, userID, courseID], (error, result) => {
					if(error) {
						connection.rollback(function() {
							reject();
						});
					} else {
						connection.query(`
							INSERT INTO courseaccess (userID, courseID, lastAccess) VALUES (?, ?, CURRENT_TIMESTAMP)
							ON DUPLICATE KEY UPDATE lastAccess = CURRENT_TIMESTAMP
							`, [userID, courseID], (error) => {
							if(error) {
								connection.rollback(function() {
									reject();
								});
							} else {
								const modules = [];
								for(let i = 0; i < result.length; ++i) {
									const row = result[i];
									modules.push({
										id:row.id,
										name:row.name,
										description:row.description,
										questionCount:row.questionCount,
										answerCount:row.answerCount
									});
								}
								connection.commit(function(error) {
									if(error) {
										connection.rollback(function() {
											reject();
										});
									} else {
										resolve(modules);
									}
								});
							}
						});
					}
				});
			}
		});
	});
}
exports.getModules = getModules;

function createQuestion(moduleID, types, content, answers) {
	return new Promise((resolve, reject) => {
		connection.beginTransaction(function(error) {
			if(error) {
				reject({
					error:"Database error",
					errorCode:errorCode.unknownDatabaseError
				});
			} else {
				connection.query("SELECT COUNT(*) FROM questions WHERE moduleID = ? AND deleteon IS NULL", [moduleID], (error, result) => {
					if(error) {
						connection.rollback(function() {
							reject({
								error:"Database error",
								errorCode:errorCode.unknownDatabaseError
							});
						});
					} else {
						if(result.length != 1) {
							connection.rollback(function() {
								reject({
									error:"Database error",
									errorCode:errorCode.unknownDatabaseError
								});
							});
						} else {
							const numberOfQuestions = result[0]["COUNT(*)"];
							if(numberOfQuestions >= 256) {
								connection.rollback(function() {
									reject({
										error:"Too many questions in this module",
										errorCode:errorCode.tooManyQuestionsInModule
									});
								});
							} else {
								connection.query("INSERT INTO questions (moduleID) VALUES (?)", [moduleID], (error, result) => {
									if(error) {
										connection.rollback(function() {
											reject({
												error:"Database error",
												errorCode:errorCode.unknownDatabaseError
											});
										});
									} else {
										const questionID = result.insertId;
										const promises = [];
										for(let i = 0; i < types.length; ++i) {
											promises.push(new Promise((resolve, reject) => {
												connection.query("INSERT INTO questionsegments (questionID, segmentOrder, type, content, answer) VALUES (?, ?, ?, ?, ?)", [questionID, i, types[i], content[i], answers[i]], (error, result) => {
													if(error) {
														reject();
													} else {
														resolve();
													}
												});
											}));
										}

										Promise.allSettled(promises).then((results) => {
											let failed = false;
											for(let i = 0; i < results.length; ++i) {
												if(results[i].status != "fulfilled") {
													failed = true;
												}
											}

											if(failed) {
												connection.rollback(function() {
													reject({
														error:"Database error",
														errorCode:errorCode.unknownDatabaseError
													});
												});
											} else {
												connection.commit(function(error) {
													if(error) {
														connection.rollback(function() {
															reject({
																error:"Database error",
																errorCode:errorCode.unknownDatabaseError
															});
														});
													} else {
														resolve();
													}
												});
											}
										});
									}
								});
							}
						}
					}
				});
			}
		});
	});
}
exports.createQuestion = createQuestion;

function updateQuestion(questionID, types, content, answers) {
	return new Promise((resolve, reject) => {
		connection.beginTransaction(function(error) {
			if(error) {
				reject();
			} else {
				connection.query("DELETE FROM questionsegments WHERE questionID=?", [questionID], (error, result) => {
					if(error) {
						connection.rollback(function() {
							reject();
						});
					} else {
						const promises = [];
						for(let i = 0; i < types.length; ++i) {
							promises.push(new Promise((resolve, reject) => {
								connection.query("INSERT INTO questionsegments (questionID, segmentOrder, type, content, answer) VALUES (?, ?, ?, ?, ?)", [questionID, i, types[i], content[i], answers[i]], (error, result) => {
									if(error) {
										reject();
									} else {
										resolve();
									}
								});
							}));
						}

						Promise.allSettled(promises).then((results) => {
							let failed = false;
							for(let i = 0; i < results.length; ++i) {
								if(results[i].status != "fulfilled") {
									failed = true;
								}
							}

							if(failed) {
								connection.rollback(function() {
									reject();
								});
							} else {
								connection.commit(function(error) {
									if(error) {
										connection.rollback(function() {
											reject();
										});
									} else {
										resolve();
									}
								});
							}
						});
					}
				});
			}
		});
	});
}
exports.updateQuestion = updateQuestion;

function softDeleteQuestion(questionID) {
	return new Promise((resolve, reject) => {
		connection.query("UPDATE questions SET deleteon = DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY) WHERE id = ?", [questionID], (error, result) => {
			if(error) {
				reject();
			} else {
				resolve();
			}
		});
	});
}
exports.softDeleteQuestion = softDeleteQuestion;

function purgeExpiredQuestions() {
	return new Promise((resolve, reject) => {
		connection.query("DELETE FROM questions WHERE deleteon <= CURRENT_DATE", (error, result) => {
			if(error) {
				console.log(error);
				reject();
			} else {
				resolve();
			}
		});
	});
}
exports.purgeExpiredQuestions = purgeExpiredQuestions;

function getQuestions(moduleID) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT id FROM questions WHERE moduleID = ? AND deleteon IS NULL", [moduleID], (error, result) => {
			if(error) {
				reject();
			} else {
				const questions = [];
				for(let i = 0; i < result.length; ++i) {
					const row = result[i];
					questions.push(row.id);
				}
				resolve(questions);
			}
		});
	});
}
exports.getQuestions = getQuestions;

function getRandomUnansweredQuestionID(moduleID, userID) {
	return new Promise((resolve, reject) => {
		connection.query(`
			SELECT id FROM questions WHERE moduleID = ? AND id NOT IN (
				SELECT questionID FROM answers WHERE userID = ?
			) AND deleteon IS NULL ORDER BY RAND() LIMIT 1
			`, [moduleID, userID], (error, result) => {
			if(error) {
				reject();
			} else {
				if (result.length === 0) {
					resolve(null); // User has answered all questions in this module
				} else {
					const questionID = result[0].id;
					resolve(questionID);
				}
			}
		});
	});
}
exports.getRandomUnansweredQuestionID = getRandomUnansweredQuestionID;

function getQuestionSegments(questionID) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT segmentOrder, type, content, answer FROM questionsegments WHERE questionID = ? ORDER BY segmentOrder", [questionID], (error, result) => {
			if(error) {
				reject();
			} else {
				const segments = [];
				for(let i = 0; i < result.length; ++i) {
					const row = result[i];
					segments.push({
						order:row.order,
						type:row.type,
						content:row.content,
						answer:row.answer
					});
				}
				resolve(segments);
			}
		});
	});
}
exports.getQuestionSegments = getQuestionSegments;

function getQuestionAnswers(questionID) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT answer FROM questionsegments WHERE questionID = ? ORDER BY segmentOrder", [questionID], (error, result) => {
			if(error) {
				reject();
			} else {
				const answers = [];
				for(let i = 0; i < result.length; ++i) {
					const row = result[i];
					answers.push(row.answer);
				}
				resolve(answers);
			}
		});
	});
}
exports.getQuestionAnswers = getQuestionAnswers;

function addAnswer(userID, questionID) {
	return new Promise((resolve, reject) => {
		createUserIfNotExist(userID).then(() => {
			connection.query("INSERT INTO answers (userID, questionID) VALUES (?, ?)", [userID, questionID], (error, result) => {
				if(error) {
					reject();
				} else {
					resolve();
				}
			});
		}).catch(() => {
			reject();
		});
	});
}
exports.addAnswer = addAnswer;

function addModerator(username, courseID) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT id FROM userdata WHERE username = ?", [username], (error, result) => {
			if(error) {
				console.error(error);
				reject({
					error:"Database error",
					errorCode:errorCode.unknownDatabaseError
				});
			} else {
				if(result.length == 0) {
					reject({
						error:"User does not exist",
						errorCode:errorCode.userDoesNotExist
					});
				} else if(result.length == 1) {
					const userID = result[0].id;
					connection.query("INSERT INTO moderators (userID, courseID) VALUES (?, ?)", [userID, courseID], (error, result) => {
						if(error) {
							if(error.code == "ER_DUP_ENTRY") {
								reject({
									error:"User is already moderator",
									errorCode:errorCode.duplicateModerator
								});
							} else {
								console.error(error);
								reject({
									error:"Database error",
									errorCode:errorCode.unknownDatabaseError
								});
							}
						} else {
							resolve();
						}
					});
				} else {
					console.error("Several users have same username");
					reject({
						error:"Database error",
						errorCode:errorCode.unknownDatabaseError
					});
				}
			}
		});
	});
}
exports.addModerator = addModerator;

function deleteModerator(userID, courseID) {
	return new Promise((resolve, reject) => {
		connection.query("DELETE FROM moderators WHERE userID = ? AND courseID = ?", [userID, courseID], (error, result) => {
			if(error) {
				console.error(error);
				reject({
					error:"Database error",
					errorCode:errorCode.unknownDatabaseError
				});
			} else {
				resolve();
			}
		});
	});
}
exports.deleteModerator = deleteModerator;

function getModerators(courseID) {
	return new Promise((resolve, reject) => {
		connection.query(`
			SELECT moderators.userID, userdata.username FROM moderators
			LEFT JOIN userdata ON userdata.id = moderators.userID
			WHERE courseID = ?
			`, [courseID], (error, result) => {
			if(error) {
				console.log(error);
				reject();
			} else {
				const moderators = [];
				for(let i = 0; i < result.length; ++i) {
					const row = result[i];
					moderators.push({
						id:row.userID,
						name:row.username
					});
				}
				resolve(moderators);
			}
		});
	});
}
exports.getModerators = getModerators;

//Also returns true if the user is an admin
function isUserModeratorOfCourse(userID, courseID) {
	return new Promise((resolve, reject) => {
		getUserIsAdmin(userID).then((isAdmin) => {
			if(isAdmin) {
				resolve(true);
			} else {
				connection.query("SELECT userID, courseID FROM moderators WHERE userID = ? AND courseID = ?", [userID, courseID], (error, result) => {
					if(error) {
						reject();
					} else {
						if(result.length == 1) {
							resolve(true);
						} else if(result.length == 0) {
							resolve(false);
						} else {
							reject();
						}
					}
				});
			}
		}).catch(() => {
			reject();
		});
	});
}
exports.isUserModeratorOfCourse = isUserModeratorOfCourse;

//Also returns true if the user is an admin
function isUserModeratorOfModule(userID, moduleID) {
	return new Promise((resolve, reject) => {
		getUserIsAdmin(userID).then((isAdmin) => {
			if(isAdmin) {
				resolve(true);
			} else {
				connection.query(`
					SELECT userID, modules.courseID FROM moderators
					INNER JOIN modules WHERE userID = ? AND modules.id = ?
					`, [userID, moduleID], (error, result) => {
					if(error) {
						reject();
					} else {
						if(result.length == 1) {
							resolve(true);
						} else if(result.length == 0) {
							resolve(false);
						} else {
							reject();
						}
					}
				});
			}
		}).catch(() => {
			reject();
		});
	});
}
exports.isUserModeratorOfModule = isUserModeratorOfModule;

//Also returns true if the user is an admin
function isUserModeratorOfQuestion(userID, questionID) {
	return new Promise((resolve, reject) => {
		getUserIsAdmin(userID).then((isAdmin) => {
			if(isAdmin) {
				resolve(true);
			} else {
				connection.query(`
					SELECT userID, modules.courseID FROM moderators
					INNER JOIN modules
					INNER JOIN questions ON questions.moduleID = modules.id
					WHERE userID = ? AND questions.id = ?
					`, [userID, questionID], (error, result) => {
					if(error) {
						reject();
					} else {
						if(result.length == 1) {
							resolve(true);
						} else if(result.length == 0) {
							resolve(false);
						} else {
							reject();
						}
					}
				});
			}
		}).catch(() => {
			reject();
		});
	});
}
exports.isUserModeratorOfQuestion = isUserModeratorOfQuestion;
