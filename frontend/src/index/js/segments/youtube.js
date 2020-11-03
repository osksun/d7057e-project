
questionViewManager.addSegmentType("YOUTUBE", function(content) {
	const div = document.createElement("div");

	const iframe = document.createElement("iframe");
	iframe.width = 560;
	iframe.height = 315;
	iframe.src = content;
	iframe.frameBorder = 0;
	div.appendChild(iframe);

	return {
		div:div,
		input:null
	};
});
