
function loginAuthentication() {
	const username = document.forms["loginForm"]["uname"].value;
	const password = document.forms["loginForm"]["pw"].value;

	if(username == "") {
		alert("Enter username!");
	} else {
		var id = DbCom.createRefreshToken(username, password).then((r) => {
			localStorage.setItem("login_data", JSON.stringify({"userID":r["userID"], "refreshToken":r["refreshToken"]}));
			window.location = "../index/html";
		}).catch((error) => {
			alert("Error: " + error);
		});

		// Keep form from refreshing current page.
		return false;
	}
}
