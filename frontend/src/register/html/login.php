<!DOCTYPE html>
<html lang="en">
    <head>
        <title>D7057E</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="../css/register.css">
        <link rel="stylesheet" type="text/css" href="../../shared/css/page-content-fixed.css">
        <script type="application/javascript" src="../../shared/js/backend-communication.js"></script>
        <script type="application/javascript" src="../../index/js/index.js"></script>
        <script type="application/javascript" src="../../shared/js/page-content-fixed.js"></script>
    </head>
    <body>
        <!--LOGIN FORM SECTION -->
        <?php include '../../shared/html/header.php' ?>
        <div id="registerContainer">
            <div id="titleContainer">
                <h2>LOGIN</h2>
            </div>
            <div id="contentContainer">
                <label class="uniLabel" for="uname">Username:</label>
                <input type="text" class="inputContent" placeholder="First Name" name="fname">
                <br><br>
                <label class="uniLabel" for="sname">Password:</label>
                <input type="password" class="inputContent" placeholder="password" name="sname">
                <br><br>
                <input type="submit" name="Register" value="Register">
            </div>
        </div>
    </body>
</html>


