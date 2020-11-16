
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const errorCode = require("../error_code.js");

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

				connection.query("CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, deleteon DATE, PRIMARY KEY(id))", (error, result) => {
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
	});
}
exports.connect = connect;


function createUser(email, passwordHash) {
	return new Promise((resolve, reject) => {
		connection.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, passwordHash], (error, result) => {
			if(error) {
				if(error.code == "ER_DUP_ENTRY") {
					reject({
						error:"User already exists",
						errorCode:errorCode.duplicateUser
					});
				} else {
					reject({
						error:"Database error",
						errorCode:errorCode.unknownDatabaseError
					});
				}
			} else {
				resolve(result.insertId);
			}
		});
	});
}
exports.createUser = createUser;

function changeUserPassword(userID, passwordHash) {
	return new Promise((resolve, reject) => {
		connection.query("UPDATE users SET password = ? WHERE id = ? and deleteon IS NULL", [passwordHash, userID], (error, result) => {
			if(error) {
				reject();
			} else {
				resolve();
			}
		});
	});
}
exports.changeUserPassword = changeUserPassword;

function loginUser(email, password) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT id, password FROM users WHERE email = ? and deleteon IS NULL", [email], (error, result) => {
			if(error) {
				reject();
			} else {
				if(result.length != 1) {
					reject();
				} else {
					const storedPasswordHash = result[0].password;
					bcrypt.compare(password, storedPasswordHash).then((success) => {
						if(success == true) {
							resolve(result[0].id);
						} else {
							reject();
						}
					}).catch(() => {
						reject();
					})
				}
			}
		});
	});
}
exports.loginUser = loginUser;

function loginUserID(userID, password) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT password FROM users WHERE id = ? and deleteon IS NULL", [userID], (error, result) => {
			if(error) {
				reject();
			} else {
				if(result.length != 1) {
					reject();
				} else {
					const storedPasswordHash = result[0].password;
					bcrypt.compare(password, storedPasswordHash).then((success) => {
						if(success == true) {
							resolve();
						} else {
							reject();
						}
					}).catch(() => {
						reject();
					})
				}
			}
		});
	});
}
exports.loginUserID = loginUserID;

function softDeleteUserID(userID) {
	return new Promise((resolve, reject) => {
		//Delete in 30 days
		connection.query("UPDATE users SET deleteon = DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY) WHERE id = ?", [userID], (error, result) => {
			if(error) {
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
exports.softDeleteUserID = softDeleteUserID;

function purgeExpiredUsers() {
	return new Promise((resolve, reject) => {
		connection.query("DELETE FROM users WHERE deleteon <= CURRENT_DATE", (error, result) => {
			if(error) {
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
exports.purgeExpiredUsers = purgeExpiredUsers;
