
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
				alert("Enter email!");
			} else {
				const previousText = loginButton.textContent;
				loginButton.innerHTML = "<img class=\"loading\" src=\"/src/shared/svg/loading.svg\">";
				loginButton.disabled = true;

				DbCom.createRefreshToken(email, password).then((r) => {
					localStorage.setItem("login_data", JSON.stringify({"userID":r["userID"], "refreshToken":r["refreshToken"]}));
					window.location = "/";
				}).catch((error) => {
					alert("Error: " + error);
				}).finally(() => {
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
