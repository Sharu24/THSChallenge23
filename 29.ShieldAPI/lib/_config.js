/*
This file contains global config variables
*/

const path = require("path");

//-----------------------------------------------------------------------------
// Configure Environments
//-----------------------------------------------------------------------------
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

//-----------------------------------------------------------------------------
// Set Base Directory and file path for storage
//-----------------------------------------------------------------------------
const baseDir = path.join(__dirname, "/../.data/");
const staticDir = path.join(__dirname, "/../static/");

const getFilePath = (dir, file) => {
  console.log("-----", dir, file);
  if (dir === "html") return getStaticPath(dir, file);
  else return file ? baseDir + dir + "/" + file + ".json" : baseDir + dir;
};

const getStaticPath = (dir, file) =>
  file
    ? staticDir + dir + "/" + file + ".html"
    : staticDir + dir + "/index.html";

//-----------------------------------------------------------------------------
// Define Acceptable Methods for Accessing API Data
//-----------------------------------------------------------------------------
const acceptableMethods = ["get", "post", "put", "delete"];

//-----------------------------------------------------------------------------
// Response HTTP Status Codes
//-----------------------------------------------------------------------------
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
  getStaticPath,
  acceptableMethods,
  statusCodes
};
