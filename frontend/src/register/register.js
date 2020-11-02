(function(){
    function validateForm() {
        var email = document.forms["regForm"]["email"].value;
        var pw = document.forms["regForm"]["pw"].value;
        var rpw = document.forms["regForm"]["rpw"].value;

        if (email == "" || pw == "" || rpw == "") {
            alert("Fill in all the required fields");
            return false;
        }else{
            if(pw != rpw){
                alert("Passwords do not match!");
            }
            else{
                return new Promise((resolve, reject) => {
                    DbCom.registerUser(email, pw);
                });
            }
        }
    }
})