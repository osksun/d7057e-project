
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
					"CREATE TABLE IF NOT EXISTS userdata (email VARCHAR(255), xp BIGINT, PRIMARY KEY(email))",
					"CREATE TABLE IF NOT EXISTS courses (name VARCHAR(255), description VARCHAR(255), color CHAR(6), PRIMARY KEY(name))",
					"CREATE TABLE IF NOT EXISTS modules (name VARCHAR(255), course VARCHAR(255), description VARCHAR(255), PRIMARY KEY(name, course), FOREIGN KEY(course) REFERENCES courses(name))",
					"CREATE TABLE IF NOT EXISTS questions (id INT NOT NULL AUTO_INCREMENT, module VARCHAR(255), course VARCHAR(255), content TEXT, answer TEXT, PRIMARY KEY(id), FOREIGN KEY(module, course) REFERENCES modules(name, course))"
				];

				function createTable() {
					if(tables.length > 0) {
						const sql = tables.splice(0, 1)[0];
						connection.query(sql, (error, result) => {
							if(error) {
								console.error("Failed to create database tables!");
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

function getXP(email) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT xp FROM userdata WHERE email = ?", [email], (error, result) => {
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

function getQuestion(id) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT id, content, course, module FROM questions WHERE id = ?", [id], (error, result) => {
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

function getQuestionAnswer(id) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT answer FROM questions WHERE id = ?", [id], (error, result) => {
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
