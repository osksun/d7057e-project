<!DOCTYPE html>
<html lang="en">
	<head>
		<title>D7057E</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="/src/register/register.css">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/body.css">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/theme.css">
		<link rel="stylesheet" type="text/css" href="/src/register/error-box.css">
		<link rel="stylesheet" type="text/css" href="/src/message-box/message-box.css">
		<script src="/src/shared/js/backend-communication.js"></script>
		<script src="/src/message-box/message-box.js"></script>
	</head>
	<body>
		<?php include "../shared/html/background.html"; ?>
		<h2>LOGIN</h2>
		<div id="container">
			<label>Email</label>
			<input id="emailField" type="text" placeholder="email@example.com" required autofocus>

			<label>Password</label>
			<input id="passwordField" type="password" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" required>

			<button id="loginButton" class="button">Login</button>
		</div>
		<div id="error-box"></div>
		<a href="/register" class="button">New account</a>

		<script src="/src/register/login.js"></script>
		<script src="/src/register/error-box.js"></script>
	</body>
</html>
