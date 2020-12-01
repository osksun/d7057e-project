const DbCom = new function() {
	const mainURL = "http://127.0.0.1:80/";
	const authURL = "http://127.0.0.1:81/";

	const skipVerification = false;

	let userID = null;
	let refreshToken = null;
	let loginData = localStorage.getItem("login_data");
	if(loginData) {
		loginData = JSON.parse(loginData);
		userID = loginData["userID"];
		refreshToken = loginData["refreshToken"];
	}

	function sha512(string) {
		return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(string)).then(buffer => {
	    return Array.prototype.map.call(new Uint8Array(buffer), (char) => {
				return ("00" + char.toString(16)).slice(-2);
			}).join("");
	  });
	}
	function clientSidePasswordHash(password) {
		//Hash password + constant salt
		return sha512(password + "c27097af11dce54be22679a5bfd7b7ea");
	}

	this.registerUser = function(email, password, captchaToken) {
		return new Promise((resolve, reject) => {
			clientSidePasswordHash(password).then((passwordHash) => {
				this.ajaxPostAuth(authURL + "register", "email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(passwordHash) + "&captcha=" + encodeURIComponent(captchaToken)).then(resolve).catch(reject);
			});
		});
	};

	this.recoverUser = function(email, password) {
		return new Promise((resolve, reject) => {
			clientSidePasswordHash(password).then((passwordHash) => {
				this.ajaxPostAuth(authURL + "recover", "email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(passwordHash)).then(resolve).catch(reject);
			});
		});
	};

	this.deleteUser = function(password) {
		return new Promise((resolve, reject) => {
			clientSidePasswordHash(password).then((passwordHash) => {
				this.ajaxPostAuth(authURL + "delete", "userID=" + userID + "&password=" + encodeURIComponent(passwordHash)).then(resolve).catch(reject);
			});
		});
	};

	this.changeUserPassword = function(currentPassword, newPassword) {
		return new Promise((resolve, reject) => {
			clientSidePasswordHash(currentPassword).then((currentPasswordHash) => {
				clientSidePasswordHash(newPassword).then((newPasswordHash) => {
					return this.ajaxPostAuth(authURL + "changepassword", "userID=" + userID + "&currentPassword=" + encodeURIComponent(currentPasswordHash) + "&newPassword=" + encodeURIComponent(newPasswordHash)).then(resolve).catch(reject);
				});
			});
		});
	};

	this.createRefreshToken = function(email, password) {
		return new Promise((resolve, reject) => {
			clientSidePasswordHash(password).then((passwordHash) => {
				return this.ajaxPostAuth(authURL + "createrefreshtoken", "email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(passwordHash)).then(resolve).catch(reject);
			});
		});
	};

	let accessTokenCreatePromise = null;
	let accessToken = null;
	let accessTokenExpireTime = 0;
	this.createAccessToken = function() {
		return new Promise((resolve, reject) => {
			if(accessTokenCreatePromise == null) {
				accessTokenCreatePromise = this.ajaxPostAuth(authURL + "createaccesstoken", "userID=" + userID + "&refreshToken=" + encodeURIComponent(refreshToken));
			}

			accessTokenCreatePromise.then((result) => {
				accessToken = result.signature;
				accessTokenExpireTime = result.expireTime;
				accessTokenCreatePromise = null;
				resolve({accessToken:accessToken, accessTokenExpireTime:accessTokenExpireTime});
			}).catch((error) => {
				accessTokenCreatePromise = null;
				reject();
			});
		});
	};
	this.getAccessToken = function() {
		return new Promise((resolve, reject) => {
			if(accessToken != null) {
				resolve({accessToken:accessToken, accessTokenExpireTime:accessTokenExpireTime});
			} else {
				this.createAccessToken().then(() => {
					resolve({accessToken:accessToken, accessTokenExpireTime:accessTokenExpireTime});
				}).catch(() => {
					//If refreshtoken has expired redirect to login page
					window.location = "/login";
					reject();
				});
			}
		});
	};

	this.isAdmin = function() {
		return this.ajaxPost(mainURL + "isadmin");
	};

	this.isModerator = function(courseID) {
		return this.ajaxPost(mainURL + "ismoderator", "courseID=" + courseID);
	};

	/**
	 * Ajax request to create a course
	 * @param {string} name the name of the new course
	 * @param {string} description the description of the new course
	 * @param {string} color the color as a hexadecimal value for the cards of the new course
	 * @returns {Promise<boolean>} Promise resolves to a boolean value depending on the course was successfully created or not
	 */
	this.createCourse = function(name, description, color) {
		return this.ajaxPost(mainURL + "createcourse",
			"name=" + encodeURIComponent(name) +
			"&description=" + encodeURIComponent(description) +
			"&color=" + encodeURIComponent(color));
	};

	this.deleteCourse = function(courseId) {
		return this.ajaxPost(mainURL + "deletecourse", "courseID=" + encodeURIComponent(courseId));
	};

	/**
	 * Ajax request to create a module for a course
	 * @param {string} name the name of the new module
	 * @param {unsigned int} courseId the id of the course the module should belong to
	 * @param {string} description the description of the new module
	 * @returns {Promise<boolean>} Promise resolves to a boolean value depending on the module was successfully created or not
	 */
	this.createModule = function(name, courseId, description) {
		return this.ajaxPost(mainURL + "createmodule",
			"name=" + encodeURIComponent(name) +
			"&courseID=" + encodeURIComponent(courseId) +
			"&description=" + encodeURIComponent(description));
	};

	this.deleteModule = function(moduleID) {
		return this.ajaxPost(mainURL + "deletemodule", "moduleID=" + encodeURIComponent(moduleID));
	};

	/**
	 * Ajax request to create question for a module
	 * @param {unsigned int} moduleId the id of the module the question should belong to
	 * @param {string[]} types a list of the types of the segments
	 * @param {string[]} content a list of the content of the segments
	 * @param {string[]} answers a list of regular expressions for defining the answer of the segments
	 * @returns {Promise<boolean>} Promise resolves to a boolean value depending on the question was successfully created or not
	 */
	this.createQuestion = function(moduleId, types, content, answers) {
		return this.ajaxPost(mainURL + "createquestion",
			"moduleID=" + encodeURIComponent(moduleId) +
			"&types=" + encodeURIComponent(JSON.stringify(types)) +
			"&content=" + encodeURIComponent(JSON.stringify(content)) +
			"&answers=" + encodeURIComponent(JSON.stringify(answers)));
	};

	this.deleteQuestion = function(questionID) {
		return this.ajaxPost(mainURL + "deletequestion", "questionID=" + questionID);
	};

	/**
	 * Ajax request to update an existing course
	 * @param {unsigned int} id the id of the course to update
	 * @param {string} name the new name of the course
	 * @param {string} description the new description of the course
	 * @param {string} color the new color as a hexadecimal value for the cards of the course
	 * @returns {Promise<boolean>} Promise resolves to a boolean value depending on the course was successfully updated or not
	 */
	this.updateCourse = function(id, name, description, color) {
		return this.ajaxPost(mainURL + "updatecourse",
			"courseID=" + id +
			"&name=" + encodeURIComponent(name) +
			"&description=" + encodeURIComponent(description) +
			"&color=" + encodeURIComponent(color));
	};

	/**
	 * Ajax request to update an existing module
	 * @param {unsigned int} id the id of the module to update
	 * @param {string} name the new name of the module
	 * @param {string} description the new description of the module
	 * @returns {Promise<boolean>} Promise resolves to a boolean value depending on the module was successfully updated or not
	 */
	this.updateModule = function(id, name, description) {
		return this.ajaxPost(mainURL + "updatemodule",
			"moduleID=" + id +
			"&name=" + encodeURIComponent(name) +
			"&description=" + encodeURIComponent(description));
	};

	/**
	 * Ajax request to update a specific question
	 * @param {unsigned int} questionId the id of the question to update
	 * @param {string[]} types a list of the types of the segments
	 * @param {string[]} content a list of the content of the segments
	 * @param {string[]} answers a list of regular expressions for defining the answer of the segments
	 * @returns {Promise<boolean>} Promise resolves to a boolean value depending on the question was successfully updated or not
	 */
	this.updateQuestion = function(questionId, types, content, answers) {
		return this.ajaxPost(mainURL + "updatequestion",
			"questionID=" + encodeURIComponent(questionId) +
			"&types=" + encodeURIComponent(JSON.stringify(types)) +
			"&content=" + encodeURIComponent(JSON.stringify(content)) +
			"&answers=" + encodeURIComponent(JSON.stringify(answers)));
	};

	/**
	 * Ajax request to get a specific course by name
	 * @param {string} name the name of the course
	 * @returns {Promise<Course>} Promise resolves to a Course object
	 */
	this.getCourseByName = function(name) {
		return this.ajaxPost(mainURL + "getcoursebyname",
			"name=" + encodeURIComponent(name));
	};

	/**
	 * Ajax request to get all courses
	 * @returns {Promise<Array<Course>>} Promise resolves to an array of Course objects
	 */
	this.getCourses = function() {
		return this.ajaxPost(mainURL + "getcourses");
	};

	/**
	 * Ajax request to get a specific module by name
	 * @param {string} name the name of the module
	 * @returns {Promise<Module>} Promise resolves to a Module object
	 */
	this.getModuleByName = function(courseId, name) {
		return this.ajaxPost(mainURL + "getmodulebyname",
			"courseID=" + encodeURIComponent(courseId) +
			"&name=" + encodeURIComponent(name));
	};

	/**
	 * Ajax request to get all modules in a course
	 * @param {unsigned int} id the id of the course
	 * @return {Promise<Array<Module>>} Promise resolves to an array of Module objects
	 */
	this.getModules = function(courseId) {
		return this.ajaxPost(mainURL + "getmodules",
			"courseID=" + encodeURIComponent(courseId));
	};

	/**
	 * Ajax request to get all questions in a module
	 * @param {unsigned int} moduleId the id of the module
	 * @return {Promise<Array<Question>>} Promise resolves to an array of Question objects
	 */
	this.getQuestions = function(moduleId) {
		return this.ajaxPost(mainURL + "getquestions",
			"moduleID=" + encodeURIComponent(moduleId));
	};

	/**
	 * Ajax request to get a random unanswered question in a module
	 * @param {unsigned int} moduleId the id of the module
	 * @return {Promise<Question>} Promise resolves to a Question object
	 */
	this.getRandomUnansweredQuestion = function(moduleId) {
		return this.ajaxPost(mainURL + "getrandomunansweredquestion",
			"moduleID=" + encodeURIComponent(moduleId));
	};

	/**
	 * Ajax request to get all the segments of a question with the specific id
	 * @param {unsigned int} id the id of the question
	 * @return {Promise<[QuestionSegment]>} Promise resolves to a list of questionn segment objects
	 */
	this.getQuestionSegments = function(id) {
		return this.ajaxPost(mainURL + "getquestionsegments",
			"questionID=" + encodeURIComponent(id));
	};

	/**
	 * Ajax request to post answers to a question given answers and the id of the question
	 * @param {unsigned int} id the id of the question
	 * @param {string[]} answers the answers to be provided for the question
	 * @return {Promise<boolean>} Promise resolves to a boolean value depending on if the answer was an correct answer for the given question
	 */
	this.answerQuestion = function(id, answers) {
		return this.ajaxPost(mainURL + "answer",
			"questionID=" + encodeURIComponent(id) +
			"&answers=" + encodeURIComponent(JSON.stringify(answers)));
	};

	this.addModerator = function(username, courseId) {
		return this.ajaxPost(mainURL + "addmoderator", "username=" + encodeURIComponent(username) + "&courseID=" + courseId);
	};
	this.deleteModerator = function(userID, courseId) {
		return this.ajaxPost(mainURL + "deletemoderator", "moderatorID=" + userID + "&courseID=" + courseId);
	};
	this.getModerators = function(courseId) {
		return this.ajaxPost(mainURL + "getmoderators", "courseID=" + courseId);
	};

	/**
	 * Ajax request to get the xp of the current user
	 * @return {Promise<number>} Promise resolves to a number representing the amount of xp the current user has
	 */
	this.getXp = function() {
		return this.ajaxPost(mainURL + "getxp");
	};

	this.getUsername = function() {
		return this.ajaxPost(mainURL + "getusername");
	};
	this.setUsername = function(username) {
		return this.ajaxPost(mainURL + "setusername", "username=" + encodeURIComponent(username));
	};

	/**
	 * Creates an ajax post request to given url with given data
	 * Use this function when additional data should be appended to the request
	 * @param {string} url the url to send the request to
	 * @param {string} data the data to be sent in the body of the request
	 * @return {Promise<any>} Promise resolves to the response to the request
	 */
	this.ajaxPost = function(url, data = "") {
		return new Promise((resolve, reject) => {
			if(skipVerification) {
				function createAuthData() {
					let authenticationData = "";
					if (data.length > 0)
					{
						authenticationData += "&";
					}
					authenticationData += "userID=" + userID;
					return authenticationData;
				}
				this.ajaxPostPromise(url, data + createAuthData()).then((result) => {
					resolve(result);
				}).catch((result) => {
					reject(result);
				});
			} else {
				this.getAccessToken().then((tokenData) => {
					function createAuthData(accessToken, accessTokenExpireTime) {
						let authenticationData = "";
						if (data.length > 0)
						{
							authenticationData += "&";
						}
						authenticationData += "userID=" + userID + "&token=" + encodeURIComponent(accessToken) + "&tokenExpireTime=" + accessTokenExpireTime;
						return authenticationData;
					}
					this.ajaxPostPromise(url, data + createAuthData(tokenData.accessToken, tokenData.accessTokenExpireTime)).then((result) => {
						resolve(result);
					}).catch((result) => {
						if(result != null) {
							if(result.error == "Invalid token") {//TODO check with error code instead
								this.createAccessToken().then((tokenData) => {
									this.ajaxPostPromise(url, data + createAuthData(tokenData.accessToken, tokenData.accessTokenExpireTime)).then((result) => {
										resolve(result);
									}).catch((result) => {
										reject(result);
									});
								}).catch(() => {
									reject();
								});
							} else {
								reject(result);
							}
						} else {
							reject(result);
						}
					});
				}).catch(() => {
					reject();
				});
			}
		});
	};

	/**
	 * Creates an ajax post request to given url with given data
	 * Use this function when no additional data should be appended to the request
	 * @param {string} url
	 * @param {string} data
	 * @return {Promise<any>} Promise resolves to the response of the request
	 */
	this.ajaxPostAuth = function(url, data = "") {
		return this.ajaxPostPromise(url, data);
	};

	/**
	 * Creates an ajax post request
	 * @param {string} url
	 * @param {string} data
	 * @return {Promise<any>} Promise resolves to the response of the request
	 */
	this.ajaxPostPromise = function(url, data) {
		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.open("POST", url, true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.onreadystatechange = () => {
				if(request.readyState === XMLHttpRequest.DONE) {
					const status = request.status;
					if (status === 0 || (status >= 200 && status < 400)) {
						if (request.responseText.length > 0) {
							const result = JSON.parse(request.responseText);
							if (result.hasOwnProperty('error')) {
								reject(result);
							} else {
								resolve(result);
							}
						} else {
							reject(null);
						}
					} else {
						reject(null);
					}
				}
			};
			request.send(data);
		});
	};
}();
