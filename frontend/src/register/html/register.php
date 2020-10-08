<?php

    // Define variables
    $email = $pw = $rpw = $sid = $err = "";
    $emailErr = $pwErr = $rpwErr = $sidErr = "";
    if($_SERVER["REQUEST_METHOD"] == "POST")
    {
        if(empty($_POST["email"])){
            $emailErr = "Please Enter a Valid Email-Address.";
        }else{
            $email = test_input($_POST["email"]);
        }
        if(empty($_POST["pw"])){
            $pwErr = "Please Enter a Password.";
        }else{
            $pw = test_input($_POST["pw"]);
        }
        if(empty($_POST["rpw"])){
            $rpwErr = "Please Repeat the Password.";
        }else{
            $rpw = test_input($_POST["rpw"]);
        }
        if(empty($_POST["pw"])){
            $sidErr = "Please Enter a Valid Student-ID.";
        }else{
            $sid = test_input($_POST["sid"]);
        }
    }

    function test_input($data)
    {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }



?>
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
                <h2>REGISTER USER</h2>
            </div>
            <div id="contentContainer">
                <form method = "post" action = "<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
                    <label class="uniLabel" for="email">Email:</label>
                    <input type="text" class="inputContent" placeholder="Email" name="email">
                    <span class="error">* <?php echo $emailErr;?></span>
                    <br><br>
                    <label class="uniLabel" for="password">Password:</label>
                    <input type="text" class="inputContent" placeholder="Password" name="pw">
                    <span class="error">* <?php echo $pwErr;?></span>
                    <br><br>
                    <label class="uniLabel" for="rpw">Repeat Password:</label>
                    <input type="text" class="inputContent" placeholder="Repeat" name="rpw">
                    <span class="error">* <?php echo $rpwErr;?></span>
                    <br><br>
                    <label class="uniLabel" for="school_id">School-ID:</label>
                    <input type="text" class="inputContent" placeholder="School-ID" name="sid">
                    <span class="error">* <?php echo $sidErr;?></span>
                    <br><br>
                    <input type="submit" name="Register" value="Register">
                </form>
            </div>
        </div>
    </body>
</html>


