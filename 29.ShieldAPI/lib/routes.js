//--------------------------------------------
// @Description: To Handle routes
//--------------------------------------------

const _data = require("./storage");
const helpers = require("./helpers");
const { acceptableMethods, statusCodes } = require("./config");
const { validate } = require("./validate");

const {
  SUCCESS,
  BAD_REQUEST,
  NOT_FOUND,
  INVALID_METHOD,
  SERVER_ERROR
} = statusCodes;

// Define Handlers
const routes = {};

//-----------------------------------------------------------------------------
//Handlers for /users
//-----------------------------------------------------------------------------
// Validate if the request Method is valid for /users
// Invoke Route Handlers
routes.users = (data, callback) => {
  const { method } = data; // const method = data.method
  // callback returns a http code and a payload
  if (acceptableMethods.indexOf(method) !== -1) {
    try {
      routes._users[method](data, callback);
    } catch (error) {
      callback(INVALID_METHOD, "Invalid Http/s method for the Route");
    }
  } else {
    callback(INVALID_METHOD, "Invalid Http/s method, Request Failed");
  }
};

//-----------------------------------------------------------------------------
//Handlers for /hobby
//-----------------------------------------------------------------------------
// Validate if the request Method is valid for /users
// Invoke Route Handlers
routes.hobby = (data, callback) => {
  const { method } = data;
  // callback returns a http code and a payload
  if (acceptableMethods.indexOf(method) !== -1) {
    try {
      routes._hobby[method](data, callback);
    } catch (error) {
      callback(INVALID_METHOD, "Invalid Http/s method for the Specified Route");
    }
  } else {
    callback(INVALID_METHOD, "Invalid Http/s method, Request Failed");
  }
};

//-----------------------------------------------------------------------------
//Handlers for /age
//-----------------------------------------------------------------------------
// Validate if the request Method is valid for /age
// Invoke Route Handlers
routes.age = (data, callback) => {
  const { method } = data;
  if (acceptableMethods.indexOf(method) !== -1) {
    try {
      routes._age[method](data, callback);
    } catch (error) {
      callback(INVALID_METHOD, "Invalid Http/s method for specified route");
    }
  } else {
    callback(INVALID_METHOD, "Invalid Http/s method, Request Failed");
  }
};

//-----------------------------------------------------------------------------
//Handlers for /load
//-----------------------------------------------------------------------------
routes.load = (data, callback) => {
  const { method } = data;
  if (acceptableMethods.indexOf[method] !== -1) {
    try {
      routes._load[method](data, callback);
    } catch (error) {
      // console.log(error);
      callback(INVALID_METHOD, "Invalid Http/s method for the Specified Route");
    }
  } else {
    callback(INVALID_METHOD, "Invalid http/s method, Request Failed");
  }
};

//-----------------------------------------------------------------------------
//Handlers for /load
//-----------------------------------------------------------------------------
routes._load = {};

//-----------------------------------------------------------------------------
// Bulk Load Avengers Data
// Request Object - Array of Avenger Objects
//-----------------------------------------------------------------------------
routes._load.post = async (data, callback) => {
  //POST - To upload a bulk of Avengers into the team
  //Request data - an Array of Objects
  try {
    if (!Array.isArray(data.payload))
      throw { Error: "Bulk load has to be an Array" };

    let response = {};
    let payloadSize = data.payload.length;
    data.payload.forEach(user =>
      routes._users.post(user, (status, payload) => {
        response[user.mobileNumber] = payload;
        if (Object.keys(response).length === payloadSize) {
          callback(SUCCESS, response);
        }
      })
    );
  } catch (error) {
    callback(SERVER_ERROR, error.Error || "Unable to Bulk load data. #Admin");
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
routes._users.get = async (data, callback) => {
  // GET - An Avenger | All Avengers
  try {
    const isQuery = Object.keys(data.queryObject).length;
    const isBody = Object.keys(data.payload).length;
    if (isQuery && !isBody) {
      const mobileNumber = validate.mobileNumber(data.queryObject.mobileNumber);
      if (!mobileNumber.valid) throw "Mobile Number not Passed";
      let userData = await _data.read("users", mobileNumber.value);
      if (userData.Error) throw userData;
      callback(SUCCESS, userData);
    } else if (!isQuery) {
      let fileNames = await _data.readdir("users");
      if (fileNames.Error) throw fileNames;
      let promiseArr = [];
      fileNames.forEach(fileName => {
        promiseArr.push(_data.read("users", fileName.split(".")[0]));
      });
      const userData = await Promise.all(promiseArr);
      callback(SUCCESS, userData);
    }
  } catch (error) {
    callback(SERVER_ERROR, "Error retrieving Avengers data. #Admin");
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
routes._users.put = async (data, callback) => {
  //--- This PUT block is Utilized to Update request body Object
  let {
    firstName,
    lastName,
    mobileNumber,
    emailAddress,
    userPassword
  } = data.payload ? data.payload : data;

  mobileNumber = validate.mobileNumber(mobileNumber);
  firstName = validate.firstName(firstName);
  lastName = validate.lastName(lastName);
  emailAddress = validate.emailAddress(emailAddress);
  userPassword = validate.userPassword(userPassword);

  if (mobileNumber.valid) {
    if (
      //--- Atleast Once of these needs to be valid to update
      firstName.valid ||
      lastName.valid ||
      userPassword.valid ||
      emailAddress.valid
    ) {
      //Fetch User Attrbutes for the MobileNumber
      try {
        let userData = await _data.read("users", mobileNumber.value);
        if (userData.Error) throw userData;

        // Update only those attributes which are valid
        if (firstName.valid) userData.firstName = firstName.value;
        if (lastName.valid) userData.lastName = lastName.value;
        if (emailAddress.valid) userData.emailAddress = emailAddress.value;
        if (userPassword.valid)
          userData.hPassword = helpers.hash(userPassword.value);

        let updData = await _data.update("users", mobileNumber.value, userData);
        if (updData.Error) throw response;
        else callback(SUCCESS, "Avenger Details Successfullly Updated");
      } catch (error) {
        callback(SERVER_ERROR, error.Error | "Update failed");
      }
    } else {
      callback(BAD_REQUEST, "Missing fields to update");
    }
  } else {
    callback(BAD_REQUEST, mobileNumber.message);
  }
};

//-----------------------------------------------------------------------------
// DELETE Method for /users
// Required Data (query params) : Phone Number
// Optional Data : None
// Its a Private Route, Only logged in users can query user data
//-----------------------------------------------------------------------------
routes._users.delete = async (data, callback) => {
  const mobileNumber = validate.mobileNumber(data.queryObject.mobileNumber);

  if (mobileNumber.valid) {
    try {
      let response = await _data.delete("users", mobileNumber.value);
      if (response.Error) throw response;
      else callback(SUCCESS, `Avenger ref# ${mobileNumber.value} deleted`);
    } catch (error) {
      callback(
        SERVER_ERROR,
        error.Error || "Cannot Delete Avenger. Contact Admin"
      );
    }
  } else {
    callback(BAD_REQUEST, "Mobile Number is invalid");
  }
};

//-----------------------------------------------------------------------------
//POST method for /users
//Required Data (Users Schema): fistName, lastName, emailAddress
//                              mobileNumber (unique), userPassword,
//                              Terms and Conditions Agreement
//Optional data = none
//-----------------------------------------------------------------------------
routes._users.post = async (data, callback) => {
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
    try {
      const userObject = {
        firstName: firstName.value,
        lastName: lastName.value,
        mobileNumber: mobileNumber.value,
        emailAddress: emailAddress.value,
        hashPassword: helpers.hash(userPassword.value),
        tcAgreement: tcAgreement.value,
        _id: Date.now()
      };
      let response = await _data.exists("users", mobileNumber.value);
      if (!response.Error) throw "Avenger Already Exists";
      response = await _data.create("users", mobileNumber.value, userObject);
      if (!response.Error)
        callback(SUCCESS, `Welcome Avenger ${lastName.value}!`);
      else throw response;
    } catch (error) {
      callback(SERVER_ERROR, error || "Avenger couldn't be created. #Admin");
    }
  } else {
    let errorMessage = {};
    if (!firstName.valid) errorMessage.firstName = firstName.message;
    if (!lastName.valid) errorMessage.lastName = lastName.message;
    if (!mobileNumber.valid) errorMessage.mobileNumber = mobileNumber.message;
    if (!emailAddress.valid) errorMessage.emailAddress = emailAddress.message;
    if (!userPassword.valid) errorMessage.userPassword = userPassword.message;
    if (!tcAgreement.valid) errorMessage.tcAgreement = tcAgreement.message;

    callback(BAD_REQUEST, errorMessage);
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
routes._age.get = async (data, callback) => {
  try {
    const mobileNumber = validate.mobileNumber(data.queryObject.mobileNumber);
    if (!mobileNumber.valid) throw { Error: "Enter Valid Mobile Number" };

    let userData = await _data.read("users", mobileNumber.value);
    if (userData.Error) throw { Error: "Avenger Not Found. #Register" };
    let currentDate = new Date(Date.now());
    let since = {};
    if (currentDate >= userData._id) {
      since = helpers._getDuration(userData._id, currentDate);
    } else {
      callback(BAD_REQUEST, "An Avenger from future !! #EndGame");
      return;
    }

    let responseMsg = "";
    if (since.years || since.months || since.days) {
      responseMsg = `Dear ${userData.firstName}, You have been an Avenger since `;
      responseMsg += since.years ? since.years + " years, " : "";
      responseMsg += since.months ? since.months + " months, " : "";
      responseMsg += since.days === 1 ? "A day" : since.days + " days";
    } else {
      responseMsg = `Avenger ${userData.firstName}, Its your first day at office !! `;
    }
    callback(SUCCESS, responseMsg);
  } catch (error) {
    callback(
      SERVER_ERROR,
      error.Error || "Unable to Fetch Avenger Experience. #Admin"
    );
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
routes._hobby.put = async (data, callback) => {
  //--- This PUT block is Utilized to Update Hobbies
  try {
    const mobileNumber = validate.mobileNumber(data.queryObject.mobileNumber);
    if (!mobileNumber.valid) throw { Error: "Mobile Number is Invalid" };

    let queryHob = data.queryObject.hobbies;
    if (data.payload.hobbies && !queryHob) {
      //
      let resp = await _data.append("users", mobileNumber.value, data.payload);
      if (resp.Error) throw resp;
      else callback(SUCCESS, "Data Appended Successfully");
    } else if (queryHob) {
      //
      let mobile = mobileNumber.value;
      let resp = await _data.remove("users", mobile, "hobbies", queryHob);
      if (resp.Error) throw resp;
      else callback(SUCCESS, "Avenger Hobbies are Removed");
    } else {
      callback(BAD_REQUEST, "Hobbies needs to be passed");
    }
  } catch (error) {
    // console.log(error);
    callback(
      SERVER_ERROR,
      error.Error || "Cannot Append Avenger Hobbies. Contact Admin"
    );
  }
};

//-----------------------------------------------------------------------------
// Handle Routes where users have entered a Invalid Page
//-----------------------------------------------------------------------------
routes.notfound = (data, callback) => {
  callback(NOT_FOUND, "Invalid Route in the URL. #Admin");
};

//-----------------------------------------------------------------------------
// Handle Routes where users have entered a Invalid Page
//-----------------------------------------------------------------------------

routes.home = (data, callback) => {
  const { method } = data;
  if (acceptableMethods.indexOf[method] !== -1) {
    try {
      routes._home[method](data, callback);
    } catch (error) {
      // console.log(error);
      callback(INVALID_METHOD, "Invalid Http/s method for the Specified Route");
    }
  } else {
    callback(INVALID_METHOD, "Invalid http/s method, Request Failed");
  }
};

routes._home = {};
//-----------------------------------------------------------------------------
// Handlers for /home.get
// Display a HTML Page
//-----------------------------------------------------------------------------
routes._home.get = (data, callback) => {
  _data.read("html", "index", (error, htmlData) => {
    if (!error && htmlData) {
      callback(SUCCESS, htmlData);
    } else {
      callback(SERVER_ERROR, "Home Page Not Found");
    }
  });
};

module.exports = routes;
