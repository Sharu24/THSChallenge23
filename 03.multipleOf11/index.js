var rls = require("../node_modules/readline-sync");

console.log("");
console.log(" ----- Objective: Check if the number is multiple of 11 ---");
console.log("Keeps asking user until the entered number is divisible by 11");
console.log("");

var userInp;
do {
  while (1) {
    userInp = rls.questionInt("Enter a Number: ");
    if (!(userInp % 11)) break;
    else console.log(`${userInp} is not a multiple of 11. Try Again`);
  }
} while (rls.question("Wanna Try Again (y/n) ? : ") === "y" ? true : false);
