const questionViewManager = new function() {
    const submitButton = document.getElementById("submit-button");
    const answerInput = document.getElementById("answer-input");
    const loadingIcon = document.getElementById("loading-icon");
    const question = document.getElementById("question");
    const questionButton = document.getElementById("question-button");

    submitButton.addEventListener("click", this.handleSubmit);

    let questionId;
    let submitHandler;
    let displayRandomHandler;
    let activeEncodedCourseName = null;

    this.update = function(questionContent) {
        question.innerHTML = questionContent;
        MathJax.texReset(0);
		MathJax.typesetClear();
		MathJax.typesetPromise();
    };

    this.updateButton = function(encodedCourseName) {
        if (encodedCourseName !== activeEncodedCourseName) {
            this.clear();
        }
    };

    this.clear = function() {
        document.getElementById("course-name").innerText = "";
        document.getElementById("module-name").innerText = "";
        question.innerText = "";
        document.getElementById("question-button").disabled = true;
        questionButton.children[0].innerText = "Question";
        activeEncodedCourseName = null;
    };

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
    };

    this.displayRandom = function(courseId, courseName, moduleId, moduleName, addToHistory = true) {
        DbCom.getQuestions(courseId, moduleId).then((questions) => {
            if (questions.length == 0) {
                console.log("No questions found");
                return;
            }
            let randomQuestion;
            if (!this.hasOwnProperty("randomQuestion")) {
                randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            } else {
                randomQuestion = this.randomQuestion;
            }
            questionId = randomQuestion.id;
            this.clear();
            this.update(randomQuestion.content);
            activeEncodedCourseName = encodeURIComponent(courseName);
            viewManager.updatePage("/courses/" + encodeURIComponent(courseName.toLowerCase()) + "/" + encodeURIComponent(moduleName.toLowerCase()), moduleName, addToHistory);
            questionButton.disabled = false;
            questionButton.children[0].innerText = moduleName;
            questionButton.removeEventListener("click", displayRandomHandler);
            this.randomQuestion = randomQuestion;
            displayRandomHandler = this.displayRandom.bind(this, courseId, courseName, moduleId, moduleName);
            viewManager.toggleQuestionView();
            questionButton.addEventListener("click", displayRandomHandler);
            submitButton.removeEventListener("click", submitHandler);
            submitHandler = this.handleSubmit.bind(null, randomQuestion.id);
            submitButton.addEventListener("click", submitHandler);
        });
    };
}();