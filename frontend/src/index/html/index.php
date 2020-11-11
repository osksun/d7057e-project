<!DOCTYPE html>
<html lang="en">
	<head>
		<title>All courses</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/top-bar.css">
		<link rel="stylesheet" type="text/css" href="/src/shared/css/body.css">
		<link rel="stylesheet" type="text/css" href="/src/index/css/index.css">
		<link rel="stylesheet" type="text/css" href="/src/index/css/cards-view.css">
		<link rel="stylesheet" type="text/css" href="/src/index/css/question-view.css">
		<link rel="stylesheet" type="text/css" href="/src/index/css/segments/mathjax-latex.css">
		<link rel="stylesheet" type="text/css" href="/src/course-editor/course-editor.css">
		<link rel="stylesheet" type="text/css" href="/src/module-editor/module-editor.css">
		<link rel="stylesheet" type="text/css" href="/src/question-editor/question-editor.css">
		<link rel="stylesheet" type="text/css" href="/src/question-list/question-list.css">
		<script src="/src/shared/js/mathjax-config.js" defer></script>
		<script id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" defer></script>
		<script src="/src/shared/js/backend-communication.js"></script>
		<script src="/src/shared/js/top-bar.js" defer></script>
		<script src="/src/index/js/index.js"></script>
	</head>
	<body class="tex2jax_ignore">
		<?php include "../../shared/html/background.html"; ?>
		<?php include "../../shared/html/top-bar.html"; ?>
		<div id="page-content">
			<div id="category-container" class="category-container">
				<div id="button-container" class="button-container">
					<button id="courses-button"><h2>All courses</h2></button><!--
					--><button id="modules-button" disabled><h2>Modules</h2></button><!--
					--><button id="question-button" disabled><h2>Question</h2></button>
				</div>
				<div id="view-container">
					<div id="courses-view">
						<script src="/src/index/js/courses-view.js" defer></script>
						<div id="course-cards-container"></div>
						<?php include "../../course-editor/course-editor.html"; ?>
					</div>
					<div id="modules-view">
						<script src="/src/index/js/modules-view.js" defer></script>
						<div id="module-cards-container"></div>
						<?php include "../../module-editor/module-editor.html"; ?>
					</div>
					<div id="question-view">
						<srcipt src="/src/index/js/question-view.js" defer></srcipt>
						<div id="question-container">
							<?php include "./question-view.html"; ?>
						</div>
						<?php include "../../question-editor/question-editor.html"; ?>
						<?php include  "../../question-list/question-list.html"; ?>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>
