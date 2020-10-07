// Ajax request to get all courses
function getCourses() {
    return ajaxPost("http://127.0.0.1:80/getcourses");
}

// Ajax request to get all modules of given courseName
function getModules(courseName) {
    return ajaxPost("http://127.0.0.1:80/getmodules", encodeURI("course=" + courseName));
}

// Ajax request to get all questions in a module of a course given the courseName and moduleName
function getQuestions(courseName, moduleName) {
    return ajaxPost("http://127.0.0.1:80/getquestions", encodeURI("course=" + courseName + "&module=" + moduleName));
}

// Ajax request to get a specific question by its id
function getQuestion(id) {
    return ajaxPost("http://127.0.0.1:80/getquestion", encodeURI("question=" + id));
}

// Ajax request to post an answer to a question given answer and the id of the question
function answerQuestion(id, answer) {
    return ajaxPost("http://127.0.0.1:80/answer", encodeURI("question=" + id + "&answer=" + answer));
}

// Creates an ajax post request to given url with given data (use this function when no additional data SHOULD be added to the request)
function ajaxPost(url, data = "") {
    return ajaxPostPromise(url, data, (request, data) => {
        request.send(data);
        //request.send(data + "&email=" + email + "&tokenExpireTime=" + tokenExpireTime + "&token=" + token);
    });
}

// Creates an ajax post request to given url with given data (use this function when no additional data should NOT be added to the request)
function ajaxPostAuth(url, data = "") {
    return ajaxPostPromise(url, data, (request, data) => {
        request.send(data);
    });
}

function ajaxPostPromise(url, data, sendFunction) {
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
        sendFunction(request, data);
    });
}
