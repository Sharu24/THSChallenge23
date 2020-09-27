//--------------------------------------------
// @Description: To Handle routes
//--------------------------------------------

const _data = require("./storage");
const helpers = require("./helpers");
const { acceptableMethods, statusCodes } = require("./config");
const { validate } = require("./validate");

// Define Handlers
const routes = {};

// Validate if the request Method is valid for /users
// Invoke Route Handlers
routes.users = (data, callback) => {
  // callback returns a http code and a payload
  if (acceptableMethods.indexOf(data.method) !== -1) {
    try {
      routes._users[data.method](data, callback);
    } catch (error) {
      callback(statusCodes.INVALID_METHOD, {
        Error: "Invalid Http/s method for the Specified Route"
      });
    }
  } else {
    callback(statusCodes.INVALID_METHOD, {
      Error: "Invalid Http/s method, Request Failed"
    });
  }
};

// Validate if the request Method is valid for /users
// Invoke Route Handlers
routes.hobby = (data, callback) => {
  // callback returns a http code and a payload
  if (acceptableMethods.indexOf(data.method) !== -1) {
    try {
      routes._hobby[data.method](data, callback);
    } catch (error) {
      callback(statusCodes.INVALID_METHOD, {
        Error: "Invalid Http/s method for the Specified Route"
      });
    }
  } else {
    callback(statusCodes.INVALID_METHOD, {
      Error: "Invalid Http/s method, Request Failed"
    });
  }
};

// Validate if the request Method is valid for /age
// Invoke Route Handlers
routes.age = (data, callback) => {
  if (acceptableMethods.indexOf(data.method) !== -1) {
    routes._age[data.method](data, callback);
  } else {
    callback(statusCodes.INVALID_METHOD, {
      Error: "Invalid Http/s method, Request Failed"
    });
  }
};

//--------------------------------------------
routes._users = {};
//-----------------------------------------------------------------------------
// GET Method for /users - Gets Avenger Details
// Required Data (query params) : Phone Number
// Optional Data : None
// Its a Private Route, Only logged in users can query user data
//-----------------------------------------------------------------------------
routes._users.get = (data, callback) => {
  //---
  // GET - To get an Avenger,
  // Request Query Param - Mobile Number, Request Body - NA
  if (data.queryObject.mobileNumber) {
    const queryObject = validate.mobileNumber(data.queryObject.mobileNumber);
    if (queryObject.value) {
      _data.read("users", queryObject.value, (err, data) => {
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
        console.log(error);
        callback(statusCodes.SERVER_ERROR, {
          Error: "Something went while fetching Avengers data"
        });
      });
  }
};

//-----------------------------------------------------------------------------
// PUT Method for /users
//Routes :
//    PUT - Update Optional Attributes
//        - Required (query params) : Mobile Number, Atleast an Optional Field
// Optional : First name, Last name, Password, Email Address
// Its a Private Route, Only logged in users can query user data
//-----------------------------------------------------------------------------
routes._users.put = (data, callback) => {
  //---
  //--- This PUT block is Utilized to Update request body Object
  //---
  const mobileNumber = validate.mobileNumber(data.payload.mobileNumber);
  const firstName = validate.firstName(data.payload.firstName);
  const lastName = validate.lastName(data.payload.lastName);
  const emailAddress = validate.emailAddress(data.payload.emailAddress);
  const userPassword = validate.userPassword(data.payload.userPassword);
  if (mobileNumber.valid) {
    if (
      //--- Atleast Once of these needs to be valid to update
      firstName.valid ||
      lastName.valid ||
      userPassword.valid ||
      emailAddress.valid
    ) {
      _data.read("users", mobileNumber.value, (err, userData) => {
        if (!err && userData) {
          if (firstName.valid) userData.firstName = firstName.value;
          if (lastName.valid) userData.lastName = lastName.value;
          if (emailAddress.valid) userData.emailAddress = emailAddress.value;
          if (userPassword.valid)
            userData.hPassword = helpers.hash(userPassword.value);

          //--- Once User data is successfully retrived and
          //--- temporarily written with updates, update the data back
          _data.update("users", mobileNumber.value, userData, err => {
            if (!err) {
              callback(statusCodes.SUCCESS, {
                Success: "Avenger Details Successfully Updated"
              });
            } else {
              console.error(err);
              callback(statusCodes.SERVER_ERROR, {
                Error: "Server Error: Update failed"
              });
            }
          });
        } else {
          callback(statusCodes.BAD_REQUEST, {
            Error: "Avenger Does not Exists"
          });
        }
      });
    } else {
      callback(statusCodes.BAD_REQUEST, {
        Error: "Missing fields to update"
      });
    }
  } else {
    callback(statusCodes.BAD_REQUEST, { Error: mobileNumber.message });
  }
};

//-----------------------------------------------------------------------------
// DELETE Method for /users
// Required Data (query params) : Phone Number
// Optional Data : None
// Its a Private Route, Only logged in users can query user data
//-----------------------------------------------------------------------------
routes._users.delete = (data, callback) => {
  const mobileNumber = validate.mobileNumber(data.queryObject.mobileNumber);

  if (mobileNumber.valid) {
    _data.read("users", mobileNumber.value, (err, data) => {
      if (!err && data) {
        _data.delete("users", mobileNumber.value, err => {
          if (!err) {
            callback(statusCodes.SUCCESS, {
              Success: `Avenger with mobile# ${mobileNumber.value} is terminated`
            });
          } else {
            console.error(err);
            callback(statusCodes.SERVER_ERROR, {
              Error: "S.H.I.E.L.D Error: Avenger could not be deleted"
            });
          }
        });
      } else {
        callback(statusCodes.BAD_REQUEST, {
          Error: "Avenger Does not Exists"
        });
      }
    });
  } else {
    callback(statusCodes.SUCCESS, { Error: "Mobile Number is invalid" });
  }
};

//-----------------------------------------------------------------------------
//POST method for /users
//Required Data (Users Schema): fistName, lastName, emailAddress
//                              mobileNumber (unique), userPassword,
//                              Terms and Conditions Agreement
//Optional data = none
//-----------------------------------------------------------------------------
routes._users.post = (data, callback) => {
  //--- check if all the required fields are sent from the paylaod
  const mobileNumber = validate.mobileNumber(data.payload.mobileNumber);
  const firstName = validate.firstName(data.payload.firstName);
  const lastName = validate.lastName(data.payload.lastName);
  const emailAddress = validate.emailAddress(data.payload.emailAddress);
  const userPassword = validate.userPassword(data.payload.userPassword);
  const tcAgreement = validate.tcAgreement(data.payload.tcAgreement);

  if (
    firstName.valid &&
    lastName.valid &&
    mobileNumber.valid &&
    emailAddress.valid &&
    userPassword.valid &&
    tcAgreement.valid
  ) {
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
            hashPassword: hashPassword,
            tcAgreement: tcAgreement.value,
            _id: Date.now()
          };
          _data.create("users", mobileNumber.value, userObject, err => {
            if (!err) {
              callback(statusCodes.SUCCESS, {
                Success: `Avenger ${firstName.value} reachable at ${mobileNumber.value} is Successfully Registered`
              });
            } else {
              console.log(err);
              callback(statusCodes.SERVER_ERROR, {
                Error:
                  "Avenger could not be created. Retry/Contact @S.H.I.E.L.D"
              });
            }
          });
        } else {
          callback(statusCodes.SERVER_ERROR, {
            Error: "Could Not Crypt the Password. Retry/Contact @S.H.I.E.L.D"
          });
        }
      } else
        callback(statusCodes.BAD_REQUEST, {
          Error: `Avenger with mobile# ${mobileNumber.value} already exists`
        });
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

//-----------------------------------------------------------------------------
// Define Handlers for /age route
routes._age = {};
//-----------------------------------------------------------------------------
// GET Method for /age
// Required Data (query params) : Phone Number
// Optional Data : None
// Its a Private Route, Only logged in users can query user data
//-----------------------------------------------------------------------------
routes._age.get = (data, callback) => {
  const mobileNumber = validate.mobileNumber(data.queryObject.mobileNumber);

  if (mobileNumber.valid) {
    _data.read("users", mobileNumber.value, (error, data) => {
      if (!error && data) {
        let currentDate = new Date(Date.now());
        let since = {};
        if (currentDate >= data._id) {
          since = helpers._getDuration(data._id, currentDate);
        } else {
          callback(statusCodes.BAD_REQUEST, {
            Error: "An Avenger from future !! #EndGame"
          });
          return;
        }

        let responseMsg = "";
        if (since.years || since.months || since.days) {
          responseMsg = `Dear ${data.firstName}, You have been an Avenger since `;
          responseMsg += since.years ? since.years + " years, " : "";
          responseMsg += since.months ? since.months + " months, " : "";
          responseMsg += since.days === 1 ? "A day" : since.days + " days";
        } else {
          responseMsg = `Avenger ${data.firstName}, Its your first day at office !! `;
        }
        callback(statusCodes.SUCCESS, { Success: responseMsg });
      } else {
        callback(statusCodes.BAD_REQUEST, {
          Error: "Avenger Does not exist. Please register."
        });
      }
    });
  }
};

//-----------------------------------------------------------------------------
routes._hobby = {};

//-----------------------------------------------------------------------------
// PUT Method for /hobby
// Inner Routes :
// 1. PUT - To Add or Append Hobbies
// 2. PUT - To Delete a Hobby
// Optional : none
// Its a Private Route, Only logged in users can query user data
//-----------------------------------------------------------------------------
routes._hobby.put = (data, callback) => {
  //---
  //--- This PUT block is Utilized to Update Hobbies
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
        _data.append("users", mobileNumber.value, data.payload, error => {
          if (!error) {
            callback(statusCodes.SUCCESS, {
              Success: "Data Appended Successfully"
            });
          } else {
            callback(statusCodes.SERVER_ERROR, {
              Error: error
            });
          }
        });
      }
      //---
      // PUT - To Delete a Hobby
      // A Hobby for a registerd Avenger is passed in request query parameters
      // Removes the Hobby value
      //---
      else if (data.queryObject.hobbies) {
        _data.remove(
          "users",
          mobileNumber.value,
          "hobbies",
          data.queryObject.hobbies,
          error => {
            if (!error) {
              callback(statusCodes.SUCCESS, {
                Success: "Avenger Hobbies were Removed Successfully"
              });
            } else {
              callback(statusCodes.BAD_REQUEST, {
                Error: error
              });
            }
          }
        );
      } else {
        callback(statusCodes.BAD_REQUEST, {
          Error: "Invalid request - Hobbies needs to be passed"
        });
      }
    } else {
      callback(statusCodes.BAD_REQUEST, {
        Error: "Invalid request - Mobile Number is Invalid"
      });
    }
  } else {
    callback(statusCodes.BAD_REQUEST, {
      Error: "Invalid request - Please Pass Mobile Number"
    });
  }
};

routes.login = (data, callback) => {
  callback(statusCodes.SUCCESS, { Success: "Login Successfull" });
};

routes.logout = (data, callback) => {
  callback(statusCodes.SUCCESS, { Success: "Logout Successfull" });
};

routes.notfound = (data, callback) => {
  callback(statusCodes.NOT_FOUND, {
    Error: "Invalid Route in the URL. Please contact S.H.I.E.L.D"
  });
};

module.exports = routes;
