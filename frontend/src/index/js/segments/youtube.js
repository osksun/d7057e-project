
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
	if (content.value.length >= 17) {
		if (content.value.slice(0, 17) == "https://youtu.be/") {
			embedInput = "https://www.youtube.com/embed/" + content.value.slice(17, content.value.length + 1);
			embedInput = embedInput.replace("t=", "start=");
			iframe.src = embedInput;
		} else if (content.value.slice(0, 24) == "https://www.youtube.com/") {
			let idAndTime = content.value.slice(32, content.value.length + 1);
			let split = idAndTime.split("&t=");
			if (split.length != 1) {
				embedInput = "https://www.youtube.com/embed/" + split[0] + "?start=" + timeStampToSeconds(split[1]);
				iframe.src = embedInput;
			} else {
				embedInput = content.value;
				// convert regular url to embedded version
				embedInput =  embedInput.replace("watch?v=", "embed/");
				// convert regular url time stamp to embedded version time stamp
				embedInput = embedInput.replace("&t=", "?start=");
				iframe.src = embedInput;
			}
		} else {
			iframe.src = "";
		}
	}
	return {
		div:div,
		input:null
	};
});
