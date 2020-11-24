
(function() {
	localStorage.removeItem("login_data");

	const loginButton = document.getElementById("loginButton");
	const emailField = document.getElementById("emailField");
	const passwordField = document.getElementById("passwordField");

	loginButton.addEventListener("click", () => {
		if(emailField.reportValidity() && passwordField.reportValidity()) {
			const email = emailField.value;
			const password = passwordField.value;

			if(email == "") {
				errorBox.show("Email required!");
			} else {
				const previousText = loginButton.textContent;
				loginButton.innerHTML = "<img class=\"loading\" src=\"/src/shared/svg/loading.svg\">";
				loginButton.disabled = true;

				DbCom.createRefreshToken(email, password).then((result) => {
					const userID = result["userID"];
					let refreshToken = result["refreshToken"];
					if(refreshToken != null) {
						localStorage.setItem("login_data", JSON.stringify({"userID":userID, "refreshToken":refreshToken}));
						window.location = "/";

						loginButton.textContent = previousText;
						loginButton.disabled = false;
					} else {
						messageBox.show("Account has been set to be deleted. Account will be recovered.", () => {
							DbCom.recoverUser(email, password).then((result) => {
								DbCom.createRefreshToken(email, password).then((result) => {
									refreshToken = result["refreshToken"];

									localStorage.setItem("login_data", JSON.stringify({"userID":userID, "refreshToken":refreshToken}));
									window.location = "/";

									loginButton.textContent = previousText;
									loginButton.disabled = false;
								}).catch((error) => {
									if(error == null) {
										errorBox.show("Connection error");
									} else {
										errorBox.show(error.error);
									}

									loginButton.textContent = previousText;
									loginButton.disabled = false;
								});
							}).catch((error) => {
								if(error == null) {
									errorBox.show("Connection error");
								} else {
									errorBox.show(error.error);
								}

								loginButton.textContent = previousText;
								loginButton.disabled = false;
							});
						});
					}
				}).catch((error) => {
					if(error == null) {
						errorBox.show("Connection error");
					} else if(error.error) {
						errorBox.show(error.error);
					} else {
						errorBox.show(error);
					}

					loginButton.textContent = previousText;
					loginButton.disabled = false;
				});
			}
		}
	});

	function loginClick(event) {
		if(event.repeat) {return};
		//key 13 is enter
		if(event.keyCode === 13 || event.key === "Enter") {
			event.preventDefault();
			loginButton.click();
		}
	}
	emailField.addEventListener("keydown", loginClick);
	passwordField.addEventListener("keydown", loginClick);
})();
