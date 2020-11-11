
const questionViewManager = new function() {
	const questionContainer = document.getElementById("question-container");
	const editorContainer = document.getElementById("question-editor-container");
	const questionListContainer = document.getElementById("question-list-container");
	const submitButton = document.getElementById("submit-button");
	const loadingIcon = document.getElementById("loading-icon");
	const questionSegments = document.getElementById("question-segments");
	const questionButton = document.getElementById("question-button");

	let displayHandler;
	let currentCourseId = null;
	let currentModuleId = null;
	let currentQuestionID = null;
	let segmentInputBoxes = [];

	this.containers = {
		QUESTION: 0,
		EDITOR: 1,
		QUESTION_LIST: 2
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
			currentQuestionID = null;
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
		submitButton.style.display = "none";
		loadingIcon.style.display = "inline-block";

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
			loadingIcon.style.display = "none";
			submitButton.style.display = "inline-block";
		}).catch((error) => {
			if(error) {
				alert("Error: " + error.error);
			} else {
				alert("Error: " + error);
			}
		});
	};

	submitButton.addEventListener("click", (event) => {
		this.handleSubmit(currentQuestionID);
	});

	function submitClick(event) {
		if(event.repeat) return;
		//key 13 is enter
		if(event.keyCode === 13 || event.key === "Enter") {
			event.preventDefault();
			handleSubmit(currentQuestionID);
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
		// Add no questions message
		const div = document.createElement("div");
		div.innerText = "There are no questions in this module";
		questionSegments.appendChild(div);
		// Hide submit button
		submitButton.className = "button hidden";
	};

	const setupQuestionButton = (container, courseId, courseName, moduleId, moduleName) => {
		questionButton.disabled = false;
		questionButton.children[0].innerText = moduleName;
		questionButton.removeEventListener("click", displayHandler);
		displayHandler = this.display.bind(this, container, courseId, courseName, moduleId, moduleName, true);
		questionButton.addEventListener("click", displayHandler);
	};

	this.display = (container, courseId, courseName, moduleId, moduleName, addToHistory) => {
		if (moduleId != currentModuleId) {
			currentQuestionID = null;
		}
		switch (container) {
			case this.containers.QUESTION:
				const displayQuestion = (questionID) => {
					this.clear();
					if(questionID == null) {
						setupEmptyQuestion();
					} else {
						DbCom.getQuestionSegments(questionID).then((segments) => {
							setupQuestion(segments);
						}).catch((err) => {
							console.error(err);
						});
					}
					// Note current course and module ids
					currentCourseId = courseId;
					currentModuleId = moduleId;
					// Setup question button
					setupQuestionButton(container, courseId, courseName, moduleId, moduleName);
					// Setup Page URL, title and history
					viewManager.updatePage("/courses/" + encodeURIComponent(courseName.toLowerCase()) + "/" + encodeURIComponent(moduleName.toLowerCase()), moduleName, addToHistory);
					// Toggle view
					toggleQuestionContainer();
					viewManager.toggleQuestionView();
				};
				if (currentQuestionID === null) {
					// Get all questions of the module
					DbCom.getQuestions(moduleId).then((questions) => {
						if(questions.length == 0) {
							currentQuestionID = null;
							displayQuestion(currentQuestionID);
						} else {
							currentQuestionID = questions[Math.floor(Math.random() * questions.length)];
							displayQuestion(currentQuestionID);
						}
					}).catch((err) => {
						console.log(err);
					});
				} else {
					displayQuestion(currentQuestionID);
				}
				break;
			case this.containers.EDITOR:
				questionEditor.setup(moduleId);
				// Setup question button
				setupQuestionButton(container, courseId, courseName, moduleId, moduleName);
				// Setup Page URL, title and history
				viewManager.updatePage("/createquestion/" + encodeURIComponent(courseName.toLowerCase()) + "/" + encodeURIComponent(moduleName.toLowerCase()), "Create question", addToHistory);
				// Toggle view
				toggleEditorContainer();
				viewManager.toggleQuestionView();
				break;
			case this.containers.QUESTION_LIST:
				DbCom.isModerator(courseId).then((result) => {
					if (result.isModerator === true) {
						questionList.setup(courseName, moduleId, moduleName);
						// Setup question button
						setupQuestionButton(container, courseId, courseName, moduleId, moduleName);
						// Setup Page URL, title and history
						viewManager.updatePage("/questionlist/" + encodeURIComponent(courseName.toLowerCase()) + "/" + encodeURIComponent(moduleName.toLowerCase()), "Question list", addToHistory);
						// Toggle view
						toggleQuestionListContainer();
						viewManager.toggleQuestionView();
					} else {
						document.location.href = "../404:)";
					}
				}).catch((err) => {
					console.log(err);
				});
				break;
		}
	};
}();
