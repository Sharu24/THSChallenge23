//jshint esversion:7
var rls = require("../node_modules/readline-sync");

console.log("");
console.log(" ----- Objective: Write an Algorithm to encrypt and decrypt ---");
console.log(" ------ an input string using XOR CipherAlgorithm -------------");
console.log("");

function getXor(userInp, key) {
  binK = key.charCodeAt(0);
  var i = userInp.length,
    sumZ = "";
  while (i--) {
    // console.log(String.fromCharCode(userInp.charCodeAt(i) ^ binK).split(""));
    sumZ = String.fromCharCode(userInp.charCodeAt(i) ^ binK) + sumZ;
  }
  return sumZ;
}

do {
  var userInp = rls.question("Please enter a String to Encrypt/Decrypt : ");
  do {
    var key = rls.question("Enter Key (Just a Char): ");
  } while (key.length !== 1);
  console.log("Out Encrypted String : ", getXor(userInp, key));
} while (rls.question("Wanna Try Again (y/n) ? : ") === "y" ? true : false);
