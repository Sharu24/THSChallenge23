// Write an Algorithm to take an input String ‘S’
// with length ‘N’, split the string into twostrings
// based on even and odd indexes while left padding
// the sub string with ‘000’ andright padding the substring with ‘111’

var rsl = require("readline-sync");

function crypt(str) {
  var even = "000";
  var odd = "000";
  for (var idx in str) {
    if (idx % 2) odd += str[idx];
    else even += str[idx];
  }
  //   str.split("").forEach((ele, index) => {
  //     if (index % 2) odd += ele;
  //     else even += ele;
  //   });
  even += "111";
  odd += "111";
  return [even, odd];
}

var userInput = rsl.question("Please enter a String : ");

result = crypt(userInput);
console.log(result[0]);
console.log(result[1]);
