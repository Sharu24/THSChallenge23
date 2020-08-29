function validateNumber(num, method) {
  if (method === "AC") {
    num = "" + num;
    for (var i in num) {
      var ascii = num.charCodeAt(i);
      if (ascii < 48 || ascii > 57) {
        return false;
      }
    }
    return true;
  } else if (method === "RE") {
    return /\D/.test(num) ? false : true;
  } else if (method === "NN") {
    return num.trim().length !== num.length ? false : isNaN(num) ? false : true;
  }
}

module.exports = validateNumber;
