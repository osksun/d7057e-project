
const questionViewManager = new function() {
	const questionContainer = document.getElementById("question-container");
	const editorContainer = document.getElementById("question-editor-container");
	const questionListContainer = document.getElementById("question-list-container");
	const submitButton = document.getElementById("submit-button");
	const loadingIcon = document.getElementById("loading-icon");
	const questionSegments = document.getElementById("question-segments");
	const questionButton = document.getElementById("question-button");

	let currentCourseId = null;
	let currentModuleId = null;
	let currentQuestion = null;
	let segmentInputBoxes = [];
	let displayHandler = () => {};

	submitButton.addEventListener("click", (event) => {
		this.handleSubmit(currentQuestion.id);
	});

	questionButton.addEventListener("click", () => {
		displayHandler();
	});

	this.containers = {
		QUESTION: 0,
		EDIT_QUESTION: 1,
		CREATE_QUESTION: 3,
		QUESTION_LIST: 4
	};

	function toggleEditorContainer() {
		questionListContainer.classList.remove("visible");
		questionContainer.classList.remove("visible");
		editorContainer.classList.add("visible");
	}

	function toggleQuestionContainer() {
		editorContainer.classList.remove("visible");
		questionListContainer.classList.remove("visible");
		questionContainer.classList.add("visible");
	}

	function toggleQuestionListContainer() {
		questionContainer.classList.remove("visible");
		editorContainer.classList.remove("visible");
		questionListContainer.classList.add("visible");
	}

	const segmentTypes = new Map();
	this.addSegmentType = function(type, creationFunction) {
		segmentTypes.set(type, creationFunction);
	};

	this.updateButton = function(courseId) {
		if (courseId !== currentCourseId) {
			this.clear();
			currentQuestion = null;
		}
	};

	this.clear = function() {
		document.getElementById("course-name").innerText = "";
		document.getElementById("module-name").innerText = "";
		questionSegments.innerText = "";
		segmentInputBoxes.length = 0;
		document.getElementById("question-button").disabled = true;
		questionButton.children[0].innerText = "Question";
		currentCourseId = null;
	};

	this.handleSubmit = function(questionID) {
		submitButton.classList.add("hidden");
		loadingIcon.classList.remove("hidden");

		const answers = [];
		for(let i = 0; i < segmentInputBoxes.length; ++i) {
			const input = segmentInputBoxes[i];
			if(input == null) {
				answers.push(null);
			} else {
				answers.push(input.value);
			}
		}

		DbCom.answerQuestion(questionID, answers).then((result) => {
			if (result.correct) {
				alert("Correct");
				displayLevel.updateXp();
			} else {
				alert("Wrong");
			}
			loadingIcon.classList.add("hidden");
			submitButton.classList.remove("hidden");
		}).catch((error) => {
			if(error) {
				alert("Error: " + error.error);
			} else {
				alert("Error: " + error);
			}
		});
	};

	function submitClick(event) {
		if(event.repeat) return;
		//key 13 is enter
		if(event.keyCode === 13 || event.key === "Enter") {
			event.preventDefault();
			handleSubmit(currentQuestion.id);
		}
	}

	const setupQuestion = (segments) => {
		// Update the page with the content of the question
		for(let i = 0; i < segments.length; ++i) {
			const segment = segments[i];
			if(segmentTypes.has(segment.type)) {
				const result = segmentTypes.get(segment.type)(segment.content);
				if(result.input != null) {
					result.input.addEventListener('keydown', submitClick);
				}
				questionSegments.appendChild(result.div);
				segmentInputBoxes.push(result.input);
			} else {
				const div = document.createElement("div");
				div.innerText = "Error: Unknown segment! Content: " + segment.content;
				questionSegments.appendChild(div);
				segmentInputBoxes.push(null);
			}
		}

		//Reset Mathjax
		MathJax.texReset(0);
		const mathJaxElements = questionSegments.getElementsByClassName("tex2jax_process");
		MathJax.typesetClear(mathJaxElements);
		MathJax.typesetPromise(mathJaxElements);
		// Show submit button
		submitButton.className = "button";
	};

	const setupEmptyQuestion = () => {
		// Add no segments message
		const div = document.createElement("div");
		div.innerText = "There are no segments in this question";
		questionSegments.appendChild(div);
		// Hide submit button
		submitButton.className = "button hidden";
	};

	const setupNoUnansweredQuestions = () => {
		// Add no questions message
		const div = document.createElement("div");
		div.className = "questions-complete";
		questionSegments.appendChild(div);

		const img = document.createElement("img");
		img.src = "/src/index/svg/complete.svg";
		div.appendChild(img);

		const h2 = document.createElement("h2");
		h2.textContent = "Congratulations you have completed this module!";
		div.appendChild(h2);

		// Hide submit button
		submitButton.className = "button hidden";
	};

	const setupQuestionButton = (moduleName, displayHandlerCallback) => {
		questionButton.disabled = false;
		questionButton.children[0].innerText = moduleName;
		displayHandler = displayHandlerCallback;
	};

	this.disableButton = function() {
		questionButton.disabled = true;
		questionButton.children[0].innerText = "Question";
		displayHandler = () => {};
	};

	this.displayQuestion = (courseId, courseName, moduleId, moduleName, addToHistory) => {
		const showQuestion = () => {
			// Note current course and module ids
			currentCourseId = courseId;
			currentModuleId = moduleId;
			// Setup question button
			setupQuestionButton(moduleName, () => {
				this.displayQuestion(courseId, courseName, moduleId, moduleName, true);
			});
			// Setup Page URL, title and history
			viewManager.updatePage("/courses/" + encodeURIComponent(courseName.toLowerCase()) + "/" + encodeURIComponent(moduleName.toLowerCase()), moduleName, addToHistory);
			// Toggle view
			toggleQuestionContainer();
			viewManager.toggleQuestionView();
		};
		if (moduleId != currentModuleId) {
			currentQuestion = null;
		}
		if (currentQuestion === null) {
			this.clear();
			// Get all questions of the module
			DbCom.getRandomUnansweredQuestion(moduleId).then((question) => {
				currentQuestion = question;
				if(question.segments.length === 0) {
					setupEmptyQuestion();
				} else {
					setupQuestion(question.segments);
				}
				showQuestion();
			}).catch((error) => {
				switch (error.errorCode) {
					case backendErrorCode.noUnansweredQuestions:
						setupNoUnansweredQuestions();
						showQuestion();
						break;
					default:
						viewManager.redirect404();
						break;
				}
			});
		} else {
			showQuestion();
		}
	};

	this.displayEditQuestion = (courseId, courseName, moduleId, moduleName, questionId, addToHistory) => {
		questionEditor.setupEdit(courseId, courseName, moduleId, moduleName, questionId);
		// Setup question button
		setupQuestionButton(moduleName, () => {
			this.displayEditQuestion(courseId, courseName, moduleId, moduleName, questionId, true);
		});
		// Setup Page URL, title and history
		viewManager.updatePage("/editquestion/" + encodeURIComponent(courseName.toLowerCase()) + "/" + encodeURIComponent(moduleName.toLowerCase()) + "/" + questionId, "Edit question", addToHistory);
		// Toggle view
		toggleEditorContainer();
		viewManager.toggleQuestionView();
	};

	this.displayCreateQuestion = (courseId, courseName, moduleId, moduleName, addToHistory) => {
		questionEditor.setup(courseId, courseName, moduleId, moduleName);
		// Setup question button
		setupQuestionButton(moduleName, () => {
			this.displayCreateQuestion(courseId, courseName, moduleId, moduleName, true);
		});
		// Setup Page URL, title and history
		viewManager.updatePage("/createquestion/" + encodeURIComponent(courseName.toLowerCase()) + "/" + encodeURIComponent(moduleName.toLowerCase()), "Create question", addToHistory);
		// Toggle view
		toggleEditorContainer();
		viewManager.toggleQuestionView();
	};

	this.displayQuestionList = (courseId, courseName, moduleId, moduleName, addToHistory) => {
		DbCom.isModerator(courseId).then((result) => {
			if (result.isModerator === true) {
				questionList.setup(courseName, moduleId, moduleName);
				// Setup question button
				setupQuestionButton(moduleName, () => {
					this.displayQuestionList(courseId, courseName, moduleId, moduleName, true);
				});
				// Setup Page URL, title and history
				viewManager.updatePage("/questionlist/" + encodeURIComponent(courseName.toLowerCase()) + "/" + encodeURIComponent(moduleName.toLowerCase()), "Question list", addToHistory);
				// Toggle view
				toggleQuestionListContainer();
				viewManager.toggleQuestionView();
			} else {
				viewManager.redirect404();
			}
		}).catch((err) => {
			viewManager.redirect404();
		});
	};
}();
