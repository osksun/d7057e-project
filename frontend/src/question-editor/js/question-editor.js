
window.addEventListener("load", function() {
	MathJax.startup.document.getMathItemsWithin(document.body);
  const contentInput = document.getElementById("latex-input");
	const contentLatex = document.getElementById("latex-output");
	const answerRegexText = document.getElementById("question-answer-regex");
	const submitButton = document.getElementById("create-question-button");
	const message = document.getElementById("question-editor-message");

	const courseName = decodeURIComponent(window.location.pathname.substr(16).split("/")[0]);
	const moduleName = decodeURIComponent(window.location.pathname.substr(16).split("/")[1]);

	let courseID = null;
	let moduleID = null;
	DbCom.getCourseByName(courseName).then((result) => {
		courseID = result.id;
		DbCom.getModuleByName(courseID, moduleName).then((result) => {
			moduleID = result.id;
			submitButton.innerHTML = "<p>Create question</p>";
			submitButton.disabled = false;
		});
	});

	function refreshLatex() {
		contentLatex.innerText = contentInput.value;
		MathJax.texReset(0);
		MathJax.typesetClear();
		MathJax.typesetPromise();
	}

  contentInput.addEventListener("input", () => {
		refreshLatex();
  });
	enableTab(contentInput);
	enableEscape(contentInput);

  function enableTab(textarea) {
  	textarea.addEventListener("keydown", function(e) {
			if (e.keyCode === 9) { // tab was pressed
				// get caret position/selection
				var start = textarea.selectionStart;
				var end = textarea.selectionEnd;
				var value = textarea.value;
				// set textarea value to: text before caret + tab + text after caret
				textarea.value = value.substring(0, start) + "\t" + value.substring(end);
				// put caret at right position again (add one for the tab)
				textarea.selectionStart = textarea.selectionEnd = start + 1;
				// prevent the focus lose
				e.preventDefault();
			}
    });
	}

	function enableEscape(textarea) {
		textarea.addEventListener("keydown", function(e) {
			if (e.keyCode === 27) { // escape was pressed
				submitButton.focus();
			}
		});
	}

	function showMessage(text, isError) {
		message.textContent = text;
		if(isError) {
			message.className = "error";
		} else {
			message.className = "";
		}
	}

	submitButton.addEventListener("click", (event) => {
		submitButton.innerHTML = "<p>. . .</p>";
		submitButton.disabled = true;

		const content = contentInput.value;
		const answer = answerRegexText.value;
		DbCom.createQuestion(moduleID, content, answer).then(() => {
			contentInput.value = "";
			answerRegexText.value = "";
			refreshLatex();
		}).catch((result) => {
			if(result.hasOwnProperty("error")) {
				showMessage("Error: " + result.error, true);
			}
		}).finally(() => {
			submitButton.innerHTML = "<p>Create question</p>";
			submitButton.disabled = false;
		});
	});
});
