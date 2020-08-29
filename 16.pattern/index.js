var rls = require("../node_modules/readline-sync");

function buildPattern(num, i = 1, tmp = 1) {
  if (!num) return;
  else {
    console.log(tmp);
    buildPattern(--num, ++i, i + "" + tmp);
  }
}
do {
  var pSize = rls.questionInt("Enter Number of Elements : ");
  buildPattern(pSize);
} while (rls.question("Wanna Try Again (y/n) ? : ") === "y" ? true : false);

// for (var i = 0; i < pSize; i++) {
//   console.log(`${i}`.repeat(i + 1));
// }
