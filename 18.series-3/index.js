/*
A.​Crack the series 1 2 3 6 9 18 27 54​ ......
B.Write an algorithm to produce the above number series 
  until ‘N’ where N is apositive integer

  for n >= 0, adds 3^n, 3^n
  1,1,3,3,9,9,27,27,....
*/

var rls = require("../node_modules/readline-sync");

var num, tmp, seq, range;
do {
  num = rls.questionInt("Enter A number to produce the sequence : ");
  tmp = 0;

  seq = "";
  range = num % 2 ? Math.floor(num / 2) + 1 : Math.floor(num / 2);

  for (var i = 0; i < range; i++) {
    tmp = 3 ** i;
    if (i === range - 1 && num % 2) seq += tmp;
    else seq += tmp + "," + 2 * tmp + ",";
  }
  console.log(seq);
} while (rls.question("Wanna Try Again (y/n) ? : ") === "y" ? true : false);
