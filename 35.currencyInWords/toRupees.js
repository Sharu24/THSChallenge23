const rls = require("readline-sync");

const elvs = [
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
let factors = {
  2: "hundred",
  3: "thousand",
  5: "lakh",
  7: "crores"
};

var repeatChecker = 0;
var currencyText = "";
var temp = "",
  fact = "";

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

  // console.log(userInput);

  currencyText = "";
  temp = "";
  fact = "";
  oneDigit = 0;
  repeatChecker = 0;

  input = userInput
    .split("")
    .reverse()
    .filter(ele => !isNaN(parseInt(ele)))
    .join("");

  // console.log("formatted = ", input);
  for (var i = 0; i < input.length; i++) {
    digit = parseInt(input[i]);
    repeatChecker++;
    if (Object.keys(factors).indexOf(i.toString()) !== -1) {
      fact = factors[i];
    }
    if (digit !== 0) {
      if (repeatChecker === 1) {
        oneDigit = digit;
        temp = elvs[digit][0] + " " + temp;
      }
      if (repeatChecker === 2) {
        if (digit === 1) {
          temp =
            oneDigit === 0
              ? elvs[digit][2] + " "
              : oneDigit === 1 || oneDigit === 2
              ? elvs[oneDigit][1] + " "
              : elvs[oneDigit][1] + "een ";
        } else {
          temp =
            (digit === 2 ? elvs[digit][2] : elvs[digit][1] + "y") + " " + temp;
        }
      }
    }
    if (
      repeatChecker === 3 ||
      (repeatChecker === 2 && i >= 2) ||
      i == input.length - 1
    ) {
      if (temp || repeatChecker === 3)
        temp =
          repeatChecker !== 3
            ? " " + temp + " " + fact
            : digit > 0
            ? " " + elvs[digit][0] + " " + fact + " " + temp
            : " " + temp;

      repeatChecker = 0;
      currencyText = temp + currencyText;
      temp = "";
    }
  }

  console.log(
    `${userInput} = ` +
      currencyText
        .replace(/ +/g, " ")
        .split(" ")
        .map(ele => ele.charAt(0).toUpperCase() + ele.substring(1))
        .join(" ") +
      " Rupees Only"
  );
}
