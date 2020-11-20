(function(){
	let idIncrement = 0;
	questionEditor.addSegmentType("GEOGEBRA", "GeoGebra", function(content = "") {
		const superDiv = document.createElement("div");
		const div = document.createElement("div");

		superDiv.className = "geogebra-superDiv";
		div.className = "geogebra-div";
		let ggbApp;
		let ggbID;
		setTimeout(createGGBAPP, 0);
		superDiv.appendChild(div);
		function createGGBAPP() {
			div.id = "ggb-element" + idIncrement;
			ggbID = "geogebraApp" + idIncrement;
			ggbApp = new GGBApplet({
				"id": ggbID,
				"appName": "3d",
				"width": 1280,
				"height": 720,
				"ggbBase64": content,
				"showToolBar": true,
				"showAlgebraInput": true,
				"showMenuBar": true,
				"useBrowserForJS": false,
			}, "5.0");
			ggbApp.inject('ggb-element' + idIncrement);
			idIncrement++;
		}
		
		function saveGGBState(){
			window[ggbID].showToolBar(true);
			return window[ggbID].getBase64();
		}

		return {
			div:superDiv,
			getContent:() => {
				return saveGGBState();
			},
			getAnswer:() => {
				return null;
			}
		};
	});
})();
