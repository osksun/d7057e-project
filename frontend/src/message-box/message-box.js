
const messageBox = new function() {
	let div = null;
	let callbacks = [];
	let escapeCallback = null;
	let enterCallback = null;
	let timeout = null;

	const show = (text, buttonTexts, buttonCallbacks, escapeCallbackFunction, enterCallbackFunction) => {
		this.hide();
		callbacks = buttonCallbacks;
		enterCallback = enterCallbackFunction;
		escapeCallback = escapeCallbackFunction;

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

		if(buttonTexts.length != buttonCallbacks.length) {
			throw "Button texts length is not equal to button callbacks length";
		}

		for(let i = 0; i < buttonTexts.length; ++i) {
			const button = document.createElement("button");
			button.className = "button";
			button.textContent = buttonTexts[i];
			button.addEventListener("click", () => {
				buttonCallbacks[i]();
				this.hide();
			});
			box.appendChild(button);
		}

		document.body.appendChild(div);

		if(document.activeElement != null) {
			document.activeElement.blur();
		}
	};

	//Tab only between message box buttons
	window.addEventListener("keydown", (event) => {
		if(div != null) {
			if(event.keycode == 9 || event.code == "Tab") {
				let currentIndex = null;
				for(let i = 0; i < div.children[0].children.length; ++i) {
					if(document.activeElement == div.children[0].children[i]) {
						currentIndex = i;
					}
				}

				if(currentIndex == null) {
					div.children[0].children[0].focus();
				} else {
					++currentIndex;
					if(currentIndex == div.children[0].children.length) {
						currentIndex = 0;
					}
					div.children[0].children[currentIndex].focus();
				}
				event.preventDefault();
			}
		}
	});

	this.show = function(text, buttonCallback = () => {}) {
		show(text, ["Ok"], [buttonCallback], buttonCallback, buttonCallback);
	};

	this.showConfirm = function(text, cancelCallback = () => {}, confirmCallback = () => {}) {
		show(text, ["Confirm", "Cancel"], [confirmCallback, cancelCallback], cancelCallback, confirmCallback);
	};

	this.hide = function() {
		if(div != null) {
			document.body.removeChild(div);
			div = null;
		}

		if(timeout != null) {
			clearTimeout(timeout);
		}

		callbacks.length = 0;
		escapeCallback = null;
		enterCallback = null;
	};

	window.addEventListener("keydown", (event) => {
		if(event.keycode == 27 || event.code == "Escape") {
			if(escapeCallback != null) {
				escapeCallback();
			}
			this.hide();
			event.preventDefault();
		}

		if(event.keycode == 13 || event.code == "Enter") {
			if(enterCallback != null) {
				enterCallback();
			}
			this.hide();
		}
	});
}();
