<!DOCTYPE html>
<html lang="en">
	<head>
		<title>D7057E</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="../../shared/css/body.css">
		<link rel="stylesheet" type="text/css" href="../../shared/css/fixed-content.css">
		<link rel="stylesheet" type="text/css" href="../register.css">
		<script type="application/javascript" src="../../shared/js/backend-communication.js"></script>
		<script src="/src/register/register.js"></script>
	</head>
	<body>
		<!--LOGIN FORM SECTION -->
		<div id="registerContainer">
			<div id="titleContainer">
				<h2>REGISTER USER</h2>
			</div>
			<div id="contentContainer">
				<form id="regForm" method = "post" onsubmit="return validateForm()">
					<label class="uniLabel" for="email">Email:</label>
					<input type="text" class="inputContent" placeholder="Email" name="email">
					<br><br>
					<label class="uniLabel" for="password">Password:</label>
					<input type="text" class="inputContent" placeholder="Password" name="password">
					<br><br>
					<label class="uniLabel" for="rpw">Repeat Password:</label>
					<input type="text" class="inputContent" placeholder="Repeat" name="repeatPassword">
					<br><br>
					<input type="submit">
				</form>
			</div>
		</div>
	</body>
</html>
