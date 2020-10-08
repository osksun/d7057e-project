
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
					"CREATE TABLE IF NOT EXISTS courses (name VARCHAR(255), description VARCHAR(255), color CHAR(6), PRIMARY KEY(name))",
					"CREATE TABLE IF NOT EXISTS modules (name VARCHAR(255), course VARCHAR(255), description VARCHAR(255), PRIMARY KEY(name, course), FOREIGN KEY(course) REFERENCES courses(name))",
					"CREATE TABLE IF NOT EXISTS questions (id INT NOT NULL AUTO_INCREMENT, module VARCHAR(255), course VARCHAR(255), content TEXT, answer TEXT, PRIMARY KEY(id), FOREIGN KEY(module, course) REFERENCES modules(name, course))"
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
					resolve(result[0].isAdmin);
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

function getCourses() {
	return new Promise((resolve, reject) => {
		connection.query("SELECT name, description, color FROM courses", (error, result) => {
			if(error) {
				reject();
			} else {
				const courses = [];
				for(let i = 0; i < result.length; ++i) {
					const row = result[i];
					courses.push({name:row.name, description:row.description, color:row.color});
				}
				resolve(courses);
			}
		});
	});
}
exports.getCourses = getCourses;

function createModule(name, courseName, description) {
	return new Promise((resolve, reject) => {
		connection.query("INSERT INTO modules (name, course, description) VALUES (?, ?, ?)", [name, courseName, description], (error, result) => {
			if(error) {
				reject();
			} else {
				resolve();
			}
		});
	});
}
exports.createModule = createModule;

function getModules(course) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT name, description FROM modules WHERE course = ?", [course], (error, result) => {
			if(error) {
				reject();
			} else {
				const modules = [];
				for(let i = 0; i < result.length; ++i) {
					const row = result[i];
					modules.push({name:row.name, description:row.description});
				}
				resolve(modules);
			}
		});
	});
}
exports.getModules = getModules;

function createQuestion(courseName, moduleName, content, answer) {
	return new Promise((resolve, reject) => {
		connection.query("INSERT INTO questions (course, module, content, answer) VALUES (?, ?, ?, ?)", [courseName, moduleName, content, answer], (error, result) => {
			if(error) {
				reject();
			} else {
				resolve();
			}
		});
	});
}
exports.createQuestion = createQuestion;

function getQuestions(courseName, moduleName) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT id, content FROM questions WHERE (course = ? AND module = ?)", [courseName, moduleName], (error, result) => {
			if(error) {
				reject();
			} else {
				const questions = [];
				for(let i = 0; i < result.length; ++i) {
					const row = result[i];
					questions.push({id:row.id, content:row.content});
				}
				resolve(questions);
			}
		});
	});
}
exports.getQuestions = getQuestions;

function getQuestion(questionID) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT id, content, course, module FROM questions WHERE id = ?", [questionID], (error, result) => {
			if(error) {
				reject();
			} else {
				if(result.length == 1) {
					resolve({id:result[0].id, content:result[0].content, course:result[0].course, module:result[0].module});
				} else {
					reject();
				}
			}
		});
	});
}
exports.getQuestion = getQuestion;

function getQuestionAnswer(questionID) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT answer FROM questions WHERE id = ?", [questionID], (error, result) => {
			if(error) {
				reject();
			} else {
				if(result.length == 1) {
					resolve(result[0].answer);
				} else {
					reject();
				}
			}
		});
	});
}
exports.getQuestionAnswer = getQuestionAnswer;
