
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
				alert("Fill in all the required fields");
			} else {
				if(password != passwordRepeat) {
					alert("Passwords do not match!");
				} else {
					DbCom.registerUser(email, password).then((result) => {
						console.log(result);
						localStorage.setItem("login_data", JSON.stringify({
							"userID":result["userID"],
							"refreshToken":result["refreshToken"]
						}));
						window.location = "/";
					}).catch((error) => {
						alert("Error: " + error);
					});
				}
			}
		}
	});
})();
