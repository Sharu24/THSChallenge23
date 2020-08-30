var rls = require("../node_modules/readline-sync");
var mSize,
  mCount,
  arr = [];

function identity(arr) {
  var x = 0,
    len = arr.length,
    flag = true;

  for (var i = 0; i < len; i++) {
    ele = arr[i];
    if (!i || i === x + mSize + 1) {
      x = i;
      if (ele !== 1) flag = false;
    } else if (ele) flag = false;
    if (!flag) break;
  }
  return flag;
}

do {
  arr = [];
  console.log("Create a 'm' X 'm' matrix to check if its a Identity Matrix:");
  mSize = rls.questionInt("Please enter the size of the Matrix 'm': ");
  mCount = mSize * mSize;

  do {
    arr.push(
      rls.questionInt(
        `Enter the elements for element ${mSize * mSize - mCount + 1}/${mSize *
          mSize}: `
      )
    );
  } while (--mCount);

  console.log(
    identity(arr) ? "Its an Identity Matrix" : "Its not an Identity Matrix"
  );
} while (rls.question("Wanna Try Again (y/n) ? : ") === "y" ? true : false);
