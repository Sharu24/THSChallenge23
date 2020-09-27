/*
This file contains global config variables
*/

const path = require("path");

const environments = {};

environments.staging = {
  httpPort: 4000,
  httpsPort: 4001,
  envName: "staging",
  hashingSecret: "theHackingSchool"
};

environments.prod = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "prod",
  hashingSecret: "theHackingSchool"
};

// PORT=9999 nodemon index.js

// decide which environment to be exported to
const currentEnvironment =
  typeof process.env.NODE_ENV === "string"
    ? process.env.NODE_ENV.toLocaleLowerCase()
    : "";
// NODE_ENV=production nodemon index.js
// nodemon index.js

// Check if the environment is defined
// Else if none passed, Default to Staging Mode
const getEnv =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

const baseDir = path.join(__dirname, "/../.data/");

const getFilePath = (dir, file) =>
  file ? baseDir + dir + "/" + file + ".json" : baseDir + dir;

const acceptableMethods = ["get", "post", "put", "delete"];

const statusCodes = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INVALID_METHOD: 405,
  SERVER_ERROR: 500
};

module.exports = {
  getEnv,
  getFilePath,
  acceptableMethods,
  statusCodes
};
