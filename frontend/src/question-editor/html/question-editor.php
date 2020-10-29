<!DOCTYPE html>
<html lang="en">
	<head>
		<title>All courses</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/body.css">
		<link rel="stylesheet" type="text/css" href="/src/question-editor/css/question-editor.css">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/fixed-content.css">
		<script src="/src/shared/js/mathjax-config.js" defer></script>
		<script type="text/javascript" id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" defer></script>
		<script type="application/javascript" src="/src/shared/js/backend-communication.js"></script>
		<script type="application/javascript" src="/src/shared/js/fixed-content.js" defer></script>
		<script type="application/javascript" src="/src/question-editor/js/question-editor.js"></script>
	</head>
	<body class="tex2jax_ignore">
		<?php include "../../shared/html/fixed-content.html"; ?>
		<div id="page-content">
			<div id="content-container">
				<textarea id="latex-input"></textarea>
				<p id="latex-output" class="tex2jax_process"></p>
			</div>
			<div id="bottom-container">
				<h3 id="answer-title">Answer regular expression: </h3><input id="question-answer-regex" type="text" minlength=1 maxlength=255 required/>
				<button type="button" id="create-question-button" disabled=true><p>. . .</p></button>
				<div id="question-editor-message"></div>
			</div>
		</div>
	</body>
</html>
