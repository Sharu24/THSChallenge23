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
handlers._users.post = async (data, callback) => {
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
  if (firstName && lastName && phone && password && tosAgreement) {
    try {
      // Check if the user Already Exists
      const fileData = await _data.read("users", phone);
      if (fileData) return callback(400, { Error: "User already Exists" });

      // Create user Object to store
      const userObject = {
        firstName,
        lastName,
        phone,
        hashedPassword: helpers.hash(password),
        tosAgreement: true
      };

      //Write the user data into storage
      await _data.create("users", phone, userObject);
      callback(200, { Success: "User Registered Successfully" });
    } catch (error) {
      console.error(error);
      callback(500, { Error: "Could not Create the New User" });
    }
  } else {
    callback(400, { Error: "Validation Failed/ Missing Fields" });
  }
};

//-----------------------------------------------------------------------------
// GET Method for /users
//Required Data (Query Params) : Phone Number
//Optional Data : none
//It is a Private Route, Only logged in users can query user data
handlers._users.get = async (data, callback) => {
  //Check if Phone Number is Valid
  const phone =
    typeof data.queryStringObject.phone === "string" &&
    data.queryStringObject.phone.trim().length === 10
      ? data.queryStringObject.phone.trim()
      : false;
  if (phone) {
    try {
      //Look up for a user
      let parsedData = await _data.read("users", phone);
      if (parsedData) {
        delete parsedData.hashedPassword;
        callback(200, parsedData);
      } else {
        callback(400, { Error: "User Does Not Exists" });
      }
    } catch (error) {
      console.error(error);
      callback(500, { Error: "Unable to fetch User Data" });
    }
  } else {
    callback(400, { Error: "Validation Failed/ Missing Fields" });
  }
};

//-----------------------------------------------------------------------------
// PUT Method for /users
//Required Data (Body) : Phone Number
//Optional Data : rest of the fields
//It is a Private Route, Only logged in users can update user data
handlers._users.put = async (data, callback) => {
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
      try {
        const parsedData = await _data.read("users", phone);
        // Check user updates
        if (firstName) parsedData.firstName = firstName;
        if (lastName) parsedData.lastName = lastName;
        if (password) parsedData.hashedPassword = helpers.hash(password);
        //write into the file
        await _data.update("users", phone, parsedData);
        callback(200, { Success: "User Data Updated Successfully" });
      } catch (error) {
        console.error(error);
        callback(400, { Error: "User Does not Exists" });
      }
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
handlers._users.delete = async (data, callback) => {
  //Check if the phone is valid
  const phone =
    typeof data.queryStringObject.phone === "string" &&
    data.queryStringObject.phone.trim().length === 10
      ? data.queryStringObject.phone.trim()
      : false;
  if (phone) {
    try {
      //check if the user exists
      const parsedData = await _data.read("users", phone);
      if (parsedData) {
        //delete the user from storage
        await _data.delete("users", phone);
        callback(200, { Success: "User Deleted Successfully" });
      } else {
        callback(400, { Error: "User Does not Exists" });
      }
    } catch (error) {
      console.error(error);
      callback(500, { Error: "Error while Deleting the user" });
    }
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
handlers._tokens.post = async (data, callback) => {
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
    try {
      //Check if the user credentials matches with storage
      const parsedData = await _data.read("users", phone);
      if (parsedData) {
        const hashedPassword = helpers.hash(password);
        if (hashedPassword === parsedData.hashedPassword) {
          //create Token
          const tokenId = helpers.createRandomString("20");
          const expires = (Date.now() / 1000) * 60 * 60 * 1000;
          //create token Object
          const tokenObject = { phone, tokenId, expires };
          // Store the token into storage
          _data.create("tokens", tokenId, tokenObject);
          callback(200, tokenObject);
        }
      } else {
        callback(400, { Error: "User Does not Exists" });
      }
    } catch (error) {
      console.error(error);
      callback(500, { Error: "Unable to create tokens" });
    }
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

// Token Get Method
handlers._tokens.get = async (data, callback) => {
  const tokenId =
    typeof data.queryStringObject.tokenId === "string" &&
    data.queryStringObject.tokenId.trim().length === 20
      ? data.queryStringObject.tokenId.trim()
      : false;

  console.log(tokenId);
  if (tokenId) {
    // check its a valid user
    try {
      const parsedData = await _data.read("tokens", tokenId);
      if (parsedData) {
        callback(200, parsedData);
      } else {
        callback(400, { Error: "Token Does not Exists" });
      }
    } catch (error) {
      console.error(error);
      callback(500, { Error: "Couldn't get the Token" });
    }
  }
};

// Token Delete Method
handlers._tokens.delete = async (data, callback) => {
  let tokenId = data.queryStringObject.tokenId;
  tokenId =
    typeof tokenId === "string" && tokenId.trim().length === 20
      ? tokenId.trim()
      : false;

  if (tokenId) {
    try {
      // check if the token exists
      const parsedData = await _data.read("tokens", tokenId);
      if (parsedData) {
        await _data.delete("tokens", tokenId);
        return callback(200, { Success: "Token Deleted Successfully" });
      } else {
        return callback(400, { Error: "The Token does not Exists" });
      }
    } catch (error) {
      console.error(error);
      callback(500, { Error: "Unable to delete tokens" });
    }
  } else {
    callback(400, "Error: Entered Token is invalid");
  }
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
