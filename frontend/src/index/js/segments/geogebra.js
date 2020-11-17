(function(){
	let idIncrement = 0;
	questionViewManager.addSegmentType("GEOGEBRA", function(content) {
		const superDiv = document.createElement("div");
		const div = document.createElement("div");
		let ggbApp;
		let ggbID;
		setTimeout(createGGBAPP, 0);
		const defaultStateButton = document.createElement("button");
		defaultStateButton.onclick = function() {loadGGBState();};
		superDiv.appendChild(div);
		superDiv.appendChild(defaultStateButton);
		function createGGBAPP() {
			div.id = "ggb-element" + idIncrement;
			ggbID = "geogebraApp" + idIncrement;
			ggbApp = new GGBApplet({
				"id": ggbID,
				"appName": "3d",
				"width": 800,
				"height": 600,
				"showToolBar": true,
				"showAlgebraInput": true,
				"showMenuBar": true,
				"useBrowserForJS": false,
				"ggbBase64": content
			}, "5.0");
			ggbApp.inject('ggb-element' + idIncrement);
			idIncrement++;
		}

		function loadGGBState(){
			ggbApp.ggbBase64 = window[ggbID].setBase64(content);;
		}
		return {
			div:superDiv,
			input:null
		};
	});
})();