
const mysql = require("mysql");

const config = require("./database_config.json");
const connection = mysql.createConnection(config);

function connect() {
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
						console.log("Database tables created!");
						resolve();
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
