function validateEmail(email) {
	//Checks if email is not undefined
	if(email) {
		//Checks if the email is the correct type (String)
		if(typeof email === "string") {
			//Checks if the email length is within the range 0-254
			if(email.length > 0 && email.length <= 254) {
				//Checks if the email is in a valid form
				const mailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
				if(mailRegex.test(email)) {
					return true;
				}
			}
		}
	}
	return false;
}
exports.validateEmail = validateEmail;

function validatePassword(password) {
	//Checks if password is not undefined
	if(password) {
		//Checks if the password is the correct type (String)
		if(typeof password === "string") {
			//Checks if the password length is within the range 0-254
			if(password.length > 0 && password.length <= 254) {
				return true;
			}
		}
	}
	return false;
}
exports.validatePassword = validatePassword;

function validateRefreshToken(token) {
	//Checks if token is not undefined
	if(token) {
		//Checks if the token is the correct type (String)
		if(typeof token === "string") {
			//Checks if the token is the correct length
			if(token.length == 64) {
				//Checks if the token is in a valid format
				const tokenRegex = /^[A-Za-z0-9\+\/]*$/;
				if(tokenRegex.test(token)) {
					return true;
				}
			}
		}
	}
	return false;
}
exports.validateRefreshToken = validateRefreshToken;

function validateTokenExpire(token) {
	if(token) {
		if(typeof token === "number") {
			if(number > 0) {
				return true;
			}
		}
	}
	return false;
}
exports.validateTokenExpire = validateTokenExpire;
