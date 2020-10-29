<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Create module</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/body.css">
		<link rel="stylesheet" type="text/css" href="/src/module-editor/module-editor.css">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/fixed-content.css">
		<script type="application/javascript" src="/src/shared/js/backend-communication.js"></script>
		<script type="application/javascript" src="/src/shared/js/fixed-content.js" defer></script>
		<script type="application/javascript" src="/src/module-editor/module-editor.js" defer></script>
	</head>
	<body>
		<?php include "../../shared/html/fixed-content.html"; ?>
		<div id="page-content">
			<div><h3>Course name</h3><p id="courseName"></p></div>
			<div><h3>Module name</h3><input id="moduleName" type="text" minlength=1 maxlength=255 required/></div>
			<div><h3>Description</h3><textarea id="moduleDescription" maxlength=255></textarea></div>
			<div><button id="createModuleButton" disabled=true><p>. . .</p></button></div>
			<div id="message"></div>
		</div>
	</body>
</html>
