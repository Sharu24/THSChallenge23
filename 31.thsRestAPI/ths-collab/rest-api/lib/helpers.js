const crypto = require("crypto");
const config = require("../config");

const helpers = {};

//Hashing the Password for new User
helpers.hash = str => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

//Parse Buffer tp Object
helpers.parseJsonToObject = str => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (err) {
    return {};
  }
};

module.exports = helpers;
