const questionViewManager = new function() {
    const submitButton = document.getElementById("submit-button");
    const answerInput = document.getElementById("answer-input");
    const loadingIcon = document.getElementById("loading-icon");
    const questionField = document.getElementById("question");
    const questionButton = document.getElementById("question-button");

    submitButton.addEventListener("click", this.handleSubmit);

    let submitHandler;
    let displayRandomHandler;
    let currentCourseId = null;
    let currentModuleId = null;
    let currentQuestion = null;

    this.update = function(questionContent) {
        questionField.innerText = questionContent;
        MathJax.texReset(0);
		MathJax.typesetClear();
		MathJax.typesetPromise();
    };

    this.updateButton = function(courseId) {
        if (courseId !== currentCourseId) {
            this.clear();
        }
    };

    this.clear = function() {
        document.getElementById("course-name").innerText = "";
        document.getElementById("module-name").innerText = "";
        questionField.innerText = "";
        document.getElementById("question-button").disabled = true;
        questionButton.children[0].innerText = "Question";
        currentCourseId = null;
        currentQuestion = null;
    };

    this.handleSubmit = function(questionId) {
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

    const setupQuestion = (question, courseId, courseName, moduleId, moduleName, addToHistory) => {
        // Update the page with the content of the question
        this.update(question.content);
        // Note current course and module ids
        currentCourseId = courseId;
        currentModuleId = moduleId;
        // Setup Page URL, title and history
        viewManager.updatePage("/courses/" + encodeURIComponent(courseName.toLowerCase()) + "/" + encodeURIComponent(moduleName.toLowerCase()), moduleName, addToHistory);
        // Setup question button
        questionButton.disabled = false;
        questionButton.children[0].innerText = moduleName;
        questionButton.removeEventListener("click", displayRandomHandler);
        displayRandomHandler = this.displayRandom.bind(this, courseId, courseName, moduleId, moduleName);
        questionButton.addEventListener("click", displayRandomHandler);
        // Setup submit button
        submitButton.removeEventListener("click", submitHandler);
        submitHandler = this.handleSubmit.bind(null, currentQuestion.id);
        submitButton.addEventListener("click", submitHandler);
        // Toggle view
        viewManager.toggleQuestionView();
    };

    this.displayRandom = function(courseId, courseName, moduleId, moduleName, addToHistory = true) {
        if (moduleId != currentModuleId) {
            currentQuestion = null;
        }
        if (currentQuestion === null) {
            // Get all questions of the module
            DbCom.getQuestions(courseId, moduleId).then((questions) => {
                if (questions.length == 0) {
                    console.log("No questions found");
                    return;
                }
                currentQuestion = questions[Math.floor(Math.random() * questions.length)];
                setupQuestion(currentQuestion, courseId, courseName, moduleId, moduleName, addToHistory);
            }).catch((err) => {
                console.log(err);
            });
        } else {
            // Get a specific question
            DbCom.getQuestion(currentQuestion.id).then((question) => {
                setupQuestion(question, courseId, courseName, moduleId, moduleName, addToHistory);
            }).catch((err) => {
                console.log(err);
            });
        }
    };
}();