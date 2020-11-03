
(function() {
	const loginButton = document.getElementById("loginButton");
	const emailField = document.getElementById("emailField");
	const passwordField = document.getElementById("passwordField");

	loginButton.addEventListener("click", () => {
		if(emailField.reportValidity() && passwordField.reportValidity()) {
			const email = emailField.value;
			const password = passwordField.value;

			if(email == "") {
				alert("Enter email!");
			} else {
				var id = DbCom.createRefreshToken(email, password).then((r) => {
					localStorage.setItem("login_data", JSON.stringify({"userID":r["userID"], "refreshToken":r["refreshToken"]}));
					window.location = "/";
				}).catch((error) => {
					alert("Error: " + error);
				});
			}
		}
	});
})();
