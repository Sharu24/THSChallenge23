//jshint esversion:7
var rls = require("readline-sync");

console.log("");
console.log(" ----- Objective: Write an Algorithm to encrypt and decrypt ---");
console.log(" ------ an input string using XOR CipherAlgorithm -------------");
console.log("");

function bxor(userBin, userKey) {
  if (userBin.length === 0) return "";
  else
    return (
      bxor(
        userBin.slice(0, userBin.length - 1),
        userKey.slice(0, userKey.length - 1)
      ) +
      "" +
      (userBin[userBin.length - 1] ^ userKey[userKey.length - 1])
    );
}

function getASCII(str) {
  var userArr = str.split("");
  // console.log(userArr);
  var userAscci = userArr.map(ele => {
    return ele.charCodeAt(0);
  });
  return userAscci;
}

function getBin(num) {
  if (num === 0) return 0;
  else return getBin(Math.floor(num / 2)) + "" + (num % 2);
}

function getBinary(userAscci) {
  var outArr = [];
  //   console.log(userAscci);
  userAscci.forEach(ele => {
    outArr.push(getBin(Number(ele)).padStart(8, "0"));
  });
  return outArr;
}

function getEnDec(userEncryt) {
  var i;
  var outArr = [];
  userEncryt.forEach(ele => {
    i = 0;
    function getDec(ele, i) {
      if (ele === 0) return 0;
      else return (ele % 10) * 2 ** i + getDec(Math.floor(ele / 10), ++i);
    }
    outArr.push(getDec(ele, i));
  });
  return outArr;
}

function getEnChar(userEnDec) {
  outArr = [];
  outArr = userEnDec.map(ele => {
    return String.fromCharCode(ele);
  });
  return outArr;
}

function encrypt(userInp, key) {
  var userAscci = getASCII(userInp);
  var keyAscci = getASCII(key);

  var userBin = getBinary(userAscci);
  // console.log(userBin);
  var userStr = userBin.join("");
  // console.log(userStr);
  var keyBin = getBinary(keyAscci).join("");
  keyBin = keyBin.repeat(userBin.length);
  // console.log(keyBin);
  // console.log(keyBin, keyBin);
  var userXor = bxor(userStr, keyBin);
  var userEncryt = userXor.match(/.{1,8}/g);
  // console.log(userEncryt);
  var userEnDec = getEnDec(userEncryt);
  // console.log(userEnDec);
  var userEnChr = getEnChar(userEnDec);
  // console.log(userEnChr.join(""));
  return userEnChr.join("");
}

do {
  var userInp = rls.question("Please enter a String to Encrypt/Decrypt : ");
  var key = rls.question("Enter Key : ");

  console.log(key.keCode);

  var encryptedStr = encrypt(userInp, key);
  console.log("Out Encrypted/Decrypted String:", encryptedStr);
} while (rls.question("Wanna Try Again (y/n) ? : ") === "y" ? true : false);
