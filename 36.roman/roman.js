/*
----------------------------------------
    override    denom    rem    roman
----------------------------------------
99  Yes  XC      --       9      XC
9   Yes  IX      --       0      XCIX
----------------------------------------
88  No   --      50       48     L
48  Yes  XL      --        8     LXL
8   No   --       5        3     LXLV
3   No   --       1        2     LXLVI
2   No   --       1        1     LXLVII
1   No   --       1        0     LXLVIII
-----------------------------------------

*/
const rls = require("readline-sync");
const lookup = {
  1: "I",
  5: "V",
  10: "X",
  50: "L",
  100: "C",
  500: "D",
  1000: "M"
};

const override = {
  5: [1, "IV"],
  10: [1, "IX"],
  50: [10, "XL"],
  100: [10, "XC"],
  500: [100, "CD"],
  1000: [100, "CM"]
};

var denom = 0,
  rem = 0,
  roman = "",
  romanStr = "";

var dmIndex = -1;

while (1) {
  var num = rls.question("Please enter a Number : ('x' to exit) ");
  if (num == "x") break;

  romanStr = "";
  roman = "";

  var dmArr = Object.keys(lookup);
  if (dmArr.indexOf(num) !== -1) {
    romanStr = lookup[num];
  } else {
    rem = parseInt(num);
    while (rem) {
      dmIndex = dmArr.findIndex(ele => ele - rem > 0);
      denom = dmIndex === -1 ? dmArr[dmArr.length - 1] : dmArr[dmIndex];

      if (
        dmArr[dmIndex - 1] !== rem &&
        rem < denom &&
        rem >= denom - override[denom][0]
      ) {
        rem = rem - (denom - override[denom][0]);
        romanStr += override[denom][1];
        continue;
      } else {
        denom =
          dmArr[dmIndex - 1] === rem
            ? dmArr[dmIndex]
            : dmIndex === -1
            ? dmArr[dmArr.length - 1]
            : dmArr[dmIndex - 1];
        roman = lookup[denom];
      }
      while (rem >= denom) {
        romanStr += roman;
        rem = rem - denom;
      }
    }
  }
  console.log(`Roman Representation for ${num} is : `, romanStr);
}
