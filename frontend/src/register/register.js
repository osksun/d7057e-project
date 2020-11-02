
function validateForm() {
	const email = document.forms["regForm"]["email"].value;
	const pw = document.forms["regForm"]["password"].value;
	const rpw = document.forms["regForm"]["repeatPassword"].value;

	if(email == "" || pw == "" || rpw == "") {
		alert("Fill in all the required fields");
		return false;
	} else {
		if(pw != rpw) {
			alert("Passwords do not match!");
		} else {
			DbCom.registerUser(email, pw).then((r) => {
				alert("Success: " + r);
			}).catch((error) => {
				alert("Error: " + error);
			});
		}
	}
}
