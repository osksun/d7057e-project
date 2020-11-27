<!DOCTYPE html>
<html lang="en">
	<head>
		<title>D7057E</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/body.css">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/top-bar.css">
		<link rel="stylesheet" type="text/css" href="/src/register/register.css">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/theme.css">
		<link rel="stylesheet" type="text/css" href="/src/register/error-box.css">
		<script src="/src/shared/js/backend-communication.js"></script>
		<script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit" async defer> </script>

	</head>
	<script type="text/javascript">
		var onloadCallback = function() {
			console.log("grecaptcha is ready!", );
			grecaptcha.render('reg-captcha', {
				'sitekey': "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" ,
				'theme': "dark",
				'callback': 'userResponseCallback'
			})
		};
		var userResponseCallback = function () {
			captchaVerification(grecaptcha.getResponse());
		}
	</script>

	<body>
		<?php include "../shared/html/background.html";?>
		<h2>REGISTER</h2>
		<div id="container"> 
			<label>Email</label>
			<input id="emailField" type="text" required placeholder="email@example.com">
			
			<label>Password</label>
			<input id="passwordField" type="password" required placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;">
			
			<label>Confirm Password</label>
			<input id="repeatPasswordField" type="password" required placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;">
			
			<button id="registerButton" class="button">Register</button>
			<div id = "reg-captcha" class="g-recaptcha"> </div>
		</div>
		
		<div id="error-box"></div>
		<a href="/login" class="button">Login</a>

		<script src="/src/register/register.js"></script>
		<script src="/src/register/error-box.js"></script>
	</body>
</html>
