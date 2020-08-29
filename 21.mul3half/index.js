/*
21​ Write an Algorithm, Given an integer x, 
Write a function that multiplies x with 3.5 and
returns the integer result.You are not allowed to use %, /, *.
Input: 5
Output: 17 (Ignore the digits after decimal point)
*/

var rls = require("../node_modules/readline-sync");

var mult = 3.5;
var add = (num, mult) => (num ? mult + add(--num, mult) : 0);

while (1) {
  var num = rls.question("Enter a Number ('q' to Quit): ");
  if (num === "q") break;
  else console.log(String(add(Number(num), mult)).split(".")[0]);
}
