const DbCom = new function() {
    const mainURL = "http://127.0.0.1:80/";
    const authURL = "http://127.0.0.1:81/";

    /**
     * Ajax request to create a course
     * @param {string} name the name of the new course
     * @param {string} description the description of the new course
     * @param {string} color the color as a hexadecimal value for the cards of the new course
     * @returns {Promise<boolean>} Promise resolves to a boolean value depending on the course was successfully created or not
     */
    this.createCourse = function(name, description, color) {
        return this.ajaxPost(mainURL + "createcourse", encodeURI("name=" + name + "&description=" + description + "&color=" + color));
    }

    /**
     * Ajax request to create a module for a course
     * @param {string} name the name of the new module
     * @param {unsigned int} courseId the id of the course the module should belong to
     * @param {string} description the description of the new module
     * @returns {Promise<boolean>} Promise resolves to a boolean value depending on the module was successfully created or not
     */
    this.createModule = function(name, courseId, description) {
        return this.ajaxPost(mainURL + "createmodule", encodeURI("name=" + name + "&courseID=" + courseId + "&description=" + description));
    }

    /**
     * Ajax request to create question for a module
     * @param {unsigned int} moduleId the id of the module the question should belong to
     * @param {string} content the content of the question
     * @param {string} answer a regular expression for defining the answer of the question
     * @returns {Promise<boolean>} Promise resolves to a boolean value depending on the module was successfully created or not
     */
    this.createQuestion = function(moduleId, content, answer) {
        return this.ajaxPost(mainURL + "createquestion", encodeURI("moduleID=" + moduleId + "&content=" + content + "&answer=" + answer));
    }

    /**
     * Ajax request to get all courses
     * @returns {Promise<Array<Course>>} Promise resolves to an array of Course objects
     */
    this.getCourses = function() {
        return this.ajaxPost(mainURL + "getcourses");
    },

    /**
     * Ajax request to get all modules of given courseName
     * @param {unsigned int} id the id of the course
     * @return {Promise<Array<Module>>} Promise resolves to an array of Module objects
     */
    this.getModules = function(courseId) {
        return this.ajaxPost(mainURL + "getmodules", encodeURI("courseID=" + courseId));
    },

    /**
     * Ajax request to get all questions in a module of a course given the courseName and moduleName
     * @param {unsigned int} courseId the id of the course
     * @param {unsigned int} moduleId the id of the module
     * @return {Promise<Array<Question>>} Promise resolves to an array of Question objects
     */
    this.getQuestions = function(courseId, moduleId) {
        return this.ajaxPost(mainURL + "getquestions", encodeURI("courseID=" + courseId + "&moduleID=" + moduleId));
    },

    /**
     * Ajax request to get a specific question by its id
     * @param {unsigned int} id the id of the question
     * @return {Promise<Question>} Promise resolves to a Question object
     */
    this.getQuestion = function(id) {
        return this.ajaxPost(mainURL + "getquestion", encodeURI("questionID=" + id));
    },

    /**
     * Ajax request to post an answer to a question given answer and the id of the question
     * @param {unsigned int} id the id of the question
     * @param {string} answer the answer to be provided for the question
     * @return {Promise<boolean>} Promise resolves to a boolean value depending on if the answer was an correct answer for the given question
     */
    this.answerQuestion = function(id, answer) {
        return this.ajaxPost(mainURL + "answer", encodeURI("questionID=" + id + "&answer=" + answer));
    },

    /**
     * Ajax request to get the xp of the current user
     * @return {Promise<number>} Promise resolves to a number representing the amount of xp the current user has
     */
    this.getXp = function() {
        return this.ajaxPost(mainURL + "getxp");
    },

    /**
     * Creates an ajax post request to given url with given data
     * Use this function when additional data should be appended to the request
     * @param {string} url the url to send the request to
     * @param {string} data the data to be sent in the body of the request
     * @return {Promise<any>} Promise resolves to the response to the request
     */
    this.ajaxPost = function(url, data = "") {
        return this.ajaxPostPromise(url, data, (request, data) => {
            if (data.length > 0)
            {
                data += "&";
            }
            request.send(data + encodeURI("userID=0"));
            // TODO: When available we want to append the userID, tokenExpireTime and the token to every request made here, see comment below
            //request.send(data + "&userID=" + userID + "&tokenExpireTime=" + tokenExpireTime + "&token=" + token);
        });
    },

    /**
     * Creates an ajax post request to given url with given data
     * Use this function when no additional data should be appended to the request
     * @param {string} url
     * @param {string} data
     * @return {Promise<any>} Promise resolves to the response of the request
     */
    this.ajaxPostAuth = function(url, data = "") {
        return this.ajaxPostPromise(url, data, (request, data) => {
            request.send(data);
        });
    },

    /**
     * Creates an ajax post request
     * @param {string} url
     * @param {string} data
     * @param {function} send the function to use when sending the request, used for allowing to manipulate data before sending the request
     * @return {Promise<any>} Promise resolves to the response of the request
     */
    this.ajaxPostPromise = function(url, data, send) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open("POST", url, true);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            request.onreadystatechange = () => {
                if(request.readyState === XMLHttpRequest.DONE) {
                    const status = request.status;
                    if (status === 0 || (status >= 200 && status < 400)) {
                        if (request.hasOwnProperty('error')) {
                            reject(request.error);
                        } else if (request.responseText.length > 0) {
                            const result = JSON.parse(request.responseText);
                            resolve(result);
                        } else {
                            resolve();
                        }
                    } else {
                        reject();
                    }
                }
            };
            send(request, data);
        });
    };
}();
