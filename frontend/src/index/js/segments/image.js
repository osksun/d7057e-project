
questionViewManager.addSegmentType("IMAGE", function(content) {
	const div = document.createElement("div");
	const img = document.createElement("img");
	img.src = content;
	div.appendChild(img);

	return {
		div:div,
		input:null
	};
});
