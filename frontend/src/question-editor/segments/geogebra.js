		function saveGGBState(){
			const saveState = window[ggbID].getBase64();
			return saveState;
		}

		function loadState(){
			const newState = window[ggbID].setBase64(content);
			ggbApp.ggbBase64 = newState;
		}
