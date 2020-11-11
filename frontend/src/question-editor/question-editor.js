
const questionEditor = new function() {
	const questionSegments = document.getElementById("question-editor-segments");
	const segmentsData = [];

	const addSegmentButtons = document.getElementById("question-editor-add-segment-button-container");
	const submitButton = document.getElementById("question-editor-create-question-button");
	const message = document.getElementById("question-editor-question-editor-message");
	let moduleId = null;

	this.addSegmentType = function(type, name, createCallback) {
		const button = document.createElement("button");
		button.className = "button";
		button.innerText = name + " +";
		addSegmentButtons.appendChild(button);

		button.addEventListener("click", () => {
			const segment = createCallback();
			questionSegments.appendChild(segment.div);
			segment.type = type;
			segmentsData.push(segment);
		});
	};

	this.setup = function(_moduleId) {
		moduleId = _moduleId;
		submitButton.innerHTML = "Create question";
		submitButton.disabled = false;
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
	});
}();
