
questionEditor.addSegmentType("IMAGE", "Image", function() {
	const div = document.createElement("div");
	div.className = "image";

	const urlWrapper = document.createElement("div");
	const urlTitle = document.createElement("span");
	urlTitle.innerText = "Image URL: ";
	urlWrapper.appendChild(urlTitle);
	const urlInput = document.createElement("input");
	urlWrapper.appendChild(urlInput);
	div.appendChild(urlWrapper);

	const img = document.createElement("img");
	div.appendChild(img);

	urlInput.addEventListener("input", () => {
		img.src = urlInput.value;
	});

	return {
		div:div,
		getContent:() => {
			return urlInput.value
		},
		getAnswer:() => {
			return null
		}
	};
});
