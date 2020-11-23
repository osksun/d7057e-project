
const messageBox = new function() {
	const div = document.getElementById("message-box");
	let timeout = null;

	this.show = function(text) {
		div.className = "";

		if(timeout != null) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			div.textContent = text;
			div.className = "show";
			timeout = null;
		}, 50);
	};
}();
