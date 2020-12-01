
(function() {
	const message = document.getElementById("set-username-message");
	const usernameField = document.getElementById("username-field");

	usernameField.placeholder = "Unnamed #" + DbCom.getUserID();

	function showMessage(text, isError) {
		message.textContent = text;
		if(isError) {
			message.className = "error";
		} else {
			message.textContent = "";
			messageBox.show(text);
		}
	}

	const setUsernameButton = document.getElementById("username-button");
	const previousUsernameButtonText = setUsernameButton.textContent;
	setUsernameButton.innerHTML = "<img class=\"loading\" src=\"/src/shared/svg/loading.svg\">";
	setUsernameButton.disabled = true;
	DbCom.getUsername().then((userData) => {
		usernameField.value = userData.username;
	}).finally(() => {
		setUsernameButton.textContent = previousUsernameButtonText;
		setUsernameButton.disabled = false;
		setUsernameButton.addEventListener("click", () => {
			setUsernameButton.innerHTML = "<img class=\"loading\" src=\"/src/shared/svg/loading.svg\">";
			setUsernameButton.disabled = true;
			DbCom.setUsername(usernameField.value).then((result) => {
				showMessage("Username has been set", false);
			}).catch((result) => {
				if(result.hasOwnProperty("error")) {
					showMessage("Error: " + result.error, true);
				}
			}).finally(() => {
				setUsernameButton.textContent = previousUsernameButtonText;
				setUsernameButton.disabled = false;
			});
		});
	});
})();
