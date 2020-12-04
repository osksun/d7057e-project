
questionEditor.addSegmentType("MATHJAX_LATEX_ANSWER_PLAIN_REGEX", "Mathjax Latex Answer (Plain Regex)", function(content = "$x=$", answer = "") {
	const div = document.createElement("div");
	div.className = "mathjax-latex-answer";

	const answerWrapper = document.createElement("div");
	answerWrapper.className = "answer-wrapper";

	const answerTitle = document.createElement("span");
	answerTitle.innerText = "Answer regex:";
	answerWrapper.appendChild(answerTitle);
	
	const answerRegex = document.createElement("input");
	answerRegex.className = "text-box";
	answerRegex.value = answer;
	answerWrapper.appendChild(answerRegex);
	let getAnswerRegex = () => { return answerRegex.value; };
	div.appendChild(answerWrapper);
	
	const regexTester = new RegexTester(getAnswerRegex);
	div.appendChild(regexTester.wrapper);
	
	answerRegex.addEventListener("input", () => {
		regexTester.testRegex();
	});

	regexTester.testRegex();

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
	previewInput.className = "text-box";
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
			return getAnswerRegex();
		}
	};
});
