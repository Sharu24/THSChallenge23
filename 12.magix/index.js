var rls = require("readline-sync");

/* ********************************************************************* */
function checkMagix(magix, mSize) {
  var i = 0,
    j = 0,
    sum = Array(mSize * 2 + 2).fill(0);
  count = mSize * mSize;
  for (var x = 0; x < count; x++) {
    if ((x + 1) % mSize === 1 || mSize === 1) {
      j = 0;
      i = mSize === 1 ? 0 : Math.floor((x + 1) / mSize);
    }
    val = magix[i][j];
    sum[i] += val; // row
    sum[mSize + j] += val; // column
    if (i === j) sum[mSize * 2] += val; // lr diagonal
    if (i === mSize - 1 - j) sum[mSize * 2 + 1] += val; // rl diagonal
    j++;
  }
  //   console.log(sum);
  return sum.every(ele => ele === sum[0]) ? true : false;
}

/* ********************************************************************* */

var magix, i, j, val;
do {
  (magix = []), (i = 0), (j = 0), (val = 0);
  var mSize = rls.questionInt("Please enter the size of the matrix :");
  var mCount = mSize * mSize;
  for (var k = 1; k <= mCount; k++) {
    if (k % mSize === 1 || mSize === 1) {
      j = 0;
      i = mSize === 1 ? 0 : Math.floor(k / mSize);
      magix[i] = new Array(2);
    }
    val = rls.questionInt(`Please Enter the Element:`);
    magix[i][j] = val;
    j++;
  }

  console.log(
    checkMagix(magix, mSize) ? "Its a Magic Square" : "Its not a Magix Square"
  );
} while (rls.question("Wanna Try Again (y/n) ? : ") === "y" ? true : false);
