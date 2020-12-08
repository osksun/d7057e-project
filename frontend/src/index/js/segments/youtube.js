
questionViewManager.addSegmentType("YOUTUBE", function(content) {
	const div = document.createElement("div");

	const iframe = document.createElement("iframe");
	iframe.width = 560;
	iframe.height = 315;
	iframe.src = content;
	iframe.setAttribute("allowfullscreen", "");
	iframe.setAttribute("mozallowfullscreen", ""); 
	iframe.setAttribute("msallowfullscreen", ""); 
	iframe.setAttribute("oallowfullscreen", ""); 
	iframe.setAttribute("webkitallowfullscreen", "");
	iframe.frameBorder = 0;
	div.appendChild(iframe);

	return {
		div:div,
		input:null
	};
});
