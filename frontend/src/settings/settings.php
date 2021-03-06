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
		<script src="/res/lib/sha512.js"></script>
		<script src="/src/shared/js/backend-error-code.js"></script>
		<script src="/src/shared/js/backend-communication.js" defer></script>
		<script src="/src/shared/js/top-bar.js" defer></script>
		<script src="/src/message-box/message-box.js" defer></script>
		<script src="/src/settings/change-password.js" defer></script>
		<script src="/src/settings/set-username.js" defer></script>
		<script src="/src/settings/delete-account.js" defer></script>
	</head>
	<body>
		<?php include "../shared/html/background.html"; ?>
		<?php include "../shared/html/top-bar.html"; ?>
		<h2>Change password</h2>
		<div class="form">
			<div><h3>Current password</h3><input id="current-password" class="text-box" type="password" autocomplete="current-password" required/></div>
			<div><h3>New password</h3><input id="new-password" class="text-box" type="password" autocomplete="new-password" required/></div>
			<div><h3>Confirm new password</h3><input id="new-password-confirm" class="text-box" type="password" autocomplete="new-password" required/></div>
			<div><button id="change-password-button" class="button">Change password</button></div>
			<div id="change-password-message"></div>
		</div>

		<h2>Set account username</h2>
		<div class="form">
			<div><h3>Username</h3><input id="username-field" class="text-box" type="text" maxlength=255 /></div>
			<div><button id="username-button" class="button">Set username</button></div>
			<div id="set-username-message"></div>
		</div>

		<h2>Delete account</h2>
		<div class="form">
			<div><h3>Current password</h3><input id="delete-password" class="text-box" type="password" autocomplete="current-password" required/></div>
			<div><button id="delete-button" class="button">Delete account</button></div>
			<div id="delete-message"></div>
		</div>
		<br>
	</body>
</html>
