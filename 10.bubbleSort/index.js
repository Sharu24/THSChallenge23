var rls = require("../node_modules/readline-sync");
/*
Write an algorithm to sort the given array elements using Bubble sort 
in descendingorder and print the number of swaps happening.
●Note : The input array should be given as a command line. 
First take the lengthof the array from the user and the elements 
from the console.●The elements should be printed in descending order
 and total number of swaps
*/
function bubbleSort(arr) {
  var len = arr.length,
    swap = 0;
  for (var i = 0; i < len; i++) {
    for (var j = i + 1; j < len; j++) {
      if (arr[i] < arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        swap++;
      }
    }
  }
  return [arr, swap];
}

console.log("----- Bubble Sort -----");
var result = [];
do {
  var arr = [],
    result = [];
  i = 0;
  var len = Number(
    rls.questionInt("Please Enter the length of the Array to Sort : ")
  );
  while (len--) {
    arr.push(Number(rls.questionInt(`Enter Array Element ${++i} :`)));
  }
  result = bubbleSort(arr);
  console.log("Sorted Array    = ", result[0]);
  console.log("Number of Swaps = ", result[1]);
} while (rls.question("Wanna Try Again (y/n) ? : ") === "y" ? true : false);

/* --------------------------------------------------------*/

var iter = 1;
var marr = [];
console.log("");
console.log("--------------------------------");
console.log("----- Bubble Sort Stats --------");
console.log("Size | Swaps | n*(n+1)/2 |  n^2");
console.log("--------------------------------");
while (iter <= 20) {
  marr.push(iter);
  console.log(
    String(iter).padStart(4, " "),
    "|",
    String(bubbleSort([...marr])[1]).padStart(5, " "),
    "|",
    String(iter * Math.floor((iter + 1) / 2)).padStart(9, " "),
    "|",
    String(iter * iter).padStart(4, " ")
  );
  iter++;
}
