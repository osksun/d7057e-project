
(function() {
	const registerButton = document.getElementById("registerButton");
	const emailField = document.getElementById("emailField");
	const passwordField = document.getElementById("passwordField");
	const repeatPasswordField = document.getElementById("repeatPasswordField");

	registerButton.addEventListener("click", () => {
		if(emailField.reportValidity() && passwordField.reportValidity() && repeatPasswordField.reportValidity()) {
			const email = emailField.value;
			const password = passwordField.value;
			const passwordRepeat = repeatPasswordField.value;

			if(email == "" || password == "" || passwordRepeat == "") {
				errorBox.show("Fill in all the required fields");
			} else {
				if(password != passwordRepeat) {
					errorBox.show("Passwords do not match!");
				} else {
					const previousText = registerButton.textContent;
					registerButton.innerHTML = "<img class=\"loading\" src=\"/src/shared/svg/loading.svg\">";
					registerButton.disabled = true;

					DbCom.registerUser(email, password).then((result) => {
						localStorage.setItem("login_data", JSON.stringify({
							"userID":result["userID"],
							"refreshToken":result["refreshToken"]
						}));
						window.location = "/";
					}).catch((error) => {
						if(error == null) {
							errorBox.show("Connection error");
						} else {
							errorBox.show(error.error);
						}
					}).finally(() => {
						registerButton.textContent = previousText;
						registerButton.disabled = false;
					});
				}
			}
		}
	});

	function registerClick(event) {
		if(event.repeat) {return};
		//key 13 is enter
		if(event.keyCode === 13 || event.key === "Enter") {
			event.preventDefault();
			registerButton.click();
		}
	}
	emailField.addEventListener("keydown", registerClick);
	passwordField.addEventListener("keydown", registerClick);
	repeatPasswordField.addEventListener("keydown", registerClick);
})();
