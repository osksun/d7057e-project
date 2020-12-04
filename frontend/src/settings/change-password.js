
(function() {
	const message = document.getElementById("change-password-message");

	function showMessage(text, isError) {
		message.textContent = text;
		if(isError) {
			message.className = "error";
		} else {
			message.textContent = "";
			messageBox.show(text);
		}
	}

	const changePasswordButton = document.getElementById("change-password-button");
	changePasswordButton.addEventListener("click", () => {
		const currentPassword = document.getElementById("current-password");
		const newPassword = document.getElementById("new-password");
		const newPasswordConfirm = document.getElementById("new-password-confirm");

		if(currentPassword.reportValidity() && newPassword.reportValidity() && newPasswordConfirm.reportValidity()) {
			if(newPassword.value != newPasswordConfirm.value) {
				showMessage("Error: Retyped password is not equal", true);
			} else if(currentPassword.value == newPassword.value) {
				showMessage("Error: New password and current password is equal", true);
			} else {
				changePasswordButton.innerHTML = "<img class=\"loading\" src=\"/src/shared/svg/loading.svg\">";
				changePasswordButton.disabled = true;
				DbCom.changeUserPassword(currentPassword.value, newPassword.value).then((result) => {
					//Change login data
					localStorage.setItem("login_data", JSON.stringify({
						"userID":result["userID"],
						"refreshToken":result["refreshToken"]
					}));

					showMessage("Password changed successfully", false);
					currentPassword.value = "";
					newPassword.value = "";
					newPasswordConfirm.value = "";
				}).catch((result) => {
					if(result.hasOwnProperty("error")) {
						showMessage("Error: " + result.error, true);
					}
				}).finally(() => {
					changePasswordButton.textContent = "Change password";
					changePasswordButton.disabled = false;
				});
			}
		}
	});
})();
