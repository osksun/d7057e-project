const questionView = new function() {
    const submitButton = document.getElementById("button-submit");
    const answerInput = document.getElementById("input-answer");
    const loadingIcon = document.getElementById("loading-icon");
    submitButton.addEventListener("click", this.handleSubmit);

    let questionId;
    let submitHandler;
    let displayRandomHandler;

    this.update = function(questionContent) {
        document.getElementById("question").innerHTML = questionContent;
        MathJax.typeset();
    }

    this.clear = function() {
        document.getElementById("course-name").innerText = "";
        document.getElementById("module-name").innerText = "";
        document.getElementById("question").innerHTML = "";
        document.getElementById("button-question").disabled = true;
    }

    this.handleSubmit = function() {
        submitButton.style.display = "none";
        loadingIcon.style.display = "inline-block";
        DbCom.answerQuestion(questionId, answerInput.value).then((result) => {
            if (result.correct) {
                answerInput.style.backgroundColor = "#00ff00";
                displayLevel.updateXp();
            } else {
                answerInput.style.backgroundColor = "#ff0000";
            }
            loadingIcon.style.display = "none";
            submitButton.style.display = "inline-block";
        });
    }

    this.displayRandom = function(courseId, courseName, moduleId, moduleName) {
        DbCom.getQuestions(courseId, moduleId).then((questions) => {
            if (questions.length == 0) {
                return
            }
            let randomQuestion;
            if (!this.hasOwnProperty("randomQuestion")) {
                randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            } else {
                randomQuestion = this.randomQuestion
            }
            questionId = randomQuestion.id;
            this.clear();
            this.update(randomQuestion.content);
            updatePage("/courses/" + encodeURI(courseName.toLowerCase() + "/" + moduleName.toLowerCase() + "/" + randomQuestion.id.toString().toLowerCase()), moduleName, randomQuestion);
            const questionButton = document.getElementById("button-question");
            questionButton.disabled = false;
            questionButton.children[0].innerText = moduleName;
            questionButton.removeEventListener("click", displayRandomHandler);
            this.randomQuestion = randomQuestion;
            displayRandomHandler = this.displayRandom.bind(this, courseId, courseName, moduleId, moduleName);
            questionButton.click();
            questionButton.addEventListener("click", displayRandomHandler);
            const submitButton = document.getElementById("button-submit");
            submitButton.removeEventListener("click", submitHandler);
            submitHandler = this.handleSubmit.bind(null, randomQuestion.id);
            submitButton.addEventListener("click", submitHandler);
        });
    }
}