<!DOCTYPE html>
<html lang="en">
    <head>
        <title>All courses</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="/src/shared/css/body.css">
        <link rel="stylesheet" type="text/css" href="/src/index/css/index.css">
        <link rel="stylesheet" type="text/css" href="/src/index/css/courses-view.css">
        <link rel="stylesheet" type="text/css" href="/src/index/css/modules-view.css">
        <link rel="stylesheet" type="text/css" href="/src/index/css/question-view.css">
        <link rel="stylesheet" type="text/css" href="/src/shared/css/fixed-content.css">
        <script src="/src/shared/js/mathjax-config.js" defer></script>
        <script type="text/javascript" id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" defer></script>
        <script type="application/javascript" src="/src/shared/js/backend-communication.js"></script>
        <script type="application/javascript" src="/src/shared/js/fixed-content.js" defer></script>
        <script type="application/javascript" src="/src/index/js/index.js"></script>
        <script type="application/javascript" src="/src/index/js/courses-view.js" defer></script>
        <script type="application/javascript" src="/src/index/js/modules-view.js" defer></script>
        <script type="application/javascript" src="/src/index/js/question-view.js" defer></script>
    </head>
    <body class="tex2jax_ignore">
        <?php include "../../shared/html/fixed-content.html"; ?>
        <div id="page-content">
            <div id="category-container" class="category-container">
                <div id="button-container" class="button-container">
                    <button id="courses-button"><h2>All courses</h2></button>
                    <button id="modules-button" disabled><h2>Modules</h2></button>
                    <button id="question-button" disabled><h2>Question</h2></button>
                </div>
                <div id="view-container" class="view-container">
                    <ul id="view-courses" class="visible">
                    </ul>
                    <ul id="view-modules">
                    </ul>
                    <ul id="view-question">
                        <?php include "./question-view.html"; ?>
                    </ul>
                </div>
            </div>
        </div>
    </body>
</html>
