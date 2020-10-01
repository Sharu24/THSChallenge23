//
const fs = require("fs");
const path = require("path");
const util = require("util");
const { parseJsonToObject } = require("./helpers").parseJsonToObject;

const lib = {};

// Promisify all the Async 'fs' modules
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);

//Base Directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

//------------------------------------------------------------------------------------------
// APPROACH 4
//------------------------------------------------------------------------------------------

//Function to create a new file and insert the data
lib.create = async (dir, file, data) => {
  try {
    const fileName = lib.baseDir + dir + "/" + file + ".json";
    const stringData = JSON.stringify(data);
    await writeFile(fileName, stringData);
    return Promise.resolve(false);
  } catch (error) {
    console.error(error);
    return Promise.reject({ Error: "Couldn't write into Storage!" });
  }
};

//Function to read a file and print the data
lib.read = async (dir, file) => {
  try {
    const fileName = lib.baseDir + dir + "/" + file + ".json";
    const fileData = await readFile(fileName, "utf-8");
    const parsedData = parseJsonToObject(fileData);
    return Promise.resolve(parsedData);
  } catch (error) {
    return Promise.reject("Couldn't read from the Storage!");
  }
};

lib.update = async (dir, file, data) => {
  try {
    //Open the Files
    const fileName = lib.baseDir + dir + "/" + file + ".json";
    const stringData = JSON.stringify(data);
    await writeFile(fileName, stringData);
    return Promise.resolve(false);
  } catch (error) {
    return Promise.reject({ Error: "Couldn't update the Storage" });
  }
};

//Delete the File
lib.delete = async (dir, file) => {
  try {
    const fileName = lib.baseDir + dir + "/" + file + ".json";
    await unlink(fileName);
    return Promise.resolve(false);
  } catch (error) {
    return Promise.reject({ Error: "Couldn't delete from Storage" });
  }
};

//------------------------------------------------------------------------------------------

lib._create = async (dir, file) => {
  try {
    const fileName = lib.baseDir + dir + "/" + file;
    const stringData = JSON.stringify(data);
    await writeFile(fileName, stringData);
    callback(false);
  } catch (error) {
    callback("Error in writing into the file");
  }
};

//------------------------------------------------------------------------------------------
// APPROACH 3
//------------------------------------------------------------------------------------------

//Function to create a new file and insert the data
lib._create = async (dir, file, data) => {
  try {
    const fileName = lib.baseDir + dir + "/" + file + ".json";
    const stringData = JSON.stringify(data);
    await writeFile(fileName, stringData);
    return Promise.resolve(false);
  } catch (error) {
    console.log("error - ", error);
    return Promise.reject({ Error: "Couldn't write into Storage!" });
  }
};

//------------------------------------------------------------------------------------------
// APPROACH 2
//------------------------------------------------------------------------------------------

//Function to create a new file and insert the data
lib.__create = (dir, file, data) => {
  return new Promise((resolve, reject) => {
    const fileName = lib.baseDir + dir + "/" + file + ".json";
    const stringData = JSON.stringify(data);
    fs.writeFile(fileName, stringData, error => {
      if (!err) {
        resolve(false);
      } else {
        console.log("error - ", error);
        return Promise.reject({ Error: "Couldn't write into Storage!" });
      }
    });
  });
};

//------------------------------------------------------------------------------------------
// APPROACH 1
//------------------------------------------------------------------------------------------

//Function to create a new file and insert the data
lib.___create = (dir, file, data, callback) => {
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    (err, fileDescriptor) => {
      // console.log(fileDescriptor); It will give or point to the file reference
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data);
        //Write to file and close the file
        fs.writeFile(fileDescriptor, stringData, err => {
          if (!err) {
            fs.close(fileDescriptor, err => {
              if (!err) {
                callback(false);
              } else {
                callback("Error Closing New File");
              }
            });
          } else {
            callback("Error in Writing to new File!");
          }
        });
      } else {
        callback("Could not create New File, or It may be there already!");
      }
    }
  );
};

/*
//Function to read a file and print the data
lib.read = (dir, file, callback) => {
  fs.readFile(
    lib.baseDir + dir + "/" + file + ".json",
    "utf-8",
    (err, data) => {
      if (!err && data) {
        const parsedData = parseJsonToObject(data);
        callback(false, parsedData);
      } else {
        callback(err, data);
      }
    }
  );
};

//Function to Update the File Contents

lib.update = (dir, file, data, callback) => {
  //Open the Files
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data);
        //Truncate the file
        fs.ftruncate(fileDescriptor, err => {
          if (!err) {
            //We can write to the file and close it
            fs.writeFile(fileDescriptor, stringData, err => {
              if (!err) {
                fs.close(fileDescriptor, err => {
                  if (!err) {
                    callback(false);
                  } else {
                    callback("Error in Closing File");
                  }
                });
              } else {
                callback("Error in Writing File");
              }
            });
          } else {
            callback("Error in truncating File");
          }
        });
      } else {
        callback("Could not open the file for update");
      }
    }
  );
};

//Delete the File
lib.delete = (dir, file, callback) => {
  //Unlinking or deleting
  fs.unlink(lib.baseDir + dir + "/" + file + ".json", err => {
    if (!err) {
      callback(false);
    } else {
      callback("Error in Deleting File");
    }
  });
};
*/

module.exports = lib;
