window.addEventListener("load", function() {
	MathJax.startup.document.getMathItemsWithin(document.body);
    const contentInput = document.getElementById("latex-input");
	const contentLatex = document.getElementById("latex-output");
	const submitButton = document.getElementById("submit-button");
    contentInput.addEventListener("input", () => {
		contentLatex.innerText = contentInput.value;
		MathJax.texReset(0);
		MathJax.typesetClear();
		MathJax.typesetPromise();
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
});
