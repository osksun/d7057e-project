(function(){
	let idIncrement = 0;
	questionViewManager.addSegmentType("GEOGEBRA", function(content) {
		const container = document.createElement("div");
		container.className = "geogebra-container";
		const scalingContainer = document.createElement("div");
		scalingContainer.className = "geogebra-scaling-container";
		const div = document.createElement("div");
		div.className = "geogebra-div";
		scalingContainer.appendChild(div);
		container.appendChild(scalingContainer);

		const defaultStateButton = document.createElement("button");
		defaultStateButton.innerText = "Revert to default";
		defaultStateButton.classList.add("button");
		defaultStateButton.onclick = function() {loadGGBState();};
		container.appendChild(defaultStateButton);

		let ggbApp;
		let ggbID;
		setTimeout(createGGBAPP, 0);

		function createGGBAPP() {
			div.id = "ggb-element" + idIncrement;
			ggbID = "geogebraApp" + idIncrement;
			ggbApp = new GGBApplet({
				"id": ggbID,
				"appName": "classic",
				"width": 1280,
				"height": 720,
				"ggbBase64": content,
				"showToolBar": true,
				"showMenuBar": true,
				"showResetIcon": true,
				"showAlgebraInput": true,
				"useBrowserForJS": true,
				"allowUpscale": true,
				"scaleContainerClass": "geogebra-scaling-container"
			}, "5.0");
			ggbApp.inject('ggb-element' + idIncrement);
			idIncrement++;
		}

		function loadGGBState(){
			ggbApp.ggbBase64 = window[ggbID].setBase64(content);;
		}
		return {
			div:container,
			input:null
		};
	});
})();
