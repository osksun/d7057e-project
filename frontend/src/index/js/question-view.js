
const questionViewManager = new function() {
	const questionContainer = document.getElementById("question-container");
	const editorContainer = document.getElementById("question-editor-container");
	const submitButton = document.getElementById("submit-button");
	const answerInput = document.getElementById("answer-input");
	const loadingIcon = document.getElementById("loading-icon");
	const questionSegments = document.getElementById("question-segments");
	const questionButton = document.getElementById("question-button");

	let submitHandler;
	let displayHandler;
	let currentCourseId = null;
	let currentModuleId = null;
	let currentQuestionID = null;
	let segmentInputBoxes = [];

	this.containers = {
		QUESTION: 0,
		EDITOR: 1
	};

	function toggleEditorContainer() {
		questionContainer.classList.remove("visible");
		editorContainer.classList.add("visible");
	}

	function toggleQuestionContainer() {
		editorContainer.classList.remove("visible");
		questionContainer.classList.add("visible");
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

	const setupQuestion = (segments, courseId, courseName, moduleId, moduleName, addToHistory) => {
		this.clear();
		// Update the page with the content of the question
		for(let i = 0; i < segments.length; ++i) {
			const segment = segments[i];
			if(segmentTypes.has(segment.type)) {
				const result = segmentTypes.get(segment.type)(segment.content);
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
		MathJax.typesetClear();
		MathJax.typesetPromise();
		// Note current course and module ids
		currentCourseId = courseId;
		currentModuleId = moduleId;
		// Setup Page URL, title and history
		viewManager.updatePage("/courses/" + encodeURIComponent(courseName.toLowerCase()) + "/" + encodeURIComponent(moduleName.toLowerCase()), moduleName, addToHistory);
		// Setup question button
		questionButton.disabled = false;
		questionButton.children[0].innerText = moduleName;
		questionButton.removeEventListener("click", displayHandler);
		displayHandler = this.display.bind(this, this.containers.QUESTION, courseId, courseName, moduleId, moduleName);
		questionButton.addEventListener("click", displayHandler);
	
		//Show submit button
		submitButton.className = "";

		toggleQuestionContainer();
		// Toggle view
		viewManager.toggleQuestionView();
	};

	const setupEmptyQuestion = (courseId, courseName, moduleId, moduleName, addToHistory) => {
		this.clear();

		//Add no questions message
		const div = document.createElement("div");
		div.innerText = "There are no questions in this module";
		questionSegments.appendChild(div);

		//Reset Mathjax
		MathJax.texReset(0);
		MathJax.typesetClear();
		MathJax.typesetPromise();

		// Note current course and module ids
		currentCourseId = courseId;
		currentModuleId = moduleId;

		// Setup Page URL, title and history
		viewManager.updatePage("/courses/" + encodeURIComponent(courseName.toLowerCase()) + "/" + encodeURIComponent(moduleName.toLowerCase()), moduleName, addToHistory);

		// Setup question button
		questionButton.disabled = false;
		questionButton.children[0].innerText = moduleName;
		questionButton.removeEventListener("click", displayHandler);
		displayHandler = this.display.bind(this, this.containers.QUESTION, courseId, courseName, moduleId, moduleName);
		questionButton.addEventListener("click", displayHandler);

		//Hide submit button
		submitButton.className = "hidden";

		toggleQuestionContainer();
		// Toggle view
		viewManager.toggleQuestionView();
	};

	this.display = (containers, courseId, courseName, moduleId, moduleName, addToHistory) => {
		if (moduleId != currentModuleId) {
			currentQuestionID = null;
		}
		switch (containers) {
			case this.containers.QUESTION:
				function displayQuestion(questionID) {
					if(questionID == null) {
						setupEmptyQuestion(courseId, courseName, moduleId, moduleName, addToHistory);
					} else {
						DbCom.getQuestionSegments(questionID).then((segments) => {
							setupQuestion(segments, courseId, courseName, moduleId, moduleName, addToHistory);
						}).catch((err) => {
							console.error(err);
						});
					}
				}
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
				toggleEditorContainer();
				viewManager.toggleQuestionView();
				break;
		}
	};
}();
