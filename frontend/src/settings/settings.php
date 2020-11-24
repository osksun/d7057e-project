<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Settings</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/body.css">
		<link rel="stylesheet" type="text/css" href="/src/settings/settings.css">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/top-bar.css">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/theme.css">
		<link rel="stylesheet" type="text/css" href="/src/message-box/message-box.css">
		<script src="/src/shared/js/backend-communication.js"></script>
		<script src="/src/shared/js/top-bar.js" defer></script>
		<script src="/src/settings/settings.js" defer></script>
		<script src="/src/message-box/message-box.js"></script>
	</head>
	<body>
		<?php include "../shared/html/background.html"; ?>
		<?php include "../shared/html/top-bar.html"; ?>
		<h2>Change password</h2>
		<div class="form">
			<div><h3>Current password</h3><input id="current-password" type="password" autocomplete="current-password" required/></div>
			<div><h3>New password</h3><input id="new-password" type="password" autocomplete="new-password" required/></div>
			<div><h3>Confirm new password</h3><input id="new-password-confirm" type="password" autocomplete="new-password" required/></div>
			<div><button id="change-password-button" class="button">Change password</button></div>
			<div id="change-password-message"></div>
		</div>

		<h2>Delete account</h2>
		<div class="form">
			<div><h3>Current password</h3><input id="delete-password" type="password" autocomplete="current-password" required/></div>
			<div><button id="delete-button" class="button">Delete account</button></div>
			<div id="delete-message"></div>
		</div>
	</body>
</html>
