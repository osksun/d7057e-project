
questionEditor.addSegmentType("MATHJAX_LATEX_ANSWER", "Mathjax Latex Answer", function(content = "$x=$", answer = "") {
	const div = document.createElement("div");
	div.className = "mathjax-latex-answer";

	const answerWrapper = document.createElement("div");
	answerWrapper.className = "answer-wrapper";

	function testRegex(answer, regex) {
		const regExp = new RegExp(regex);
		setRegexTest(regExp.test(answer));
	}

	function setRegexTest(isMatching) {
		if (isMatching) {
			answerRegexTestInput.className = "match";
			answerRegexTestMessage.innerText = "Answer is matching";
		} else {
			answerRegexTestInput.className = "no-match";
			answerRegexTestMessage.innerText = "Answer is not matching";
		}
	}
	
	const answerTitle = document.createElement("span");
	answerTitle.innerText = "Answer regex:";
	answerWrapper.appendChild(answerTitle);
	const answerRegex = document.createElement("input");
	answerRegex.value = answer;
	answerRegex.addEventListener("input", () => {
		testRegex(answerRegexTestInput.value, answerRegex.value);
	});
	answerWrapper.appendChild(answerRegex);

	const answerTestTitle = document.createElement("span");
	answerTestTitle.innerText = "Test regex:";
	answerWrapper.appendChild(answerTestTitle);
	const answerRegexTestInput = document.createElement("input");
	answerRegexTestInput.addEventListener("input", () => {
		testRegex(answerRegexTestInput.value, answerRegex.value);
	});
	answerWrapper.appendChild(answerRegexTestInput);
	const answerRegexTestMessage = document.createElement("span");
	answerRegexTestMessage.className = "test-message";
	answerWrapper.appendChild(answerRegexTestMessage);

	testRegex(answerRegexTestInput.value, answerRegex.value);

	div.appendChild(answerWrapper);

	const titleDiv = document.createElement("div");
	titleDiv.className = "title";
	titleDiv.innerHTML = "<h2>Code</h2><h2>Preview</h2>";
	div.appendChild(titleDiv);

	const latexInput = document.createElement("textarea");
	latexInput.value = content;
	latexInput.className = "latex";
	div.appendChild(latexInput);

	latexInput.addEventListener("keydown", function(event) {
		if(event.keyCode === 9 || event.code == "Tab") {
			// get caret position/selection
			var start = latexInput.selectionStart;
			var end = latexInput.selectionEnd;
			var value = latexInput.value;
			// set textarea value to: text before caret + tab + text after caret
			latexInput.value = value.substring(0, start) + "\t" + value.substring(end);
			// put caret at right position again (add one for the tab)
			latexInput.selectionStart = latexInput.selectionEnd = start + 1;
			// prevent the focus lose
			event.preventDefault();
		}
	});
	latexInput.addEventListener("keydown", function(e) {
		if(e.keyCode === 27 || event.code == "Escape") {
			latexInput.blur();
		}
	});

	const preview = document.createElement("div");
	preview.className = "latex";
	const previewSpan = document.createElement("span");
	preview.appendChild(previewSpan);
	const previewInput = document.createElement("input");
	preview.appendChild(previewInput);
	div.appendChild(preview);

	
	function refreshLatex() {
		previewSpan.innerText = latexInput.value;

		//Reset Mathjax
		MathJax.texReset(0);
		MathJax.typesetClear([previewSpan]);
		MathJax.typesetPromise([previewSpan]);
	}

	latexInput.addEventListener("input", () => {
		refreshLatex();
	});
	refreshLatex();

	return {
		div:div,
		getContent:() => {
			return latexInput.value;
		},
		getAnswer:() => {
			return answerRegex.value;
		}
	};
});
