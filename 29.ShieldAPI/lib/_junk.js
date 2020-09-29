//------------------------------------------------------
// Function to append to a file
//
//------------------------------------------------------
lib._append = (dir, fileName, appendData, callback) => {
  fs.readFile(getFilePath(dir, fileName), "utf-8", (error, fileData) => {
    console.log("~~~~~~ lib.append readFile STARTS~~~~~~~~ ");
    if (!error && fileData) {
      // console.log(helpers.parse(appendData));
      let parsedData = helpers.parse(fileData);
      console.log(appendData, parsedData);
      for (attr in appendData) {
        console.log(attr, appendData[attr], "---", parsedData[attr]);
        if (!parsedData[attr]) {
          parsedData[attr] = appendData[attr];
        } else {
          callback("Data Already Exists. Please invoke Update");
          return;
        }
      }

      const stringData = JSON.stringify(parsedData);

      fs.writeFile(getFilePath(dir, fileName), stringData, "utf-8", error => {
        if (!error) {
          callback(false);
        } else callback("Unable to Append data");
      });
    } else callback("Error while Reading the Data");
  });
};

console.log(url.parse(request.url));
//query params
console.log(url.parse(request.url).query);
console.log(url.parse(request.url, true).query);
console.log(url.parse(request.url, true).query.fname);
//pathname
console.log(url.parse(request.url, true).pathname);
console.log(url.parse(request.url, true).pathname.replace(/^\/+|\/+\$/g, ""));
//method
console.log(request.method);
console.log(request.method.toLowerCase());
// headers
console.log(request.headers);

// for (userAttr in data.payload) {
// console.log(userAttr);
// eval(
// "var " +
// userAttr +
// "= validate." +
// userAttr +
// "(data.payload." +
// userAttr +
// ")"
// );
// }

/*
    _data.readFiles("users", (err, data) => {
      if (!err && data) {
        delete data.hashPassword;
        data.forEach(userRecord => console.log(userRecord));
        callback(statusCodes.SUCCESS, data);
      } else {
        callback(statusCodes.BAD_REQUEST, {
          Error: "There are no registered users"
        });
      }
    });
    */

lib.readFiles = (dir, callback) => {
  fs.readdir(getFilePath(dir), (error, fileNames) => {
    if (!error && fileNames) {
      fileNames.forEach(file => {
        // console.log(getFilePath(dir));
        fs.readFile(getFilePath(dir, file), "utf-8", (error, fileData) => {
          // console.log("\$\$\$\$\$\$\$\$\$\$\$");
          console.log(file, fileData);
          if (!error && fileData) {
            callback(false, fileData);
          } else {
            callback(error, fileData);
          }
        });
      });
      // for (var i = 0; i < files.length; i++) {}
    } else {
      callback(error, files);
    }
  });
};

helpers.getDuration = joinDate => {
  const currentDate = Date.now();
  let delta = currentDate - joinDate;
  console.log(currentDate, joinDate, delta);
  years = Math.floor(delta / (1000 * 60 * 60 * 24 * 365));
  delta = delta % (1000 * 60 * 60 * 24 * 365);
  months = Math.floor(delta / (1000 * 60 * 60 * 24 * 30));
  delta = delta % (1000 * 60 * 60 * 24 * 30);
  days = Math.floor(delta / (1000 * 60 * 60 * 24));
  delta = delta % (1000 * 60 * 60 * 24);
  hours = Math.floor(delta / (1000 * 60 * 60));

  return { years, months, days, hours };
};

// lib.create = (dir, fileName, fileData, callback) => {
//   fs.open(getFilePath(dir, fileName), "wx", (err, fileDescriptor) => {
//     if (!err && fileDescriptor) {
//       const stringData = JSON.stringify(fileData);
//       fs.writeFile(fileDescriptor, stringData, err => {
//         if (!err) {
//           fs.close(fileDescriptor, err => {
//             /* Everything passes */
//             if (!err) callback(false);
//             else callback("Error Closing the File");
//           });
//         } else {
//           callback("Error is writing into the file - ", err);
//         }
//       });
//     } else {
//       callback("Could not create the file or there may be one already");
//     }
//   });
// };

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

fs.unlink(getFilePath(dir, fileName), error => {
  if (!error) callback(false);
  else callback("Error in Deleting the data");
});

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



--- 29 sep

routes._users.get = (data, callback) => {
  //---
  // GET - To get an Avenger,
  // Request Query Param - Mobile Number, Request Body - NA
  let { mobileNumber } = data.queryObject;
  if (mobileNumber) {
    mobileNumber = validate.mobileNumber(mobileNumber);
    if (mobileNumber.value) {
      _data.read("users", mobileNumber.value, (err, data) => {
        if (!err && data) {
          delete data.hashPassword;
          callback(statusCodes.SUCCESS, data);
        } else {
          callback(statusCodes.BAD_REQUEST, {
            Error: "There is no user with this Phone Number"
          });
        }
      });
    }
  }
  //---
  // GET - To get ALL Avengers,
  // Request Query Param - NA, Request Body - NA
  else {
    // Since there are multiple Data Storage Objects(Files)
    // And they all needs to be fetched and displayed at once,
    // Promisify all the reads from the Data Storage
    // So that once the reads are complete, User Array Object will be sent back
    _data
      .readdirAsync("users")
      .then(fileNames => {
        return Promise.all(
          fileNames.map(fileName =>
            _data.readFileAsync("users", fileName.split(".")[0])
          )
        );
      })
      .then(files => {
        callback(statusCodes.SUCCESS, files);
      })
      .catch(error => {
        // console.error(error);
        callback(statusCodes.SERVER_ERROR, {
          Error: "Something went while fetching Avengers data"
        });
      });
  }
};


lib._read = async (dir, fileName, callback) => {
  try {
    let fileData = await readFile(getFilePath(dir, fileName), "utf-8");
    if (dir !== "html") fileData = helpers.parse(fileData);
    callback(false, fileData);
  } catch (error) {
    callback(error, null);
  }
};


//-----------------------------------------------------------------------------
// Function to read all user Data
//-----------------------------------------------------------------------------
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



routes._users.delete = (data, callback) => {
  // let {mobileNumber} = data.queryObject.mobileNumber;
  const mobileNumber = validate.mobileNumber(data.queryObject.mobileNumber);

  if (mobileNumber.valid) {
    _data.read("users", mobileNumber.value, (err, data) => {
      if (!err && data) {
        _data.delete("users", mobileNumber.value, err => {
          if (!err) {
            callback(SUCCESS, `Avenger ref# ${mobileNumber.value} deleted`);
          } else {
            // console.error(err);
            callback(SERVER_ERROR, "Cannot Delete Avenger. Contact Admin");
          }
        });
      } else {
        callback(BAD_REQUEST, "Avenger Does not Exists");
      }
    });
  } else {
    callback(SUCCESS, "Mobile Number is invalid");
  }
};


routes._users.post = (data, callback) => {
  let {
    firstName,
    lastName,
    mobileNumber,
    emailAddress,
    userPassword,
    tcAgreement
  } = data.payload ? data.payload : data;

  //--- check if all the required fields are sent from the paylaod
  mobileNumber = validate.mobileNumber(
    data.payload ? mobileNumber : data.mobileNumber
  );
  firstName = validate.firstName(data.payload ? firstName : data.firstName);
  lastName = validate.lastName(data.payload ? lastName : data.lastName);
  emailAddress = validate.emailAddress(
    data.payload ? emailAddress : data.emailAddress
  );
  userPassword = validate.userPassword(
    data.payload ? userPassword : data.userPassword
  );
  tcAgreement = validate.tcAgreement(
    data.payload ? tcAgreement : data.tcAgreement
  );

  if (
    firstName.valid &&
    lastName.valid &&
    mobileNumber.valid &&
    emailAddress.valid &&
    userPassword.valid &&
    tcAgreement.valid
  ) {
    _data
      .exists("users", mobileNumber.value)
      .then(response => {

      })
      .catch(error => {});
    _data.exists("users", mobileNumber.value, err => {
      if (err) {
        //--- Hash the password
        const hashPassword = helpers.hash(userPassword.value);
        if (hashPassword) {
          //--- Create the Final User Object to store in the disk
          const userObject = {
            firstName: firstName.value,
            lastName: lastName.value,
            mobileNumber: mobileNumber.value,
            emailAddress: emailAddress.value,
            hashPassword: helpers.hash(userPassword.value),
            tcAgreement: tcAgreement.value,
            _id: Date.now()
          };
          _data.create("users", mobileNumber.value, userObject, err => {
            if (!err) {
              callback(SUCCESS, `Agenger #${mobileNumber.value} registered`);
            } else {
              callback(SERVER_ERROR, "Avenger couldn't be created. #Admin");
            }
          });
        } else {
          callback(SERVER_ERROR, "Could Not Crypt the Password. #Admin");
        }
      } else callback(BAD_REQUEST, `Avenger with those details already exists`);
    });
  } else {
    let errorMessage = {};
    if (!firstName.valid) errorMessage.firstName = firstName.message;
    if (!lastName.valid) errorMessage.lastName = lastName.message;
    if (!mobileNumber.valid) errorMessage.mobileNumber = mobileNumber.message;
    if (!emailAddress.valid) errorMessage.emailAddress = emailAddress.message;
    if (!userPassword.valid) errorMessage.userPassword = userPassword.message;
    if (!tcAgreement.valid) errorMessage.tcAgreement = tcAgreement.message;

    callback(statusCodes.BAD_REQUEST, { Error: errorMessage });
  }
};


if (!data.queryObject) {
  // Since there are multiple Data Storage Objects(Files), Promisify all
  _data
    .readdir("users")
    .then(fileNames => {
      return Promise.all(
        fileNames.map(fileName => _data.read("users", fileName.split(".")[0]))
      );
    })
    .then(users => {
      callback(SUCCESS, users);
    })
    .catch(error => {
      // console.error(error);
      callback(SERVER_ERROR, "Something went while fetching Avengers data");
    });
}
};


put - 

if (data.queryObject.mobileNumber) {
  const mobileNumber = validate.mobileNumber(data.queryObject.mobileNumber);

  if (mobileNumber.valid) {
    //---
    // PUT - To Add or Append Hobbies
    // If Hobbies are bassed in the request body than the same will be evaluated.
    // If Hobbies were already added, it will append additional values if any
    // If hobbies were never added it will just add the Hobby Array
    //---
    if (data.payload.hobbies && !data.queryObject.hobbies) {
      // Validate Hobbies
      _data
        .append("users", mobileNumber.value, data.payload)
        .then(response => callback(SUCCESS, "Data Appended Successfully"))
        .catch(error => callback(SERVER_ERROR, error));
    }
    //---
    // PUT - To Delete a Hobby
    // A Hobby for a registerd Avenger is passed in request query parameters
    // Removes the Hobby value
    //---
    else if (data.queryObject.hobbies) {
      _data
        .remove(
          "users",
          mobileNumber.value,
          "hobbies",
          data.queryObject.hobbies
        )
        .then(response => callback(SUCCESS, "Avenger Hobbies are Removed"))
        .catch(error => callback(SERVER_ERROR, error));
    } else {
      callback(BAD_REQUEST, "Hobbies needs to be passed");
    }
  } else {
    callback(BAD_REQUEST, "Mobile Number is Invalid");
  }
} else {
  callback(BAD_REQUEST, "Please Pass Mobile Number");
}