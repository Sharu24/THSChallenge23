/*
  Primary File to invoke API's
  @AUTHOR  : SDP
  @DESC    : Implementing REST API's
*/

//-----------------------------------------------------------------------------
// Import all the Modules
//-----------------------------------------------------------------------------
const http = require("http");
const url = require("url");
const helpers = require("./lib/helpers");
const routes = require("./lib/routes");
const { statusCodes, getObjectKey } = require("./lib/config");
const stringDecoder = require("string_decoder").StringDecoder;

const port = process.env.PORT || 4000;

//-----------------------------------------------------------------------------
//Create a http Server and handle requests and responses
//-----------------------------------------------------------------------------

const server = http.createServer((request, response) => {
  // Get request data attributes
  var trimmedPath = url
    .parse(request.url, true)
    .pathname.replace(/^\/+|\/+$/g, "");
  var queryObject = url.parse(request.url, true).query;
  var method = request.method.toLowerCase();
  var headers = request.headers;

  // Parsing request body
  const decoder = new stringDecoder("utf-8"); // constructor function

  // Get the request body using request event emitters
  let bodyData = "";
  request.on("data", chunk => {
    bodyData += decoder.write(chunk);
  });
  request.on("end", () => {
    bodyData += decoder.end();

    // Construct Response data
    const data = {
      trimmedPath,
      queryObject,
      method,
      headers,
      payload: bodyData ? helpers.parse(bodyData) : {}
    };

    // handle route path which matches the router object
    // 1. Check if the route exists
    // 2. If the route exists, return me the function to handle the route
    // 3. Invoke the Function
    // 4. Function has a callback, which contains the routes(status, payload)

    // implementing Routers
    const router = {
      home: routes.home,
      users: routes.users,
      age: routes.age,
      hobby: routes.hobby,
      load: routes.load
    };

    // Define path for / (home)
    if (!router[trimmedPath]) trimmedPath = "home";

    // Set the ChoosenHandler to appropriate Handlers
    const chosenHandler =
      typeof router[trimmedPath] != "undefined"
        ? router[trimmedPath]
        : routes.notfound;

    // Invoke the handler functon [Eg: route.user / route.login]
    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 200;

      const statusKey = getObjectKey(statusCode);
      let tempPayload = {};
      tempPayload[statusKey] = payload;
      payload =
        typeof payload === "object" ? tempPayload[statusKey] : tempPayload;
      response.statusCode = statusCode;

      // Set the response Payload
      let payloadString = Object.values(payload).toString();
      if (/^<!DOCTYPE html>/.test(payloadString)) {
        response.setHeader("Content-Type", "text/html");
      } else {
        //Convert payload to a string as the response accepts only string
        payloadString = JSON.stringify(payload);
        response.setHeader("Content-Type", "application/json");
      }

      // End the request-response cycle by returning back the payload
      response.end(payloadString);
    });
  });
});

//-----------------------------------------------------------------------------
// Listen on port allocated port
//-----------------------------------------------------------------------------
server.listen(port, () => {
  console.log(`Servers Listening on port ${port} in heroku`);
});
