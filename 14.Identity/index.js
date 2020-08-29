var rls = require("../node_modules/readline-sync");
var i, j, flag, mSize, flag;

do {
  i = j = 0;
  flag = true;
  mSize = rls.questionInt("Please enter the size of the Matrix : ");
  mCount = mSize * mSize;

  do {
    var ele = rls.questionInt(
      `Enter the elements for element ${mSize * mSize - mCount + 1}/${mSize *
        mSize}: `
    );
    if (!i || i === j + mSize + 1) {
      j = i;
      if (ele !== 1) flag = false;
    } else if (ele) flag = false;
    i++;
  } while (--mCount);

  console.log(flag ? "Its an Identity Matrix" : "Its not an Identity Matrix");
} while (rls.question("Wanna Try Again (y/n) ? : ") === "y" ? true : false);

/*
while (mCount) {
  var ele = Number(rsl.question(`Enter the elements for ${i}st row: `));
  if (i === 1 || i === j + mSize + 1) {
    j = i;
    if (ele !== 1) flag = false;
  } else if (ele !== 0) flag = false;
  i++;
  mCount--;
}
*/
