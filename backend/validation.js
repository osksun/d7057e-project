function validateEmail(email) {
	//Checks if the email is the correct type (String)
	if(typeof email === "string") {
		//Checks if the email length is within the range 0-254
		if(email.length > 0 && email.length <= 254) {
			//Checks if the email is in a valid form
			const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if(mailRegex.test(email)) {
				return true;
			}
		}
	}
	return false;
}
exports.validateEmail = validateEmail;

function validatePassword(password) {
	//Checks if the password is the correct type (String)
	if(typeof password === "string") {
		//Checks if the password length is within the range 0-254
		if(password.length > 0 && password.length <= 254) {
			return true;
		}
	}
	return false;
}
exports.validatePassword = validatePassword;

function validateRefreshToken(token) {
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
	return false;
}
exports.validateRefreshToken = validateRefreshToken;

function validateAccessToken(token) {
	//Checks if the token is the correct type (String)
	if(typeof token === "string") {
		//Checks if the token is the correct length
		if(token.length == 344) {
			//Checks if the token is in a valid format
			const tokenRegex = /^[A-Za-z0-9\+\/]*==$/;
			if(tokenRegex.test(token)) {
				return true;
			}
		}
	}
	return false;
}
exports.validateAccessToken = validateAccessToken;

function validateTokenExpire(time) {
	if(typeof time === "number") {
		if(!isNaN(time)) {
			if(time > 0) {
				return true;
			}
		}
	}
	return false;
}
exports.validateTokenExpire = validateTokenExpire;

function validateUnsignedInt(i) {
	if(typeof i === "number") {
		if(!isNaN(i)) {
			if(i >= 0) {
				if(Number.isInteger(i)) {
					return true;
				}
			}
		}
	}
	return false;
}
exports.validateUnsignedInt = validateUnsignedInt;

function validateStringMax(s, maxLength) {
	if(typeof s === "string") {
		if(s.length <= maxLength) {
			return true;
		}
	}
	return false;
}
exports.validateStringMax = validateStringMax;

function validateStringMaxArray(a, maxArrayLength, maxLength) {
	if(Array.isArray(a)) {
		if(a.length <= maxArrayLength) {
			for(let i = 0; i < a.length; ++i) {
				const s = a[i];
				if(!validateStringMax(s, maxLength)) {
					return false;
				}
			}

			return true;
		}
	}
	return false;
}
exports.validateStringMaxArray = validateStringMaxArray;

function validateStringMaxWithNullArray(a, maxArrayLength, maxLength) {
	if(Array.isArray(a)) {
		if(a.length <= maxArrayLength) {
			for(let i = 0; i < a.length; ++i) {
				const s = a[i];
				if(s != null) {
					if(!validateStringMax(s, maxLength)) {
						return false;
					}
				}
			}

			return true;
		}
	}
	return false;
}
exports.validateStringMaxWithNullArray = validateStringMaxWithNullArray;

function validateHexColor(c) {
	if(typeof c === "string") {
		if(c.length == 6) {
			return true;
		}
	}
	return false;
}
exports.validateHexColor = validateHexColor;
