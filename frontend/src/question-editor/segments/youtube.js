
questionEditor.addSegmentType("YOUTUBE", "Youtube embed", function(content = "") {
	const div = document.createElement("div");
	div.className = "youtube";

	const urlWrapper = document.createElement("div");
	const urlTitle = document.createElement("span");
	urlTitle.innerText = "Youtube URL e.g. \"https://www.youtube.com/watch?v=---------\": ";
	urlWrapper.appendChild(urlTitle);
	const urlInput = document.createElement("input");
	urlInput.className = "text-box";
	let embedInput = "";
	urlInput.value = content;

	urlWrapper.appendChild(urlInput);
	div.appendChild(urlWrapper);

	const iframe = document.createElement("iframe");
	iframe.width = 560;
	iframe.height = 315;
	iframe.src = content;
	div.appendChild(iframe);

	urlInput.addEventListener("input", () => {
		if (urlInput.value.length >= 17){
			if (urlInput.value.slice(0, 17) == "https://youtu.be/") {
				embedInput = "https://www.youtube.com/embed/" + urlInput.value.slice(17, urlInput.value.length + 1);
				embedInput = embedInput.replace("t=", "start=");
				iframe.src = embedInput;

			} else if (urlInput.value.slice(0, 24) == "https://www.youtube.com/") {
				let idAndTime = urlInput.value.slice(32, urlInput.value.length + 1);
				let split = idAndTime.split("&t=");
				if (split.length != 1) {
					embedInput = "https://www.youtube.com/embed/" + split[0] + "?start=" + timeStampToSeconds(split[1]);
					iframe.src = embedInput;
				}

				else {
					embedInput = urlInput.value;
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

// Converts youtube url timestamps to seconds
function timeStampToSeconds(timeStamp) {
	let number = "";
	let result = 0;
	for (i = 0; i < timeStamp.length; i++) {
		if (!isNaN(parseInt(timeStamp[i]))) {
			number += timeStamp[i];
		} else if (timeStamp[i] == 'h') {
			result += parseInt(number) * 3600;
			number = "";
		} else if (timeStamp[i] == 'm') {
			result += parseInt(number) * 60;
			number = "";
		} else if (timeStamp[i] == 's') {
			result += parseInt(number);
			number = "";
		}
	}
	return result;
}
