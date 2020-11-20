(function(){
	const defaultState = "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";
	let idIncrement = 0;
	questionEditor.addSegmentType("GEOGEBRA", "GeoGebra", function(content = defaultState) {
		const container = document.createElement("div");
		container.className = "geogebra-container";
		const scalingContainer = document.createElement("div");
		scalingContainer.className = "geogebra-scaling-container";
		const div = document.createElement("div");
		div.className = "geogebra-div";
		scalingContainer.appendChild(div);
		container.appendChild(scalingContainer);

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
				"useBrowserForJS": true,
				"allowUpscale": true,
				"scaleContainerClass": "geogebra-scaling-container"
			}, "5.0");
			ggbApp.inject('ggb-element' + idIncrement);
			idIncrement++;
		}
		
		function saveGGBState(){
			return window[ggbID].getBase64();
		}

		return {
			div:container,
			getContent:() => {
				return saveGGBState();
			},
			getAnswer:() => {
				return null;
			}
		};
	});
})();
