
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

				connection.query("CREATE TABLE IF NOT EXISTS users (email VARCHAR(255), password VARCHAR(255), PRIMARY KEY(email))", (error, result) => {
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
				reject();
			} else {
				resolve();
			}
		});
	});
}
exports.createUser = createUser;
