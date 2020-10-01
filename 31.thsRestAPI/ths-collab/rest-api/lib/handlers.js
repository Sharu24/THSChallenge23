const _data = require("./data");
const helpers = require("./helpers");
//Implementing Route Handlers
const handlers = {};

//Router Handlers for /users
handlers.users = (data, callback) => {
  const { method } = data; // const method = data.method;
  //When some access /users, now we need to identify HTTP Method
  const acceptableMethods = ["post", "get", "put", "delete"];
  // console.log(acceptableMethods.indexOf(data.method));
  if (acceptableMethods.indexOf(method) !== -1) {
    handlers._users[method](data, callback);
  } else {
    callback(405, { Error: "Invalid HTTP Method. Request Failed." });
  }
};

handlers._users = {};
//POST Method for /users
//Required Data(Users Schema) from body : firstname,lastname,phone(unique),password,tosAgreement
//OPtional Data : none
handlers._users.post = (data, callback) => {
  let { firstName, lastName, phone, password, tosAgreement } = data.payload;

  //Implement validation, check all required fields are filled out
  firstName =
    typeof firstName === "string" && firstName.trim().length > 0
      ? firstName.trim()
      : false;
  lastName =
    typeof lastName === "string" && lastName.trim().length > 0
      ? lastName.trim()
      : false;
  phone =
    typeof phone === "string" && phone.trim().length === 10
      ? phone.trim()
      : false;
  password =
    typeof password === "string" && password.length >= 6 ? password : false;
  tosAgreement =
    typeof tosAgreement === "boolean" && tosAgreement === true ? true : false;
  // console.log(typeof data.payload);
  if (firstName && lastName && phone && password && tosAgreement) {
    //Make sure that user doesn't already exists
    _data.read("users", phone, (err, data) => {
      if (err) {
        //Lets hash the password
        const hashedPassword = helpers.hash(password);
        if (hashedPassword) {
          //Create the Final User Object to store in the disk
          const userObject = {
            firstName,
            lastName,
            phone,
            hashedPassword,
            tosAgreement: true
          };
          //Save the User to Disk
          _data.create("users", phone, userObject, err => {
            if (!err) {
              callback(200, { Success: "User Registered Successfully" });
            } else {
              console.log(err);
              callback(500, { Error: "Could not Create the New User" });
            }
          });
        } else {
          callback(500, { Error: "Could not Hash the Password" });
        }
      } else {
        //Error User Already Exists
        callback(400, {
          Error: "An User with this Phone Number Already Exists"
        });
      }
    });
  } else {
    callback(400, { Error: "Validation Failed/ Missing Fields" });
  }
};

// GET Method for /users
//Required Data (Query Params) : Phone Number
//Optional Data : none
//It is a Private Route, Only logged in users can query user data
handlers._users.get = (data, callback) => {
  let { phone } = data.queryStringObject;
  //Check if Phone Number is Valid
  phone =
    typeof phone === "string" && phone.trim().length === 10
      ? phone.trim()
      : false;
  if (phone) {
    //Look up for a user
    _data
      .read("users", phone)
      .then(data => {
        callback(200, data);
      })
      .catch(err => {
        console.log(err); //debug
        callback(400, { Error: "The Specified User Not found" });
      });
  } else {
    callback(400, { Error: "Validation Failed/ Missing Fields" });
  }
};

// PUT Method for /users
//Required Data (Body) : Phone Number
//Optional Data : rest of the fields
//It is a Private Route, Only logged in users can update user data
handlers._users.put = (data, callback) => {
  let { firstName, lastName, password, phone } = data.payload;
  phone =
    typeof phone === "string" && phone.trim().length === 10
      ? phone.trim()
      : false;
  //Check for optional Fields
  firstName =
    typeof firstName === "string" && firstName.trim().length > 0
      ? firstName.trim()
      : false;
  lastName =
    typeof lastName === "string" && lastName.trim().length > 0
      ? lastName.trim()
      : false;
  password =
    typeof password === "string" && password.length >= 6 ? password : false;
  if (phone) {
    if (firstName || lastName || password) {
      _data.read("users", phone, (err, userData) => {
        if (!err && userData) {
          //Update the Fields
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.hashedPassword = helpers.hash(password);
          }
          //Store the new Data to the disk into the same file
          _data.update("users", phone, userData, err => {
            if (!err) {
              callback(200, { Success: "User Data Updated." });
            } else {
              console.error(err);
              callback(500, { Error: "Server Error. Please Try Again." });
            }
          });
        } else {
          callback(400, { Error: "The Specified User Doesnt Exist" });
        }
      });
    } else {
      callback(400, { Error: "Missing Fields to Update" });
    }
  } else {
    callback(400, { Error: "Validation Failed/Missing Required Fields" });
  }
};

// DELETE Method for /users
//Required Data (params) : Phone Number
//Optional Data : none
//It is a Private Route, Only logged in users can update user data
handlers._users.delete = (data, callback) => {
  let { phone } = data.queryStringObject;
  //Check if the phone is valid
  phone =
    typeof phone === "string" && phone.trim().length === 10
      ? phone.trim()
      : false;
  if (phone) {
    //Look up the user
    _data.read("users", phone, (err, data) => {
      if (!err && data) {
        //I have to delete
        _data.delete("users", phone, err => {
          if (!err) {
            callback(200, { Success: "User Got Deleted Succesfully" });
          } else {
            console.error(err);
            callback(500, { Error: "We couldnot delete your Account" });
          }
        });
      } else {
        callback(400, { Error: "The Specified User Doesnt Exist" });
      }
    });
  } else {
    callback(400, { Error: "Validation Failed/Missing Required Fields" });
  }
};

handlers.ping = (data, callback) => {
  //Callback returns a http status code and a payload object
  callback(200, { success: "You Just accessed /ping" });
};

handlers.notFound = (data, callback) => {
  callback(404, { Status: "Not Found" });
};

module.exports = handlers;
