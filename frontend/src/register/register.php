<!DOCTYPE html>
<html lang="en">
	<head>
		<title>D7057E</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/body.css">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/fixed-content.css">
		<link rel="stylesheet" type="text/css" href="/src/register/register.css">
		<script src="/src/shared/js/backend-communication.js"></script>
	</head>
	<body>
		<!--LOGIN FORM SECTION -->
		<div id="registerContainer">
			<div id="titleContainer">
				<h2>REGISTER USER</h2>
			</div>
			<div id="contentContainer">
				<label>Email:</label>
				<input id="emailField" type="text" required placeholder="Email">
				<br><br>
				<label>Password:</label>
				<input id="passwordField" type="password" required placeholder="Password">
				<br><br>
				<label>Repeat Password:</label>
				<input id="repeatPasswordField" type="password" required placeholder="Repeat password">
				<br><br>
				<button id="registerButton">Register</button>
			</div>
		</div>
		<script src="/src/register/register.js"></script>
	</body>
</html>
