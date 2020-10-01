//
const fs = require("fs");
const _data = require("./data");
const helpers = require("./helpers");
//Implementing Route Handlers
const handlers = {};

//Router Handlers for /users
handlers.users = (data, callback) => {
  //When some access /users, now we need to identify HTTP Method
  const acceptableMethods = ["post", "get", "put", "delete"];
  // console.log(acceptableMethods.indexOf(data.method));
  if (acceptableMethods.indexOf(data.method) !== -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405, { Error: "Invalid HTTP Method. Request Failed." });
  }
};

handlers._users = {};

//-----------------------------------------------------------------------------
//POST Method for /users
//Required Data(Users Schema) from body : firstname,lastname,phone(unique),password,tosAgreement
//OPtional Data : none
handlers._users.post = (data, callback) => {
  console.log(data);
  //Implement validation, check all required fields are filled out
  const firstName =
    typeof data.payload.firstName === "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName === "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;
  const password =
    typeof data.payload.password === "string" &&
    data.payload.password.length >= 6
      ? data.payload.password
      : false;
  const tosAgreement =
    typeof data.payload.tosAgreement === "boolean" &&
    data.payload.tosAgreement === true
      ? true
      : false;
  // console.log(typeof data.payload);
  if (firstName && lastName && phone && password && tosAgreement) {
    //Make sure that user doesn't already exists
    _data
      .read("users", phone)
      .then(fileData => {
        console.log("Error", fileData);
        callback(400, { Error: "User Already Exists" });
      })
      .catch(() => {
        const hashedPassword = helpers.hash(password);
        if (hashedPassword) {
          //Create the Final User Object to store in the disk
          const userObject = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            hashedPassword: hashedPassword,
            tosAgreement: true
          };
          //Save the User to Disk
          _data
            .create("users", phone, userObject)
            .then(() => {
              callback(200, { Success: "User Registered Successfully" });
            })
            .catch(() => {
              callback(500, { Error: "Could not Create the New User" });
            });
        } else {
          callback(400, { Error: "Couldn't Hash Password" });
        }
      });
  } else {
    callback(400, { Error: "Validation Failed/ Missing Fields" });
  }
};

//-----------------------------------------------------------------------------
// GET Method for /users
//Required Data (Query Params) : Phone Number
//Optional Data : none
//It is a Private Route, Only logged in users can query user data
handlers._users.get = (data, callback) => {
  //Check if Phone Number is Valid
  const phone =
    typeof data.queryStringObject.phone === "string" &&
    data.queryStringObject.phone.trim().length === 10
      ? data.queryStringObject.phone.trim()
      : false;
  if (phone) {
    //Look up for a user
    _data
      .read("users", phone)
      .then(response => {
        //Remove the password from the data
        delete response.hashedPassword;
        callback(200, response);
      })
      .catch(error => {
        callback(400, {
          Error: "There is no User available with this Phone Number."
        });
      });
  } else {
    callback(400, { Error: "Validation Failed/ Missing Fields" });
  }
};

//-----------------------------------------------------------------------------
// PUT Method for /users
//Required Data (Body) : Phone Number
//Optional Data : rest of the fields
//It is a Private Route, Only logged in users can update user data
handlers._users.put = (data, callback) => {
  const phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;
  //Check for optional Fields
  const firstName =
    typeof data.payload.firstName === "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName === "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const password =
    typeof data.payload.password === "string" &&
    data.payload.password.length >= 6
      ? data.payload.password
      : false;
  if (phone) {
    if (firstName || lastName || password) {
      _data
        .read("users", phone)
        .then(userData => {
          //Update the Fields
          if (firstName) userData.firstName = firstName;
          if (lastName) userData.lastName = lastName;
          if (password) userData.hashedPassword = helpers.hash(password);
          console.log(userData, phone);
          return _data.update("users", phone, userData);
        })
        .then(() => {
          callback(200, { Success: "User Data Updated." });
        })
        .catch(() => callback(400, { Error: "Specified User Doesnt Exist" }));
    } else {
      callback(400, { Error: "Missing Fields to Update" });
    }
  } else {
    callback(400, { Error: "Validation Failed/Missing Required Fields" });
  }
};

//-----------------------------------------------------------------------------
// DELETE Method for /users
//Required Data (params) : Phone Number
//Optional Data : none
//It is a Private Route, Only logged in users can update user data
handlers._users.delete = (data, callback) => {
  //Check if the phone is valid
  const phone =
    typeof data.queryStringObject.phone === "string" &&
    data.queryStringObject.phone.trim().length === 10
      ? data.queryStringObject.phone.trim()
      : false;
  if (phone) {
    //Look up the user
    _data
      .read("users", phone)
      .then(() => _data.delete("users", phone))
      .then(() => callback(200, { Success: "User Got Deleted Succesfully" }))
      .catch(() => callback(400, { Error: "User Doesn't Exist" }));
  } else {
    callback(400, { Error: "Validation Failed/Missing Required Fields" });
  }
};

//-----------------------------------------------------------------------------
// Token Handlers
handlers.tokens = (data, callback) => {
  const acceptableMethods = ["get", "post", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) !== -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405, { Error: "Invalid http request method" });
  }
};

handlers._tokens = {};

//-----------------------------------------------------------------------------
// Token Post Method
// Required Fields : phone, password
// Optional Data : None
handlers._tokens.post = (data, callback) => {
  console.log("I am getting hit");
  const phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;
  const password =
    typeof data.payload.password === "string" &&
    data.payload.password.length >= 6
      ? data.payload.password
      : false;

  if (phone && password) {
    //look up for the user
    let tokenObject = {};
    _data
      .read("users", phone)
      .then(userData => {
        const hashedPassword = helpers.hash(password);
        if (userData.hashedPassword === hashedPassword) {
          //generate a access token
          console.log("Passwords match");
          const tokenId = helpers.createRandomString("20");
          if (tokenId) {
            console.log("Token Id : ", tokenId);
            const expires = Date.now() * 1000 * 60 * 60;
            tokenObject = {
              phone: phone,
              id: tokenId,
              expires: expires
            };
            console.log("before .create");
            return _data.create("tokens", tokenId, tokenObject);
          }
        }
      })
      .then(() => callback(200, { Success: tokenObject }))
      .catch(() => callback(500, { Error: "Server Error" }));
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

// Token Get Method
handlers._tokens.get = (data, callback) => {
  const token =
    typeof data.queryStringObject.token === "string" &&
    data.queryStringObject.token.trim().length === 20
      ? data.queryStringObject.token.trim()
      : false;

  if (token) {
    // check its a valid user
    _data
      .read("tokens", token)
      .then(response => {
        callback(200, response);
      })
      .catch(() => {
        callback(400, { Error: "Not a valid Token" });
      });
  }
};

// Token Delete Method
handlers._tokens.delete = (data, callback) => {
  const token =
    typeof data.queryStringObject.token === "string" &&
    data.queryStringObject.token.trim().length === 20
      ? data.queryStringObject.token.trim()
      : false;
  _data
    .read("tokens", token)
    .then(() => _data.delete("tokens", token))
    .then(() => callback(200, "User Deleted Succesfully"))
    .catch(() => callback(500, "User not deleted. Server Error"));
};

// Token Put Method
handlers._tokens.put = () => {};

handlers.ping = (data, callback) => {
  //Callback returns a http status code and a payload object
  callback(200, { success: "You Just accessed /ping" });
};

handlers.notFound = (data, callback) => {
  callback(404, { Status: "Not Found" });
};

module.exports = handlers;
