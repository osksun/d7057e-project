
const mysql = require("mysql");

const config = require("./database_config.json");
const connection = mysql.createConnection(config);

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
					"CREATE TABLE IF NOT EXISTS userdata (id INT NOT NULL, xp BIGINT DEFAULT 0, isAdmin BOOL DEFAULT false, PRIMARY KEY(id))",
					"CREATE TABLE IF NOT EXISTS courses (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255) UNIQUE NOT NULL, description VARCHAR(255) NOT NULL, color CHAR(6) NOT NULL, PRIMARY KEY(id))",
					"CREATE TABLE IF NOT EXISTS modules (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, courseID int NOT NULL, description VARCHAR(255) NOT NULL, PRIMARY KEY(id), FOREIGN KEY(courseID) REFERENCES courses(id), CONSTRAINT uniqueModuleCourse UNIQUE (name, courseID))",
					"CREATE TABLE IF NOT EXISTS questions (id INT NOT NULL AUTO_INCREMENT, moduleID INT NOT NULL, PRIMARY KEY(id), FOREIGN KEY(moduleID) REFERENCES modules(id))",
					"CREATE TABLE IF NOT EXISTS questionsegments (questionID INT NOT NULL, segmentOrder INT NOT NULL, type VARCHAR(255) NOT NULL, content TEXT NOT NULL, answer TEXT, PRIMARY KEY(questionID, segmentOrder), FOREIGN KEY(questionID) REFERENCES questions(id))",
					"CREATE TABLE IF NOT EXISTS answers (userID int NOT NULL, questionID int NOT NULL, PRIMARY KEY(userID, questionID), FOREIGN KEY(userID) REFERENCES userdata(id), FOREIGN KEY(questionID) REFERENCES questions(id))",
					"CREATE TABLE IF NOT EXISTS moderators (userID INT NOT NULL, courseID INT NOT NULL, PRIMARY KEY(userID, courseID), FOREIGN KEY(userID) REFERENCES userdata(id), FOREIGN KEY(courseID) REFERENCES courses(id))"
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

function getCourseByName(name) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT id, name, description, color FROM courses WHERE name=?", [name], (error, result) => {
			if(error) {
				reject();
			} else {
				if(result.length == 1) {
					const row = result[0];
					resolve({id:row.id, name:row.name, description:row.description, color:row.color});
				} else {
					reject();
				}
			}
		});
	});
}
exports.getCourseByName = getCourseByName;

function getCourses(userID) {
	return new Promise((resolve, reject) => {
		connection.query(`
			SELECT courses.id, courses.name, courses.description, courses.color, COUNT(courseID) AS questionCount, COUNT(userID) AS answerCount FROM answers
			RIGHT JOIN questions ON questions.id = answers.questionID AND userID=?
			INNER JOIN modules ON modules.id = questions.moduleID
			RIGHT JOIN courses ON courses.id = modules.courseID
			GROUP BY courses.id
			`, [userID], (error, result) => {
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
						answerCount:row.answerCount
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
		connection.query("INSERT INTO modules (name, courseID, description) VALUES (?, ?, ?)", [name, courseID, description], (error, result) => {
			if(error) {
				reject();
			} else {
				resolve();
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

function getModuleByName(courseID, name) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT id, name, description FROM modules WHERE courseID=? AND name=?", [courseID, name], (error, result) => {
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

function getModules(courseID) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT id, name, description FROM modules WHERE courseID = ?", [courseID], (error, result) => {
			if(error) {
				reject();
			} else {
				const modules = [];
				for(let i = 0; i < result.length; ++i) {
					const row = result[i];
					modules.push({id:row.id, name:row.name, description:row.description});
				}
				resolve(modules);
			}
		});
	});
}
exports.getModules = getModules;

function createQuestion(moduleID, types, content, answers) {
	return new Promise((resolve, reject) => {
		connection.beginTransaction(function(error) {
			if(error) {
				reject();
			} else {
				connection.query("INSERT INTO questions (moduleID) VALUES (?)", [moduleID], (error, result) => {
					if(error) {
						connection.rollback(function() {
							reject();
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

function getQuestions(moduleID) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT id FROM questions WHERE moduleID = ?", [moduleID], (error, result) => {
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
		    ) ORDER BY RAND() LIMIT 1
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
						} else {
							resolve(false);
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
				connection.query("SELECT courseID from modules WHERE id = ?", [moduleID], (error, result) => {
					if(error) {
						reject();
					} else {
						if(result.length == 1) {
							const courseID = result[0].courseID;
							connection.query("SELECT userID, courseID FROM moderators WHERE userID = ? AND courseID = ?", [userID, courseID], (error, result) => {
								if(error) {
									reject();
								} else {
									if(result.length == 1) {
										resolve(true);
									} else {
										resolve(false);
									}
								}
							});
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
				connection.query("SELECT moduleID from questions WHERE id = ?", [questionID], (error, result) => {
					if(error) {
						reject();
					} else {
						if(result.length == 1) {
							const moduleID = result[0].moduleID;
							connection.query("SELECT courseID from modules WHERE id = ?", [moduleID], (error, result) => {
								if(error) {
									reject();
								} else {
									if(result.length == 1) {
										const courseID = result[0].courseID;
										connection.query("SELECT userID, courseID FROM moderators WHERE userID = ? AND courseID = ?", [userID, courseID], (error, result) => {
											if(error) {
												reject();
											} else {
												if(result.length == 1) {
													resolve(true);
												} else {
													resolve(false);
												}
											}
										});
									} else {
										reject();
									}
								}
							});
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
