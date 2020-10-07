const DbCom = {
    /**
     * Ajax request to get all courses
     * @returns {Promise<Array<Course>>} Promise resolves to an array of Course objects
     */
    getCourses: function() {
        return DbCom.ajaxPost("http://127.0.0.1:80/getcourses");
    },

    /**
     * Ajax request to get all modules of given courseName
     * @param {string} courseName the name of the course
     * @return {Promise<Array<Module>>} Promise resolves to an array of Module objects
     */
    getModules: function getModules(courseName) {
        return DbCom.ajaxPost("http://127.0.0.1:80/getmodules", encodeURI("course=" + courseName));
    },

    /**
     * Ajax request to get all questions in a module of a course given the courseName and moduleName
     * @param {string} courseName the name of the course
     * @param {string} moduleName the name of the module
     * @return {Promise<Array<Question>>} Promise resolves to an array of Question objects
     */
    getQuestions: function getQuestions(courseName, moduleName) {
        return DbCom.ajaxPost("http://127.0.0.1:80/getquestions", encodeURI("course=" + courseName + "&module=" + moduleName));
    },

    /**
     * Ajax request to get a specific question by its id
     * @param {unsigned int} id the id of the question
     * @return {Promise<Question>} Promise resolves to a Question object
     */
    getQuestion: function getQuestion(id) {
        return DbCom.ajaxPost("http://127.0.0.1:80/getquestion", encodeURI("question=" + id));
    },

    /**
     * Ajax request to post an answer to a question given answer and the id of the question
     * @param {unsigned int} id the id of the question
     * @param {string} answer the answer to be provided for the question
     * @return {Promise<boolean>} Promise resolves to a boolean value depending on if the answer was an correct answer for the given question
     */
    answerQuestion: function answerQuestion(id, answer) {
        return DbCom.ajaxPost("http://127.0.0.1:80/answer", encodeURI("question=" + id + "&answer=" + answer));
    },

    getXp: function getXp() {
        // TODO: Instead of hardcoding the email, it should be taken from storage of the logged in user.
        //       The email should not be passed in here when this is fixed, it should be passed in every request using the ajaxPost function
        //return ajaxPost("http://127.0.0.1:80/getxp") // <-- Should be like this when fixed
        return DbCom.ajaxPost("http://127.0.0.1:80/getxp", encodeURI("email=c@a.com"))
    },

    /**
     * Creates an ajax post request to given url with given data
     * Use this function when additional data should be appended to the request
     * @param {string} url the url to send the request to
     * @param {string} data the data to be sent in the body of the request
     * @return {Promise<any>} Promise resolves to the response to the request
     */
    ajaxPost: function ajaxPost(url, data = "") {
        return DbCom.ajaxPostPromise(url, data, (request, data) => {
            request.send(data);
            // TODO: When available we want to append the email, tokenExpireTime and the token to every request made here, see comment below
            //request.send(data + "&email=" + email + "&tokenExpireTime=" + tokenExpireTime + "&token=" + token);
        });
    },

    /**
     * Creates an ajax post request to given url with given data
     * Use this function when no additional data should be appended to the request
     * @param {string} url
     * @param {string} data
     * @return {Promise<any>} Promise resolves to the response of the request
     */
    ajaxPostAuth: function ajaxPostAuth(url, data = "") {
        return DbCom.ajaxPostPromise(url, data, (request, data) => {
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
    ajaxPostPromise: function ajaxPostPromise(url, data, send) {
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
                            resolve(result);
                        } else {
                            resolve();
                        }
                    } else {
                        reject();
                    }
                }
            }
            send(request, data);
        });
    },
}
