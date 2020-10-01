const fs = require("fs");
const util = require("util");
const path = require("path");
const { parseJsonToObject } = require("./helpers");

const lib = {};

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const unLink = util.promisify(fs.unlink);

//Base Directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

//Function to create and insert the data into a File
lib.create = async (dir, file, data, callback) => {
  const stringData = JSON.stringify(data);
  //Write to file
  try {
    await writeFile(lib.baseDir + dir + "/" + file + ".json", stringData);
    callback(false);
  } catch (err) {
    callback("Error in Writing to new File!");
  }
};

//Function to read a file and print the data
lib.read = async (dir, file) => {
  try {
    const data = await readFile(
      lib.baseDir + dir + "/" + file + ".json",
      "utf-8"
    );
    const parsedData = parseJsonToObject(data);
    return Promise.resolve(parsedData);
  } catch (err) {
    return Promise.reject(err);
  }
};

//Function to Update the File Contents
lib.update = async (dir, file, data, callback) => {
  const stringData = JSON.stringify(data);
  //Write to file and close the file
  try {
    await writeFile(lib.baseDir + dir + "/" + file + ".json", stringData);
    callback(false);
  } catch (err) {
    callback("Error in Writing to new File!");
  }
};

//Delete the File
lib.delete = async (dir, file, callback) => {
  //Unlinking or deleting
  try {
    await unLink(lib.baseDir + dir + "/" + file + ".json");
    callback(false);
  } catch (err) {
    callback("Error in Deleting File");
  }
};

module.exports = lib;
