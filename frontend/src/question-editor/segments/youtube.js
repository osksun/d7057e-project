
questionEditor.addSegmentType("YOUTUBE", "Youtube embed", function(content = "") {
	const div = document.createElement("div");
	div.className = "youtube";

	const urlWrapper = document.createElement("div");
	const urlTitle = document.createElement("span");
	urlTitle.innerText = "Youtube URL e.g. \"https://www.youtube.com/watch?v=---------\": ";
	urlWrapper.appendChild(urlTitle);
	const urlInput = document.createElement("input");
	urlInput.value = content;
	urlWrapper.appendChild(urlInput);
	div.appendChild(urlWrapper);

	const iframe = document.createElement("iframe");
	iframe.width = 560;
	iframe.height = 315;
	iframe.src = content;
	div.appendChild(iframe);

	urlInput.addEventListener("input", () => {
		iframe.src = urlInput.value;
	});

	return {
		div:div,
		getContent:() => {
			return urlInput.value;
		},
		getAnswer:() => {
			return null;
		}
	};
});

// Converts youtube url timestamps to seconds
function timeStampToSeconds(timeStamp) {
	let number = "";
	let result = 0;
	for (i = 0; i < timeStamp.length; i++) {
		if (!isNaN(parseInt(timeStamp[i]))) {
			number += timeStamp[i];
		}

		else if (timeStamp[i] == 'h') {
			result += parseInt(number) * 3600;
			number = "";
		}

		else if (timeStamp[i] == 'm') {
			result += parseInt(number) * 60;
			number = "";
		}

		else if (timeStamp[i] == 's') {
			result += parseInt(number);
			number = "";
		}
	}
	return result;
}
