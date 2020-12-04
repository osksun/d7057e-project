
(function() {
	const message = document.getElementById("delete-message");

	function showMessage(text, isError) {
		message.textContent = text;
		if(isError) {
			message.className = "error";
		} else {
			message.className = "";
		}
	}

	const deleteButton = document.getElementById("delete-button");
	deleteButton.addEventListener("click", () => {
		const passwordField = document.getElementById("delete-password");

		if(passwordField.reportValidity()) {
			deleteButton.innerHTML = "<img class=\"loading\" src=\"/src/shared/svg/loading.svg\">";
			deleteButton.disabled = true;
			DbCom.deleteUser(passwordField.value).then((result) => {
				//Logout
				messageBox.show("Account deleted successfully", () => {
					window.location.href = "/login";
				});

				passwordField.value = "";
			}).catch((result) => {
				if(result.hasOwnProperty("error")) {
					showMessage("Error: " + result.error, true);
				}
			}).finally(() => {
				deleteButton.textContent = "Delete account";
				deleteButton.disabled = false;
			});
		}
	});
})();
