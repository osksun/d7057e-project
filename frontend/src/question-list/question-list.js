
const questionList = new function() {
	const questionContainer = document.getElementById("question-list-container");

	this.setup = function(courseName, moduleId, moduleName) {
		questionContainer.innerHTML = "";
		DbCom.getQuestions(moduleId).then((questions) => {
			for (let i = 0; i < questions.length; i++) {
				addQuestionCard(questions[i], i);
			}
		}).catch((err) => {
			console.log(err);
		}).finally(() => {
			addCreateCard(courseName, moduleName);
		});
	};

	function addQuestionCard(arrayIndex) {
		const card = document.createElement("button");
		card.classList.add("button");
		card.innerHTML = "<p>Question " + arrayIndex + "</p>";
		card.addEventListener("click", () => {
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
			viewManager.loadQuestionView(questionViewManager.containers.EDITOR, courseName, moduleName, true);
		});
		questionContainer.appendChild(card);
	}
}();
