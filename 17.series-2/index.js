/*

A.Crack the series ​2 15 41 80 132 197 275 366 470 587 ......
B.Write an algorithm to produce the above number series until ‘N’ 
  where N is apositive integer

diff = 13, 26, 39, 52, 65, 91, 104
*/
/* ------------------------------------------------------------

Crack the series ​2 15 41 80 132 197 275 366 470 587 ......
for i = 0, 1, 2, 3 , 4, 5 , ......
when i = 0  then 2
when i > 0  then ele(i-1) * 13*i 
--------------------------------------------------------------*/

var rls = require("../node_modules/readline-sync");
var num;

function recurSeries(num, i = 0, k = 2) {
  if (!num) return "";
  else return k + "," + recurSeries(--num, ++i, k + 13 * i);
}

function iterSeries(num) {
  var i = 0,
    k = 2,
    out = "";
  do {
    k = k + 13 * i;
    out += k + ",";
    i++;
  } while (i < num);
  return out;
}

do {
  num = rls.questionInt("Enter a number to generate the sequence : ");
  console.log("Loops : ", iterSeries(num));
  console.log("Recursion : ", recurSeries(num));
} while (rls.question("Wanna Try Again (y/n) ? : ") === "y" ? true : false);
