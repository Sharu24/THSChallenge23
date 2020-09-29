//--------------------------------------------
// @Description: Storage Module
//--------------------------------------------

const fs = require("fs");
const util = require("util");
const helpers = require("./helpers");
const { getFilePath } = require("./config");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);
const access = util.promisify(fs.access);
const readdir = util.promisify(fs.readdir);

const lib = {};
//-----------------------------------------------------------------------------
// Function to check if a File Exists
//-----------------------------------------------------------------------------
lib.exists = async (dir, fileName) => {
  try {
    let response = await access(getFilePath(dir, fileName), fs.constants.F_OK);
    return {};
  } catch (error) {
    return { Error: "User Not Found / Unable to Access Storage. #Admin" };
  }
};

//-----------------------------------------------------------------------------
// Function to create a new file and write data into it
//-----------------------------------------------------------------------------
lib.create = async (dir, fileName, fileData) => {
  try {
    await writeFile(getFilePath(dir, fileName), JSON.stringify(fileData));
    return {};
  } catch (error) {
    return { Error: "Unable to write into the storage. #Admin" };
  }
};

//-----------------------------------------------------------------------------
// Function to read a file
//-----------------------------------------------------------------------------
lib.read = async (dir, fileName) => {
  try {
    let fileData = await readFile(getFilePath(dir, fileName), "utf-8");
    let parsedData = null;
    if (dir !== "html") {
      parsedData = helpers.parse(fileData);
      if (parsedData.hashPassword) delete parsedData.hashPassword;
    } else {
      parsedData = fileData;
    }
    return parsedData;
  } catch (error) {
    return { Error: "Error while reading Files. #Admin" };
  }
};

//-----------------------------------------------------------------------------
// Function to read a directory
//-----------------------------------------------------------------------------

lib.readdir = async dir => {
  try {
    let fileNames = await readdir(getFilePath(dir));
    return fileNames;
  } catch (error) {
    return { Error: "Error while reading Directories. #Admin" };
  }
};

//-----------------------------------------------------------------------------
// Function to update the file
//-----------------------------------------------------------------------------
lib.update = async (dir, fileName, fileData) => {
  try {
    await writeFile(getFilePath(dir, fileName), JSON.stringify(fileData));
    return {};
  } catch (error) {
    return { Error: "Error while Updating Files. #Admin" };
  }
};

//-----------------------------------------------------------------------------
// Function to append to a file
//-----------------------------------------------------------------------------
lib.append = async (dir, fileName, appendData) => {
  try {
    const fileData = await readFile(getFilePath(dir, fileName), "utf-8");
    let parsedData = helpers.parse(fileData);
    let filterData = [];

    //--- For Multiple attributes, loop through
    for (attr in appendData) {
      //--- For new attributes, append
      if (!parsedData[attr]) {
        parsedData[attr] = appendData[attr];
      } else {
        //--- Pick Only additional values for an attribute
        filterData = appendData[attr].filter(
          value => !parsedData[attr].includes(value)
        );
        if (filterData.length) {
          parsedData[attr] = parsedData[attr].concat(filterData);
        } else {
          return { Error: "There are no additional values to append" };
        }
      }
    }
    //--- Append filtered data set into the file
    parsedData = JSON.stringify(parsedData);
    await writeFile(getFilePath(dir, fileName), parsedData, "utf-8");
    return {};
  } catch (error) {
    // console.log(error);
    return { Error: error || "Unable to Append Data" };
  }
};

//-----------------------------------------------------------------------------
// Function to remove value of Array attribute
//-----------------------------------------------------------------------------
lib.remove = async (dir, fileName, attr, value) => {
  try {
    const fileData = await readFile(getFilePath(dir, fileName), "utf-8");
    let parsedData = helpers.parse(fileData);
    if (parsedData[attr]) {
      let attrArray = parsedData[attr];
      //--- if the value was found in the attribute
      if (attrArray.indexOf(value) !== -1) {
        //--- Pick and Delete the attribute value from the array
        attrArray.splice(attrArray.indexOf(value), 1);
        //--- If there was only one value than its an empty array
        //--- Delete the attribute if empty
        if (attrArray.length) parsedData[attr] = attrArray;
        else delete parsedData[attr];

        const stringData = JSON.stringify(parsedData);

        await writeFile(getFilePath(dir, fileName), stringData);
        return {};
      } else throw { Error: "Attribute Values Not Found" };
    }
  } catch (error) {
    return { Error: error || "Could not remove the user Attribute. #Admin" };
  }
};
//-----------------------------------------------------------------------------
// Function to delete a file
//-----------------------------------------------------------------------------
lib.delete = async (dir, fileName) => {
  try {
    await access(getFilePath(dir, fileName), fs.constants.F_OK);
    await unlink(getFilePath(dir, fileName));
    return {};
  } catch (error) {
    // console.log(error);
    return { Error: "Avenger Does not Exists" };
  }
};

module.exports = lib;
