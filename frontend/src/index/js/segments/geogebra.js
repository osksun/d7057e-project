(function(){
	let idIncrement = 0;
	questionViewManager.addSegmentType("GEOGEBRA", function(content) {
		const superDiv = document.createElement("div");
		const div = document.createElement("div");
		const defaultStateButton = document.createElement("button");
		defaultStateButton.onclick = function() {loadState()};
		superDiv.appendChild(div);
		superDiv.appendChild(defaultStateButton);
		div.id = "ggb-viewElement" + idIncrement;
		let ggbApp;
		let ggbID;
		setTimeout(createGGBAPP, 0);
		function createGGBAPP() {
			ggbID = "geogebraApp" + idIncrement;
			ggbApp = new GGBApplet({
				"id": ggbID,
				"appName": "3d",
				"width": 800,
				"height": 600,
				"showToolBar": true,
				"showAlgebraInput": true,
				"showMenuBar": true,
				"useBrowserForJS":false,
				"ggbBase64": content
			}, "5.0");
			ggbApp.inject('ggb-viewElement' + idIncrement);
			idIncrement++;
		}

		function loadState(){
			const newState = window[ggbID].setBase64(content);
			ggbApp.ggbBase64 = newState;
		}
		return {
			div:superDiv,
			input:null
		};
	});
})();