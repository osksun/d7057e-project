
const questionEditor = new function() {
	const questionSegments = document.getElementById("question-editor-segments");
	const segmentsData = [];

	const addSegmentButtons = document.getElementById("question-editor-add-segment-button-container");
	const submitButton = document.getElementById("question-editor-create-question-button");
	const message = document.getElementById("question-editor-question-editor-message");
	const deleteButton = document.getElementById("question-editor-delete-button");

	let courseId = null;
	let courseName = null;
	let moduleId = null;
	let moduleName = null;
	let questionId = null;

	const segmentCreateCallbacks = new Map();

	deleteButton.addEventListener("click", () => {
		const previousText = deleteButton.textContent;
		deleteButton.innerHTML = "<img class=\"loading\" src=\"/src/shared/svg/loading.svg\">";
		deleteButton.disabled = true;
		messageBox.showConfirm("Are you sure you want to delete this question?", () => {
			deleteButton.textContent = previousText;
			deleteButton.disabled = false;
		}, () => {
			DbCom.deleteQuestion(questionId).then(() => {
				questionViewManager.displayQuestionList(courseId, courseName, moduleId, moduleName, true);
				clear();
			}).catch((result) => {
				if(result.hasOwnProperty("error")) {
					showMessage("Error: " + result.error, true);
				}
			}).finally(() => {
				deleteButton.textContent = previousText;
				deleteButton.disabled = false;
			});
		});
	});

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
			messageBox.showConfirm("Are you sure you want to delete this segment?", () => {
				//Do nothing
			}, () => {
				for(let i = 0; i < segmentsData.length; ++i) {
					if(segmentsData[i] == segment) {
						segmentsData.splice(i, 1);
						break;
					}
				}
				questionSegments.removeChild(segment.div);
			});
		});
		segmentToolbar.appendChild(deleteButton);

		const downButton = document.createElement("button");
		downButton.className = "button";
		downButton.innerHTML = "<img src=\"/src/question-editor/arrow_down.svg\">";
		downButton.addEventListener("click", () => {
			let segmentIndex = null;
			for(let i = 0; i < segmentsData.length; ++i) {
				if(segmentsData[i] == segment) {
					segmentIndex = i;
					segmentsData.splice(i, 1);
					break;
				}
			}
			questionSegments.removeChild(segment.div);

			if(segmentIndex != segmentsData.length) {
				++segmentIndex;
			}

			if(segmentIndex == segmentsData.length) {
				questionSegments.appendChild(segment.div);
			} else {
				questionSegments.insertBefore(segment.div, segmentsData[segmentIndex].div);
			}
			segmentsData.splice(segmentIndex, 0, segment);
		});
		segmentToolbar.appendChild(downButton);

		const upButton = document.createElement("button");
		upButton.className = "button";
		upButton.innerHTML = "<img src=\"/src/question-editor/arrow_up.svg\">";
		upButton.addEventListener("click", () => {
			let segmentIndex = null;
			for(let i = 0; i < segmentsData.length; ++i) {
				if(segmentsData[i] == segment) {
					segmentIndex = i;
					segmentsData.splice(i, 1);
					break;
				}
			}
			questionSegments.removeChild(segment.div);

			if(segmentIndex != 0) {
				--segmentIndex;
			}

			if(segmentIndex == segmentsData.length) {
				questionSegments.appendChild(segment.div);
			} else {
				questionSegments.insertBefore(segment.div, segmentsData[segmentIndex].div);
			}
			segmentsData.splice(segmentIndex, 0, segment);
		});
		segmentToolbar.appendChild(upButton);
	}

	this.addSegmentType = function(type, name, createCallback) {
		segmentCreateCallbacks.set(type, createCallback);
		const button = document.createElement("button");
		button.className = "button";
		button.innerText = name + " +";
		addSegmentButtons.appendChild(button);
		button.addEventListener("click", () => {
			if(segmentsData.length == 64) {
				messageBox.show("Too many question segments");
			} else {
				createSegment(type);
			}
		});
	};

	function clear() {
		questionSegments.innerHTML = "";
		showMessage("");
		segmentsData.length = 0;
		courseId = null;
		courseName = null;
		moduleId = null;
		moduleName = null;
		questionId = null;
		deleteButton.className = "button hidden";
	}

	this.setup = function(_courseId, _courseName, _moduleId, _moduleName) {
		clear();
		courseId = _courseId;
		courseName = _courseName;
		moduleId = _moduleId;
		moduleName = _moduleName;
		questionId = null;
		submitButton.innerHTML = "Create question";
		submitButton.disabled = false;
	};

	this.setupEdit = function(_courseId, _courseName, _moduleId, _moduleName, _questionId) {
		clear();
		courseId = _courseId;
		courseName = _courseName;
		moduleId = _moduleId;
		moduleName = _moduleName;
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
		deleteButton.className = "button";
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
		submitButton.innerHTML = "<img class=\"loading\" src=\"/src/shared/svg/loading.svg\">";
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
				questionViewManager.displayQuestionList(courseId, courseName, moduleId, moduleName, true);
				clear();
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
