/**
 * This file contains global config variables
 */

const path = require("path");

//-----------------------------------------------------------------------------
// Configure Environments
//-----------------------------------------------------------------------------
const environments = {
  hashingSecret: "theHackingSchool"
};

//-----------------------------------------------------------------------------
// Set Base Directory and file path for storage
//-----------------------------------------------------------------------------
const baseDir = path.join(__dirname, "/../.data/");
const staticDir = path.join(__dirname, "/../static/");

const getFilePath = (dir, file) => {
  // console.log("-----", dir, file);
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

//-----------------------------------------------------------------------------
// Get Object Keys
//-----------------------------------------------------------------------------
const getObjectKey = value => {
  return Object.keys(statusCodes).find(attr => statusCodes[attr] === value);
};

module.exports = {
  environments,
  getFilePath,
  getStaticPath,
  acceptableMethods,
  statusCodes,
  getObjectKey
};
