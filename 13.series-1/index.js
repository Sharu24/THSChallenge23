var rls = require("../node_modules/readline-sync");

console.log("Sequence :  4,16,64,256,1024,4096,16384.,......., 2^2n [ n > 0] ");

do {
  var input = rls.questionInt(
    "Please input a number to check if belongs to the sequence : "
  );

  console.log(`${(Math.log(input) / Math.log(4)) % 1 === 0 ? "1yes" : "2no"}`);
  console.log(`${input ** 0.5 % 4 === 0 ? "2yes" : "2no"}`);
} while (rls.question("Wanna Try Again (y/n) ? : ") === "y" ? true : false);
