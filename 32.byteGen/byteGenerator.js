const rls = require("readline-sync");
/**
 * Choose a encoding style:
 * 1. ASCII ( fixed 8 bit Byte )
 * 2. UTF-8 ( 8-bit variable Byte encoding)
 */

const bRange = {
  "1": [33, 127],
  "2": [128, 2047],
  "3": [2048, 65535],
  "4": [65536, 1114111]
};

var genRandomNum = range => {
  if (!range[0]) range[0] = 0;
  return parseInt(Math.random() * (range[1] - range[0] + 1)) + range[0];
};

var evalRemainingBytes = (requestedBytes, consumedBytes) => {
  remainingBytes = requestedBytes - consumedBytes;
  if (remainingBytes < 4) return remainingBytes;
  else return genRandomNum([4, 1]);
};

while (1) {
  const encodingStyle = rls.question(
    "Choose Encoding Type (1. ASCII, 2. UTF-8) - press x to quit : "
  );

  if (encodingStyle == "x") {
    break;
  } else if (encodingStyle && encodingStyle !== "1" && encodingStyle !== "2") {
    userChoice = rls.question(
      "Invalid Input ..press x to exit and any key to continue : "
    );
    if (userChoice === "x") break;
    else continue;
  }

  const requestedBytes = rls.question(
    "Input Number of bytes - press x to quit : "
  );

  if (requestedBytes == "x") {
    break;
  } else if (isNaN(requestedBytes)) {
    userChoice = rls.question(
      "Invalid Input ..press x to exit and any key to continue : "
    );
    if (userChoice === "x") break;
    else continue;
  }

  let consumedBytes = 0;
  let outputString = "";

  if (encodingStyle == "1") {
    while (consumedBytes < requestedBytes) {
      let randomChar = String.fromCharCode(genRandomNum(bRange[1]));
      outputString += randomChar;
      consumedBytes = consumedBytes + 1;
    }
  } else if (encodingStyle == "2") {
    let randomBytes = 0;
    while (consumedBytes < requestedBytes) {
      randomBytes = evalRemainingBytes(requestedBytes, consumedBytes);
      randomChar = String.fromCharCode(genRandomNum(bRange[randomBytes]));
      outputString += randomChar;
      consumedBytes = consumedBytes + randomBytes;
    }
  }

  console.log(outputString);
}
