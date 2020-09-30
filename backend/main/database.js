
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

				connection.query("CREATE TABLE IF NOT EXISTS userdata (email VARCHAR(255), xp BIGINT, PRIMARY KEY(email))", (error, result) => {
					if(error) {
						console.error("Failed to create database tables!");
						reject();
					} else {
						connection.query("CREATE TABLE IF NOT EXISTS courses (name VARCHAR(255), description VARCHAR(255), color CHAR(6), PRIMARY KEY(name))", (error, result) => {
							if(error) {
								console.error("Failed to create database tables!");
								reject();
							} else {
								console.log("Database tables created!");
								resolve();
							}
						});
					}
				});
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
