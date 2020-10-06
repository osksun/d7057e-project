function getCourses() {
    return ajaxPost("http://127.0.0.1:80/getcourses");
}

function getModules(courseName) {
    return ajaxPost("http://127.0.0.1:80/getmodules", encodeURI("course=" + courseName));
}

function getQuestions(courseName, moduleName) {
    return ajaxPost("http://127.0.0.1:80/getquestions", encodeURI("course=" + courseName + "&module=" + moduleName));
}

function getQuestion(id) {
    return ajaxPost("http://127.0.0.1:80/getquestion", encodeURI("question=" + id));
}

function answerQuestion(id, answer) {
    return ajaxPost("http://127.0.0.1:80/answer", encodeURI("question=" + id + "&answer=" + answer));
}

function ajaxPost(url, data = "") {
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
        sendAjaxRequest(request, data);
    });
}

function sendAjaxRequest(request, data = "") {
    request.send(data);
    //request.send(data + "&email=" + email + "&tokenExpireTime=" + tokenExpireTime + "&token=" + token);
}