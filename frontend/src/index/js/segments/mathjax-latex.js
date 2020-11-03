
questionViewManager.addSegmentType("MATHJAX_LATEX", function(content) {
	const div = document.createElement("div");
	div.className = "tex2jax_process";
	div.innerText = content;

	return {
		div:div,
		input:null
	};
});
