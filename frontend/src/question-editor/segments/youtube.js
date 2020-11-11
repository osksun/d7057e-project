
questionEditor.addSegmentType("YOUTUBE", "Youtube embed", function(content = "") {
	const div = document.createElement("div");
	div.className = "youtube";

	const urlWrapper = document.createElement("div");
	const urlTitle = document.createElement("span");
	urlTitle.innerText = "Youtube embed URL: ";
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
