
const infoBox = new function() {
	const timeoutMap = new Map();

	this.hide = function(div) {
		div.classList.remove("show");
		if(timeoutMap.has(div)) {
			clearTimeout(timeoutMap.get(div));
		}
		timeoutMap.delete(div);
	};

	this.showError = function(div, text) {
		this.show(div, text, "#a93434");
	};
	this.showSuccess = function(div, text) {
		this.show(div, text, "#4da834");
	};

	this.show = function(div, text, color) {
		div.classList.remove("show");
		div.style.backgroundColor = color;

		if(timeoutMap.has(div)) {
			clearTimeout(timeoutMap.get(div));
		}

		const timeout = setTimeout(() => {
			div.textContent = text;
			div.classList.add("show");
			timeoutMap.delete(div);
		}, 50);
		timeoutMap.set(div, timeout);
	};
}();
