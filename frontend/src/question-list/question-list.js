
const questionList = new function() {
	const questionContainer = document.getElementById("question-list-container");

	this.setup = function(moduleId) {
		DbCom.getQuestions(moduleId).then((questions) => {
			for (let i = 0; i < questions.length; i++) {
				createQuestionCard(questions[i]);
			}
		});
	};

	function createQuestionCard(questionId) {
		const card = document.createElement("button");
		card.innerHTML = "<p>Question " + questionId + "</p>";
		card.addEventListener("click", () => {
			// TODO: Redirect to editor for question with questionId as id
		});
		questionContainer.appendChild(card);
	}
}();
