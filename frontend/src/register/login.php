<!DOCTYPE html>
<html lang="en">
	<head>
		<title>D7057E</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="/src/register/register.css">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/body.css">
		<script type="application/javascript" src="/src/shared/js/backend-communication.js"></script>
		<script>
			function loginAuthentication(){
				var username = document.forms["loginForm"]["uname"].value;
				var password = document.forms["loginForm"]["pw"].value;

				if(username == ""){
					alert("Enter username!");
				}else{
					var id = DbCom.createRefreshToken(username, password).then((r) => {
						localStorage.setItem("login_data", JSON.stringify({"userID":r["userID"], "refreshToken":r["refreshToken"]}));
						window.location = "../index/html";
					}).catch((error) => {alert("Error: " + error);});

					// Keep form from refreshing current page.
					return false;
				}
			}
		</script>
	</head>
	<body>
		<!--LOGIN FORM SECTION -->
		<div id="registerContainer">
			<div id="titleContainer">
				<h2>LOGIN</h2>
			</div>
			<div id="contentContainer">
				<form id="loginForm" method = "post" onsubmit="return loginAuthentication()">
					<label class="uniLabel" for="uname">Username:</label>
					<input type="text" class="inputContent" placeholder="username" name="uname">
					<br><br>
					<label class="uniLabel" for="sname">Password:</label>
					<input type="password" class="inputContent" placeholder="password" name="pw">
					<br><br>
					<input type="submit" name="Register" value="Login">
				</form>
			</div>
		</div>
	</body>
</html>
