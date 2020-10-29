
window.addEventListener("load", function() {
	MathJax.startup.document.getMathItemsWithin(document.body);
  const contentInput = document.getElementById("latex-input");
	const contentLatex = document.getElementById("latex-output");
	const answerRegexText = document.getElementById("question-answer-regex");
	const submitButton = document.getElementById("create-question-button");
	const message = document.getElementById("question-editor-message");

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

		const moduleID = 1;//TODO use correct moduleID
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
