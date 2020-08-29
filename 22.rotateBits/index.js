/*
22 Write an algorithm to rotate the bits of a given input number.
Bit Rotation​: A rotation (or circular shift) is an operation similar 
to shift except that thebits that fall off at one end are put back 
to the other end.
In left rotation, the bits that fall off at left 
end are put back at right end.In right rotation, the bits that fall 
off at right end are put back at left end.

Example :Left Rotation of 16 by 2 is 64
Right Rotation of 16 by 2 is 4
*/

var rls = require("../node_modules/readline-sync");
var num, rot, dir, str, res;

function rotateBit(bin, rot, dir) {
  var len = bin.length;
  if (dir === "l") return bin.substring(rot, len) + bin.substring(0, rot);
  else if (dir === "r")
    return bin.substring(len - rot, len) + bin.substring(0, len - rot);
  else return bin;
}

function padNum(num, len, ch) {
  if (num.length >= len) return num;
  else return padNum(ch + "" + num, len, ch);
}

do {
  num = Number(rls.question("Enter a number to be rotated : "));
  rot = Number(rls.question("Enter the Number of bits to be rotated by : "));
  dir = rls.question("Enter the rotation direction : ");

  str = padNum(num.toString(2), 8, 0);
  console.log(str);

  res = rotateBit(str, rot, dir);
  console.log(res);
  console.log(
    `Rotating ${num}, ${
      dir == "l" ? "left" : "right"
    }, by ${rot} rotations : ${parseInt(res, 2)}`
  );
} while (rls.question("Wanna Try Again (y/n) ? : ") === "y" ? true : false);
