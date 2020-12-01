
questionViewManager.addSegmentType("MATHJAX_LATEX_ANSWER_NUMERIC", function(content) {
	const div = document.createElement("div");
	div.className = "tex2jax_process";
	div.innerText = content;

	const input = document.createElement("input");
	input.type = "text";
	div.appendChild(input);

	return {
		div:div,
		input:input
	};
});
