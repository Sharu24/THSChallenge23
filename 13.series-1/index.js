var rls = require("../node_modules/readline-sync");

console.log("Sequence :  4,16,64,256,1024,4096,16384.,......., 2^2n [ n > 0] ");

var flag;
do {
  flag = true;
  var input = rls.questionInt(
    "Please input a number to check if belongs to the sequence : "
  );

  if (input < 4) flag = false;
  else if (input === 4) flag = true;
  else flag = input ** 0.5 % 4 === 0 ? true : false;

  console.log(`${flag ? "Yes" : "No"}`);
} while (rls.question("Wanna Try Again (y/n) ? : ") === "y" ? true : false);

// console.log(
//   `${
//     (Math.log(input) / Math.log(4)) % 1 === 0
//       ? "Approach 1: Yes"
//       : "Approach 1: No"
//   }`
// );
