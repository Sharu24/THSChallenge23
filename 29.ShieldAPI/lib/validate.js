const validate = {};

const specialSet = "!@#$%&*_";
const RE_CHAR_ONLY = /^[a-zA-Z]+$/;
const RE_NUM_ONLY = /^[0-9]+$/;
const RE_EMAIL = /^[\w]+[\-_.]*[\w]+@[\w]+\.[a-zA-Z]+$/;
const RE_PASSWORD = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*_]).{8,15}$/;

var getObj = (valid, value, message) => {
  return {
    valid: valid,
    value: value,
    message: message
  };
};

var userName = name => {
  if (!name || typeof name !== "string") {
    return getObj(false, name, "First/Last Name Should be passed as String");
  }
  name = name.trim();
  if (name.length <= 2 || name.length > 30) {
    return getObj(false, name, "First/Last Name lengths between 2 and 30 Only");
  } else if (!RE_CHAR_ONLY.test(name)) {
    return getObj(false, name, "First/Last Name should have only Alphabets");
  } else {
    return getObj(true, name, null);
  }
};

validate.firstName = userName;
validate.lastName = userName;

validate.mobileNumber = num => {
  if (!num || typeof num !== "string") {
    return getObj(false, name, "Mobile Number should be passed");
  }
  num = num.trim();
  if (num.length !== 10) {
    return getObj(false, num, "Mobile Number should be of length 10");
  } else if (!RE_NUM_ONLY.test(num)) {
    return getObj(false, num, "Mobile Number should have only Numbers");
  } else {
    return getObj(true, num, null);
  }
};

validate.emailAddress = email => {
  if (!email || typeof email !== "string") {
    return getObj(false, email, "Email should be a string");
  }
  email = email.trim();
  if (email.length > 320) {
    return getObj(false, email, "Email Address cannot exceed 320 chars");
  } else if (!RE_EMAIL.test(email)) {
    return getObj(false, email, "Not a Valid Email Address. Please retry");
  } else {
    return getObj(true, email, null);
  }
};

validate.userPassword = pass => {
  if (!pass || typeof pass !== "string") {
    return getObj(false, pass, "Password should be a string");
  }
  pass = pass.trim();
  if (pass.length < 8 || pass.length > 15) {
    return getObj(false, pass, "Password: Minimum of 8 and max of 15 chars");
  } else if (!RE_PASSWORD.test(pass)) {
    var passwordMessage = "Password Shoud have atleast ";
    passwordMessage += "1 LowerCase, 1 UpperCase, 1 Number";
    passwordMessage += " 1 Special Character (" + specialSet + ")";
    return getObj(false, pass, passwordMessage);
  } else {
    return getObj(true, pass, null);
  }
};

var bool = boolVal => {
  if (typeof boolVal !== "boolean") {
    return getObj(false, boolVal, "Agreement should be Boolean(true/false)");
  } else {
    return getObj(boolVal, boolVal, null);
  }
};

validate.tcAgreement = bool;

validate.queryParam = str => {
  return getObj(true, str, null);
};

module.exports = {
  validate
};
