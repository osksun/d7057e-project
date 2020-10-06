function getCourses() {
    return ajaxPost("http://127.0.0.1:80/getcourses");
}

function getQuestions(course, module) {
    return ajaxPost("http://127.0.0.1:80/getquestions", encodeURI("course=" + course + "&module=" + module));
}

function getModules(course) {
    return ajaxPost("http://127.0.0.1:80/getmodules", encodeURI("course=" + course));
}

function ajaxPost(url, data = "") {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("POST", url, true);
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