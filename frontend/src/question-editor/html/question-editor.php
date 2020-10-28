<!DOCTYPE html>
<html lang="en">
    <head>
        <title>All courses</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="../../shared/css/body.css">
        <link rel="stylesheet" type="text/css" href="../css/question-editor.css">
        <link rel="stylesheet" type="text/css" href="../../shared/css/fixed-content.css">
        <script src="../../shared/js/mathjax-config.js" defer></script>
        <script type="text/javascript" id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" defer></script>
        <script type="application/javascript" src="../../shared/js/backend-communication.js"></script>
        <script type="application/javascript" src="../../shared/js/fixed-content.js" defer></script>
        <script type="application/javascript" src="../js/question-editor.js"></script>
    </head>
    <body class="tex2jax_ignore">
        <?php include "../../shared/html/fixed-content.html"; ?>
        <div id="page-content">
            <div id="content-container">
                <textarea id="latex-input"></textarea>
                <p id="latex-output" class="tex2jax_process"></p>
            </div>
            <button type="button" id="submit-button">Create question</button>
        </div>
    </body>
</html>