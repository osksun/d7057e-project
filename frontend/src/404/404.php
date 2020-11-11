<?php
http_response_code(404);
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>404 - Page not found</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/body.css">
		<link rel="stylesheet" type="text/css" href="/src/404/404.css">
	</head>
	<body>
		<?php include "../shared/html/background.html"; ?>
		<div id="page-content">
			<h1>404</h1>
			<h2>Page not found</h2>
			<a href="/">Return to home</a>
		</div>
	</body>
</html>
