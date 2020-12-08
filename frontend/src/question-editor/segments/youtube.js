
questionEditor.addSegmentType("YOUTUBE", "Youtube embed", function(content = "") {
	const div = document.createElement("div");
	div.className = "youtube";

	const urlWrapper = document.createElement("div");
	const urlTitle = document.createElement("span");
	urlTitle.innerText = "Youtube URL: ";
	urlWrapper.appendChild(urlTitle);
	const urlInput = document.createElement("input");
	urlInput.className = "text-box";
	urlInput.placeholder = "https://www.youtube.com/watch?v=abcdefghijk";
	let embedInput = "";
	urlInput.value = content;

	urlWrapper.appendChild(urlInput);
	div.appendChild(urlWrapper);

	const iframe = document.createElement("iframe");
	iframe.width = 640;
	iframe.height = 360;
	iframe.src = content;
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
	urlInput.addEventListener("input", () => {
		const idMatch = urlInput.value.match(idExtractRegex);
		// idMatch => [match, id]
		if (idMatch !== null) {
			let embedProperties = idMatch[1] + "?";
			const startTimeMatch = urlInput.value.match(startTimeExtractRegex);
			// startTimeMatch => [match, hours, minutes, seconds (=3 when t=...3s), seconds (=3 when t=3)]
			if (startTimeMatch !== null) {
				const startSecond = (+startTimeMatch[1] || 0) * 3600 + // hours
					(+startTimeMatch[2] || 0) * 60 + // minutes
					(+startTimeMatch[3] || 0) + (+startTimeMatch[4] || 0); // seconds
				if (startSecond > 0) {
					embedProperties += "&start=" + startSecond; // Append start time
				}
			}
			const endTimeMatch = urlInput.value.match(endTimeExtractRegex);
			// endTimeMatch => [match, seconds]
			if (endTimeMatch !== null) {
				const endSecond = (endTimeMatch[1] || 0); 
				if (endSecond > 0) {
					embedProperties += "&end=" + endSecond; // Append end time
				}
			}
			embedInput = "https://www.youtube.com/embed/" + embedProperties;
		} else {
			embedInput = "";
		}
		iframe.src = embedInput;
	});
	return {
		div:div,
		getContent:() => {
			return embedInput;
		},
		getAnswer:() => {
			return null;
		}
	};
});
