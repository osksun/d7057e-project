
questionEditor.addSegmentType("MATHJAX_LATEX", "Mathjax Latex", function(content = "") {
	const div = document.createElement("div");
	div.className = "mathjax-latex";

	const titleDiv = document.createElement("div");
	titleDiv.className = "title";
	titleDiv.innerHTML = "<h2>Code</h2><h2>Preview</h2>";
	div.appendChild(titleDiv);

	const latexInput = document.createElement("textarea");
	latexInput.value = content;
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
	latexInput.addEventListener("keydown", function(event) {
		if(event.keyCode === 27 || event.code == "Escape") {
			latexInput.blur();
		}
	});

	const latexOutput = document.createElement("p");
	div.appendChild(latexOutput);

	function refreshLatex() {
		latexOutput.innerText = latexInput.value;
		//Reset Mathjax
		MathJax.texReset(0);
		MathJax.typesetClear([latexOutput]);
		MathJax.typesetPromise([latexOutput]);
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
			return null;
		}
	};
});
