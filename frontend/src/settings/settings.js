
(function() {
	const message = document.getElementById("message");

	function showMessage(text, isError) {
		message.textContent = text;
		if(isError) {
			message.className = "error";
		} else {
			message.className = "";
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
				changePasswordButton.innerHTML = "<p>. . .</p>";
				changePasswordButton.disabled = true;
				DbCom.changeUserPassword(currentPassword.value, newPassword.value).then(() => {
					showMessage("Password changed successfully", false);
				}).catch((result) => {
					if(result.hasOwnProperty("error")) {
						showMessage("Error: " + result.error, true);
					}
				}).finally(() => {
					changePasswordButton.innerHTML = "<p>Change password</p>";
					changePasswordButton.disabled = false;
				});
			}
		}
	});
})();
