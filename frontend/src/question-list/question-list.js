
const questionList = new function() {
	const questionContainer = document.getElementById("question-list-container");

	this.setup = function(courseName, moduleId, moduleName) {
		questionContainer.textContent = "";
		DbCom.getQuestions(moduleId).then((questions) => {
			for (let i = 0; i < questions.length; i++) {
				addQuestionCard(courseName, moduleName, questions[i], i + 1);
			}

			if(questions.length < 256) {
				addCreateCard(courseName, moduleName);
			}
		}).catch((err) => {
			viewManager.redirect404();
		});
	};

	function addQuestionCard(courseName, moduleName, questionId, arrayIndex) {
		const card = document.createElement("button");
		card.classList.add("button");
		card.innerHTML = "<p>Question " + arrayIndex + "</p>";
		card.addEventListener("click", () => {
			const previousText = card.textContent;
			card.innerHTML = "<img class=\"loading\" src=\"/src/shared/svg/loading.svg\">";
			card.disabled = true;
			viewManager.loadQuestionView(questionViewManager.containers.EDIT_QUESTION, courseName, moduleName, questionId, true).finally(() => {
				card.textContent = previousText;
				card.disabled = false;
			});
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
			const previousText = card.textContent;
			card.innerHTML = "<img class=\"loading\" src=\"/src/shared/svg/loading.svg\">";
			card.disabled = true;
			viewManager.loadQuestionView(questionViewManager.containers.CREATE_QUESTION, courseName, moduleName, null, true).finally(() => {
				card.textContent = previousText;
				card.disabled = false;
			});
		});
		questionContainer.appendChild(card);
	}
}();
