<!DOCTYPE html>
<html lang="en">
    <head>
        <title>D7057E</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="../css/index.css">
        <link rel="stylesheet" type="text/css" href="../../shared/css/page-content-fixed.css">
        <script type="application/javascript" src="../../shared/js/backend-communication.js"></script>
        <script type="application/javascript" src="../js/index.js"></script>
        <script type="application/javascript" src="../../shared/js/page-content-fixed.js"></script>
    </head>
    <body>
        <!-- page-content-fixed should be included from ../../shared/html/page-content-fixed.html -->
        <?php include '../../shared/html/header.php'; ?>
        <!-- End of page-content-fixed -->
        <div id="page-content">
            <div id="category-container" class="category-container">
                <div id="button-container" class="button-container">
                    <button id="button-all-courses" class="selected"><h2>All courses</h2></button>
                    <button id="button-course" disabled><h2>Course</h2></button>
                    <button id="button-question" disabled><h2>Question</h2></button>
                </div>
                <div id="view-container" class="view-container">
                    <ul id="view-all-courses" class="visible">
                    </ul>
                    <ul id="view-course">
                    </ul>
                    <ul id="view-question">
                    </ul>
                </div>
            </div>
        </div>
    </body>
</html>