var vnum = require("../00.validations/validateNum");
var rls = require("../node_modules/readline-sync");

console.log("");
console.log("-----------------------------------------------");
console.log(" Objective: To check if the list of numbers has");
console.log(" 1. Prime Numbers ");
console.log(" 2. Narcissistic Numbers");
console.log(" 3. Remove these elements and display the Array");
console.log("-----------------------------------------------");
console.log("");

/*-----------------------------------------------*/
function checkPrime(num) {
  for (var i = 2; i <= num ** 0.5; i++) {
    if (num % i === 0) return false;
    else return true;
  }
  if (i === num || num === 1) return true;
}
/*-----------------------------------------------*/
function checkNar(num) {
  var len = String(num).length;
  var sumNar = (num, len) =>
    !num ? 0 : (num % 10) ** len + sumNar(Math.floor(num / 10), len);
  return sumNar(num, len) === num ? true : false;
}
/*-----------------------------------------------*/
var inp, outArr, pCount, isPrime, nCount, isNar;
var pArr, nArr;
do {
  outArr = [];
  pArr = [];
  nArr = [];
  (pCount = nCount = 0), (isPrime = isNar = false);

  while (1) {
    inp = rls.question("Enter the number (Enter 'd' when your done) : ");
    if (inp === "d") {
      break;
    } else if (!vnum(inp, "AC")) {
      console.log("Please enter a valid number ...");
      continue;
    } else if (inp) {
      isPrime = checkPrime(Number(inp));
      if (isPrime) pCount++, pArr.push(inp);
      isNar = checkNar(Number(inp));
      if (isNar) nCount++, nArr.push(inp);
      if (!isPrime && !isNar) outArr.push(inp);
    }
  }
  console.log(``);
  console.log(`---------------------------------------------------`);
  console.log(`Result`);
  console.log(`  Prime Number Count        : ${pCount}, [${pArr}]`);
  console.log(`  Narcissistic Number Count : ${nCount}, [${nArr}]`);
  console.log(
    `  The Updated Array         : ${
      outArr.length ? "[" + outArr + "]" : "--Empty--"
    }`
  );
  console.log(``);
} while (rls.question("Wanna Try Again (y/n) ? : ") === "y" ? true : false);
