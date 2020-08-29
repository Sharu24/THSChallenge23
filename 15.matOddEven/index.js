var rls = require("../node_modules/readline-sync");

var mh, mw, mSize, even, odd;

do {
  mh = rls.questionInt("Enter the height of the Array : ");
  mw = rls.questionInt("Enter the width of the Array : ");
  mSize = mh * mw;
  even = odd = 0;

  for (var i = 0; i < mSize; i++) {
    rls.questionInt(
      `Enter Elements [ Left->Right, Top->Bottom ] , [${i + 1}] : `
    ) % 2
      ? ++odd
      : ++even;
  }

  console.log(`Count of Even Numbers = ${even}`);
  console.log(`Count of Odd Numbers = ${odd}`);
} while (rls.question("Wanna Try Again (y/n) ? : ") === "y" ? true : false);
