const crypto = require("crypto");
const { environments } = require("./config");

const helpers = {};

//-----------------------------------------------------------------------------
//--- Hashing the password for the new user
helpers.hash = str => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", environments.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

//-----------------------------------------------------------------------------
//--- Parse Buffer String to get JSON Objects
helpers.parse = message => {
  if (typeof message === "string") {
    return JSON.parse(message);
  } else {
    return {};
  }
};

//-----------------------------------------------------------------------------
//--- Fetch Duration of the Join Date
helpers._getDuration = (pastDate, futureDate) => {
  let years = 0,
    months = 0,
    days = 0;

  if (futureDate - pastDate === 0) {
    return { years, months, days };
  }
  //--- Initialize and format Join Date and Current Date
  pastDate = new Date(pastDate);
  let pYear = pastDate.getFullYear();
  let pMonth = pastDate.getMonth();
  let pDate = pastDate.getDate();

  // let currentDate = new Date(Date.now());
  let fYear = futureDate.getFullYear();
  let fMonth = futureDate.getMonth();
  let fDate = futureDate.getDate();

  //--- based on if future year is a Leap Year or not,
  //--- get the month days for february
  let feb = fYear % 4 ? 28 : fYear % 100 ? 29 : 28;
  let mts = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  //--- get Difference in Years
  years = fYear - pYear;

  //--- get Difference in Months
  if (fMonth - pMonth < 0) {
    years--; // As future Date's Month has not reached Past Date's Month
    months = 11 - fMonth + pMonth;
  } else {
    months = fMonth - pMonth;
  }

  //--- get Difference in Days
  if (fDate - pDate < 0) {
    months--; // As future Date has not reached Past Date
    days = mts[fMonth] - fDate + pDate - 1; // Exclude that future Day (-1)
  } else {
    days = fDate - pDate;
  }

  return { years, months, days };
};

module.exports = helpers;
