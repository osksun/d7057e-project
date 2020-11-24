
const messageBox = new function() {
	let div = null;
	let callbackFunction = null;
	let timeout = null;

	this.show = function(text, callback = null) {
		this.hide();
		callbackFunction = callback;

		div = document.createElement("div");
		div.className = "message-box";

		const box = document.createElement("div");
		box.textContent = text;
		div.appendChild(box);

		if(timeout != null) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			box.className = "show";
			timeout = null;
		}, 50);

		const button = document.createElement("button");
		button.className = "button";
		button.textContent = "Ok";
		button.addEventListener("click", () => {
			this.hide();
			if(callbackFunction != null) {
				callbackFunction();
			}
		});
		box.appendChild(button);

		document.body.appendChild(div);

		window.blur();
		window.addEventListener("keydown", (event) => {
			if(div != null) {
				if(event.keycode == 9 || event.code == "Tab") {
					button.focus();
					event.preventDefault();
				}
			}
		});
	};

	this.hide = function() {
		if(div != null) {
			document.body.removeChild(div);
			div = null;
		}
	};

	window.addEventListener("keydown", (event) => {
		if(event.keycode == 27 || event.code == "Escape") {
			this.hide();
			if(callbackFunction != null) {
				callbackFunction();
			}
		}

		if(event.keycode == 13 || event.code == "Enter") {
			this.hide();
			if(callbackFunction != null) {
				callbackFunction();
			}
		}
	});
}();
