<!DOCTYPE html>
<html lang="en">
    <head>
        <title>All courses</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="../css/index.css">
        <link rel="stylesheet" type="text/css" href="../css/question-view.css">
        <link rel="stylesheet" type="text/css" href="../../shared/css/fixed-content.css">
        <script src="../js/mathjax-config.js" defer></script>
        <script type="text/javascript" id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" defer></script>
        <script type="application/javascript" src="../../shared/js/backend-communication.js"></script>
        <script type="application/javascript" src="../../shared/js/fixed-content.js" defer></script>
        <script type="application/javascript" src="../js/index.js"></script>
        <script type="application/javascript" src="../js/courses-view.js" defer></script>
        <script type="application/javascript" src="../js/modules-view.js" defer></script>
        <script type="application/javascript" src="../js/question-view.js" defer></script>
    </head>
    <body class="tex2jax_ignore">
        <?php include "../../shared/html/fixed-content.html"; ?>
        <div id="page-content">
            <div id="category-container" class="category-container">
                <div id="button-container" class="button-container">
                    <button id="button-courses" class="selected"><h2>All courses</h2></button>
                    <button id="button-course" disabled><h2>Modules</h2></button>
                    <button id="button-question" disabled><h2>Question</h2></button>
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