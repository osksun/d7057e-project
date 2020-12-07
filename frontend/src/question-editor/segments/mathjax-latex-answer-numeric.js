
questionEditor.addSegmentType("MATHJAX_LATEX_ANSWER_NUMERIC", "Mathjax Latex Answer (Numeric)", function(content = "$x=$", answer = "") {
	const div = document.createElement("div");
	div.className = "mathjax-latex-answer";

	const answerWrapper = document.createElement("div");
	answerWrapper.className = "answer-wrapper";

	const numericAnswerTitle = document.createElement("span");
	numericAnswerTitle.innerText = "Numeric answer:";
	answerWrapper.appendChild(numericAnswerTitle);

	const numericAnswer = document.createElement("input");
	numericAnswer.pattern = "^-?(\\d|\\s)*(\\.|,)?(\\d|\\s)*?$";
	numericAnswer.className = "numeric-answer-input text-box";
	if (answer.length !== 0) {
		answer = answer.substring(1, answer.length-1);
		const answerParts = answer.split("(\\.|,)");
		const integerPart = +answerParts[0];
		const decimalPart = +answerParts[1];
		if (answerParts[0] === "0?" && !isNaN(decimalPart)) {
			answer = "0." + decimalPart.toString();
		} else if (!isNaN(integerPart) && answerParts[1] === "?") {
			answer = integerPart.toString();
		} else if (!isNaN(integerPart) && !isNaN(decimalPart)) {
			answer = integerPart.toString() + "." + decimalPart.toString();
		}
	}
	numericAnswer.value = answer;
	answerWrapper.appendChild(numericAnswer);

	function escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}
	
	let getAnswerRegex = () => {
		const correctAnswer = numericAnswer.value.replace(/\s/g, '');
		if (correctAnswer.length === 0) {
			return "^$";
		} else {
			let answerParts;
			if (correctAnswer.includes(".")) {
				answerParts = correctAnswer.split(".");
			} else if (correctAnswer.includes(",")) {
				answerParts = correctAnswer.split(",");
			}
			if (answerParts !== undefined) {
				if (answerParts.length === 2) {
					const integerPart = answerParts[0];
					const decimalPart = answerParts[1];
					if (answerParts[0].length === 0 && !isNaN(decimalPart)) {
						return `^0?(\\.|,)${decimalPart}$`;
					} else if (!isNaN(integerPart) && answerParts[1].length === 0) {
						if (integerPart === 0) return `^0?(\\.|,)?$`;
						return `^${integerPart}(\\.|,)?$`;
					} else if (!isNaN(integerPart) && !isNaN(decimalPart)) {
						if (integerPart === 0) return `^0?(\\.|,)${decimalPart}$`;
						return `^${integerPart}(\\.|,)${decimalPart}$`;
					}
				}
			}
			return `^${escapeRegExp(correctAnswer)}$`;
		}
	};
	div.appendChild(answerWrapper);

	const regexTester = new RegexTester(getAnswerRegex);
	div.appendChild(regexTester.wrapper);

	numericAnswer.addEventListener("input", () => {
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
