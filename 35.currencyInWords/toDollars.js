const rls = require("readline-sync");

function toDollars(input) {
  const dollar = {
    2: "hundred",
    3: "thousand",
    6: "million",
    9: "billion"
  };
  const words = [
    ["zero"],
    ["one", "eleven", "ten"],
    ["two", "twelve", "twenty"],
    ["three", "thirt"],
    ["four", "fourt"],
    ["five", "fivt"],
    ["six", "sixt"],
    ["seven", "sevent"],
    ["eight", "eight"],
    ["nine", "ninet"]
  ];
  let oneDigit = -1,
    temp = "",
    rInd = 0,
    myDollars = "",
    postfix = "";

  if (input == 0) return words[input][0];

  for (var i = 0; i < input.length; i++) {
    digit = parseInt(input[i]);

    if (dollar[i]) postfix = dollar[i];

    /** -----------------------------------------------  */

    ++rInd;

    if (rInd === 1) {
      //--- Pair's first Digit
      oneDigit = digit;
      if (digit !== 0) temp = " " + words[oneDigit][0];
    } else if (rInd == 2) {
      //--- Pair's second digit
      if (digit === 0) continue;
      if (digit === 1) {
        if (oneDigit === 0) {
          temp = " " + words[digit][2];
        } else if (oneDigit === 1 || oneDigit === 2) {
          temp = " " + words[oneDigit][1];
        } else {
          temp = " " + words[oneDigit][1] + "een";
        }
      } else {
        if (digit === 2) {
          temp = words[digit][2] + " " + temp;
        } else {
          temp = words[digit][1] + "y" + " " + temp;
        }
      }
    } else if (rInd === 3) {
      //--- Pair's thrid digit
      if (digit !== 0) {
        temp = words[digit][0] + " " + dollar[rInd - 1] + " " + temp;
      }
    }

    /** -----  */
    // 1. If you have traversed all the digits in the input
    // 2. If you have reached denomination ( thousand, million, billion..)
    // 3. If its the end of a pair of hundred's
    /** -----  */
    if (i === input.length - 1 || rInd === 3) {
      if (i > 2) {
        myDollars = temp + " " + (temp ? postfix : "") + " " + myDollars;
      } else {
        myDollars = temp + " " + myDollars;
      }
      if (rInd === 3) rInd = 0;
      temp = "";
    }
  }
  return myDollars;
}

let formatInput = input => {
  return input
    .split("")
    .reverse()
    .filter(ele => !isNaN(parseInt(ele)))
    .join("");
};

let formatOutput = output => {
  return (
    output
      .replace(/ +/g, " ")
      .split(" ")
      .map(ele => ele.charAt(0).toUpperCase() + ele.substring(1))
      .join(" ") + " Dollars Only"
  );
};

/** ------------------------------------------------------------ */

while (1) {
  var userInput = rls.question(
    "Enter a Number to convert (enter 'q' to quit) : "
  );

  if (userInput === "q") {
    break;
  } else {
    if (isNaN(parseInt(userInput))) {
      console.log("Incorrect number.. Please try again (enter 'q' to quit) : ");
      continue;
    }
  }

  input = formatInput(userInput);

  let dollarText = toDollars(input);

  console.log(`${userInput}` + " In Dollars = ", formatOutput(dollarText));
}
