
const questionList = new function() {
	const questionContainer = document.getElementById("question-list-container");

	this.setup = function(courseName, moduleId, moduleName) {
		questionContainer.innerHTML = "";
		DbCom.getQuestions(moduleId).then((questions) => {
			for (let i = 0; i < questions.length; i++) {
				addQuestionCard(courseName, moduleName, questions[i], i + 1);
			}
		}).catch((err) => {
			viewManager.redirect404();
		}).finally(() => {
			addCreateCard(courseName, moduleName);
		});
	};

	function addQuestionCard(courseName, moduleName, questionId, arrayIndex) {
		const card = document.createElement("button");
		card.classList.add("button");
		card.innerHTML = "<p>Question " + arrayIndex + "</p>";
		card.addEventListener("click", () => {
			//questionViewManager.displayEditQuestion(courseId, courseName, moduleId, moduleName, questionId, true);
			viewManager.loadQuestionView(questionViewManager.containers.EDIT_QUESTION, courseName, moduleName, questionId, true);
			// TODO: Redirect to editor for question with questionId as id
		});
		questionContainer.appendChild(card);
	}

	function addCreateCard(courseName, moduleName) {
		const card = document.createElement("button");
		card.classList.add("create");
		card.classList.add("button");
		const img = document.createElement("img");
		img.src = "/src/index/svg/add.svg";
		img.alt = "add";
		card.appendChild(img);
		card.addEventListener("click", () => {
			viewManager.loadQuestionView(questionViewManager.containers.CREATE_QUESTION, courseName, moduleName, null, true);
		});
		questionContainer.appendChild(card);
	}
}();
