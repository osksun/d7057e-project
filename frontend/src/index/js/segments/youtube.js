
questionViewManager.addSegmentType("YOUTUBE", function(content) {
	const div = document.createElement("div");

	const iframe = document.createElement("iframe");
	iframe.width = 640;
	iframe.height = 360;
	iframe.setAttribute("allowfullscreen", "");
	iframe.setAttribute("mozallowfullscreen", ""); 
	iframe.setAttribute("msallowfullscreen", ""); 
	iframe.setAttribute("oallowfullscreen", ""); 
	iframe.setAttribute("webkitallowfullscreen", "");
	iframe.frameBorder = 0;
	div.appendChild(iframe);
	const idExtractRegex = /^(?:http(?:s?):\/\/)?(?:www\.)?(?:youtube(?:-nocookie)?\.com\/(?:(?:v|e(?:mbed)?)\/|.*[?&]v=|[^\/]+\/.+\/)|youtu\.be\/)([0-9A-Za-z-_]{11})(?:.*)$/;
	const startTimeExtractRegex = /(?:(?:\?|#|&)(?:t|start)=)(?:(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s|(\d+)))/;
	const endTimeExtractRegex = /(?:(?:\?|#|&)end=)(\d+)/;
	const idMatch = content.match(idExtractRegex);
	// idMatch => [match, id]
	if (idMatch !== null) {
		let embedProperties = idMatch[1] + "?";
		const startTimeMatch = content.match(startTimeExtractRegex);
		// startTimeMatch => [match, hours, minutes, seconds (=3 when t=...3s), seconds (=3 when t=3)]
		if (startTimeMatch !== null) {
			const startSecond = (+startTimeMatch[1] || 0) * 3600 + // hours
				(+startTimeMatch[2] || 0) * 60 + // minutes
				(+startTimeMatch[3] || 0) + (+startTimeMatch[4] || 0); // seconds
			if (startSecond > 0) {
				embedProperties += "&start=" + startSecond; // Append start time
			}
		}
		const endTimeMatch = content.match(endTimeExtractRegex);
		// endTimeMatch => [match, seconds]
		if (endTimeMatch !== null) {
			const endSecond = (endTimeMatch[1] || 0); 
			if (endSecond > 0) {
				embedProperties += "&end=" + endSecond; // Append end time
			}
		}
		iframe.src = "https://www.youtube.com/embed/" + embedProperties;
	} else {
		iframe.src = "";
	}
	return {
		div:div,
		input:null
	};
});
