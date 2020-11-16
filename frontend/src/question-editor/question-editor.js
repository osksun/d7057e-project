
const questionEditor = new function() {
	const questionSegments = document.getElementById("question-editor-segments");
	const segmentsData = [];

	const addSegmentButtons = document.getElementById("question-editor-add-segment-button-container");
	const submitButton = document.getElementById("question-editor-create-question-button");
	const message = document.getElementById("question-editor-question-editor-message");
	let moduleId = null;

	const segmentCreateCallbacks = new Map();
	let questionId = null;

	function createSegment(type, content, answer) {
		const createCallback = segmentCreateCallbacks.get(type);
		const segment = createCallback(content, answer);
		questionSegments.appendChild(segment.div);
		segment.type = type;
		segmentsData.push(segment);

		const segmentToolbar = document.createElement("div");
		segmentToolbar.className = "segment-toolbar";
		segment.div.appendChild(segmentToolbar);

		const deleteButton = document.createElement("button");
		deleteButton.className = "button";
		deleteButton.innerHTML = "<img src=\"/src/question-editor/delete.svg\">";
		deleteButton.addEventListener("click", () => {
			for(let i = 0; i < segmentsData.length; ++i) {
				if(segmentsData[i] == segment) {
					segmentsData.splice(i, 1);
					break;
				}
			}
			questionSegments.removeChild(segment.div);
		});
		segmentToolbar.appendChild(deleteButton);
	}

	this.addSegmentType = function(type, name, createCallback) {
		segmentCreateCallbacks.set(type, createCallback);
		const button = document.createElement("button");
		button.className = "button";
		button.innerText = name + " +";
		addSegmentButtons.appendChild(button);
		button.addEventListener("click", () => {
			createSegment(type);
		});
	};

	function clear() {
		questionSegments.innerHTML = "";
		showMessage("");
		segmentsData.length = 0;
		moduleId = null;
		questionId = null;
	}

	this.setup = function(_moduleId) {
		clear();
		moduleId = _moduleId;
		submitButton.innerHTML = "Create question";
		submitButton.disabled = false;
	};

	this.setupEdit = function(_questionId) {
		clear();
		questionId = _questionId;
		DbCom.getQuestionSegments(questionId).then((segments) => {
			for (let i = 0; i < segments.length; i++) {
				createSegment(segments[i].type, segments[i].content, segments[i].answer);
			}
			submitButton.innerHTML = "Update question";
			submitButton.disabled = false;
		}).catch((err) => {
			viewManager.redirect404();
		});
	};

	function showMessage(text, isError) {
		message.textContent = text;
		if(isError) {
			message.className = "error";
		} else {
			message.className = "";
		}
	}

	submitButton.addEventListener("click", (event) => {
		submitButton.innerHTML = ". . .";
		submitButton.disabled = true;

		const types = [];
		const content = [];
		const answers = [];
		for(let i = 0; i < segmentsData.length; ++i) {
			types.push(segmentsData[i].type);
			content.push(segmentsData[i].getContent());
			answers.push(segmentsData[i].getAnswer());
		}

		if (questionId !== null) {
			DbCom.updateQuestion(questionId, types, content, answers).then(() => {
				showMessage("Question updated!");
			}).catch((result) => {
				if(result.hasOwnProperty("error")) {
					showMessage("Error: " + result.error, true);
				}
			}).finally(() => {
				submitButton.innerHTML = "Update question";
				submitButton.disabled = false;
			});
		} else {
			DbCom.createQuestion(moduleId, types, content, answers).then(() => {
				showMessage("Question added!");
			}).catch((result) => {
				if(result.hasOwnProperty("error")) {
					showMessage("Error: " + result.error, true);
				}
			}).finally(() => {
				submitButton.innerHTML = "Create question";
				submitButton.disabled = false;
			});
		}

	});
}();
