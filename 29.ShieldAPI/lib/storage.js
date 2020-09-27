const fs = require("fs");
const { getFilePath } = require("./config");
const helpers = require("./helpers");

const lib = {};

//-----------------------------------------------------------------------------
// Function to check if a File Exists
//-----------------------------------------------------------------------------

lib.exists = (dir, fileName, callback) => {
  fs.access(getFilePath(dir, fileName), fs.constants.F_OK, err => {
    if (!err) callback(false);
    else callback("The File Does not Exists / Error In Accessing the File");
  });
};

//-----------------------------------------------------------------------------
// Function to create a new file and write data into it
//-----------------------------------------------------------------------------
lib.create = (dir, fileName, fileData, callback) => {
  fs.open(getFilePath(dir, fileName), "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(fileData);
      fs.writeFile(fileDescriptor, stringData, err => {
        if (!err) {
          fs.close(fileDescriptor, err => {
            /* Everything passes */
            if (!err) callback(false);
            else callback("Error Closing the File");
          });
        } else {
          callback("Error is writing into the file - ", err);
        }
      });
    } else {
      callback("Could not create the file or there may be one already");
    }
  });
};

//------------------------------------------------------
// Function to read a file
//------------------------------------------------------
lib.read = (dir, fileName, callback) => {
  fs.readFile(getFilePath(dir, fileName), "utf-8", (error, fileData) => {
    if (!error && fileData) {
      const parsedData = helpers.parse(fileData);
      callback(false, parsedData);
    } else {
      callback(error, fileData);
    }
  });
};

//------------------------------------------------------
// Function to read all user Data
//------------------------------------------------------
// Promisify fs.readdir
lib.readdirAsync = dir => {
  return new Promise((resolve, reject) => {
    fs.readdir(getFilePath(dir), (error, fileNames) => {
      if (!error) resolve(fileNames);
      else reject(error);
    });
  });
};
// Promisify fs.readFile
lib.readFileAsync = (dir, file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(getFilePath(dir, file), "utf-8", (error, fileData) => {
      if (!error && fileData) {
        const parsedData = helpers.parse(fileData);
        if (parsedData.hashPassword) delete parsedData.hashPassword;
        resolve(parsedData);
      } else reject(error);
    });
  });
};

//------------------------------------------------------
// Function to update the file
//------------------------------------------------------
lib.update = (dir, fileName, fileData, callback) => {
  fs.open(getFilePath(dir, fileName), "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(fileData);
      fs.ftruncate(fileDescriptor, error => {
        if (!error) {
          fs.writeFile(fileDescriptor, stringData, error => {
            if (!error) {
              fs.close(fileDescriptor, error => {
                if (!err) callback(false);
                else callback("Error while closing the file");
              });
            } else {
              callback("Error in Writing data into the file");
            }
          });
        } else {
          callback("Error in truncating file content");
        }
      });
    } else {
      callback("Could not create the file or there may be one already");
    }
  });
};

//------------------------------------------------------
// Function to append to a file
//------------------------------------------------------
lib.append = (dir, fileName, appendData, callback) => {
  fs.readFile(getFilePath(dir, fileName), "utf-8", (error, fileData) => {
    //---
    if (!error && fileData) {
      let parsedData = helpers.parse(fileData);
      let filterData = [];
      //--- If there are multiple attributes, loop them over
      for (attr in appendData) {
        //--- if its a new attribute directly append the data else evaluate values
        if (!parsedData[attr]) {
          parsedData[attr] = appendData[attr];
        } else {
          //--- Pick only additional values for an attribute !!!
          filterData = appendData[attr].filter(
            value => !parsedData[attr].includes(value)
          );
          if (filterData.length) {
            parsedData[attr] = parsedData[attr].concat(filterData);
          } else {
            callback("There are no additional values to append");
            return;
          }
        }
      }
      //--- Stringify data to write back into the file
      const stringData = JSON.stringify(parsedData);
      //--- Append filtered data set into the file
      fs.writeFile(getFilePath(dir, fileName), stringData, "utf-8", error => {
        if (!error) {
          callback(false);
        } else callback("Unable to Append data");
      });
    } else callback("Error while Reading the Data");
  });
};

//------------------------------------------------------
// Function to remove value of Array attribute
//------------------------------------------------------
lib.remove = (dir, fileName, attr, value, callback) => {
  fs.readFile(getFilePath(dir, fileName), "utf-8", (error, fileData) => {
    if (!error && fileData) {
      let parsedData = helpers.parse(fileData);
      if (parsedData[attr]) {
        let attrArray = parsedData[attr];
        if (attrArray.indexOf(value) !== -1) {
          attrArray.splice(attrArray.indexOf(value), 1);
          parsedData[attr] = attrArray;
          const stringData = JSON.stringify(parsedData);
          fs.writeFile(getFilePath(dir, fileName), stringData, err => {
            if (!err) {
              callback(false);
            } else {
              callback("Cannot update data attributes");
            }
          });
        } else {
          callback(`Value ${value} does not exists for ${attr}`);
        }
      } else {
        callback(`Attrubute ${attr} does not exists `);
      }
    } else {
      callback("Cannot Read the File");
    }
  });
};
//------------------------------------------------------
// Function to delete a file
//------------------------------------------------------
lib.delete = (dir, fileName, callback) => {
  fs.unlink(getFilePath(dir, fileName), error => {
    if (!error) callback(false);
    else callback("Error in Deleting the data");
  });
};

module.exports = lib;
