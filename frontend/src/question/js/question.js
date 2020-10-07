
window.addEventListener("load",() => {
    const questionID = 1;
    const submitButton = document.getElementById("button-submit");
    submitButton.addEventListener("click", handleSubmit);
    const questionElement = document.getElementById("question")
    const coruseNameElement = document.getElementById("course-name")
    const moduleNameElement = document.getElementById("module-name")
    getQuestion(questionID).then((question) => {
        questionElement.innerText = question.content;
        coruseNameElement.innerText = question.course;
        moduleNameElement.innerText = question.module;
        MathJax.typeset();
    });

    function handleSubmit() {
        const answerInput = document.getElementById("input-answer");
        const loadingIcon = document.getElementById("loading-icon");
        submitButton.style.display = "none";
        loadingIcon.style.display = "inline-block";
        answerQuestion(questionID, answerInput.value).then((result) => {
            if (result.correct) {
                answerInput.style.backgroundColor = "#00ff00";
            } else {
                answerInput.style.backgroundColor = "#ff0000";
            }
            loadingIcon.style.display = "none";
            submitButton.style.display = "inline-block";
            console.log(result);
        });
    }
});