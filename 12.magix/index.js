var rls = require("../node_modules/readline-sync");
var magix, i, j, val;

do {
  (magix = []), (i = 0), (j = 0), (val = 0);
  var mSize = rls.questionInt("Please enter the size of the matrix :");

  var sum = Array(mSize * 2 + 2).fill(0);

  var mCount = mSize * mSize;

  for (var k = 1; k <= mCount; k++) {
    // Every row reset iter and initialize magix
    if (k % mSize === 1) {
      j = 0;
      i = Math.floor(k / mSize);
      magix[i] = new Array(2);
    }
    val = rls.questionInt(`Please Enter Element #[${i}][${j}] :`);

    magix[i][j] = val;

    sum[i] += val; // row
    sum[mSize + j] += val; // column
    if (i === j) sum[mSize * 2] += val; // lr diagonal
    if (i === mSize - 1 - j) sum[mSize * 2 + 1] += val; // rl diagonal

    j++;
  }
  console.log(magix);
  console.log(
    sum.every(ele => ele === sum[0])
      ? "Its a Magic Square"
      : "Its not a Magix Square"
  );
} while (rls.question("Wanna Try Again (y/n) ? : ") === "y" ? true : false);
