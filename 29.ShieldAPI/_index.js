/*
  Primary File to invoke API's
  @AUTHOR  : SDP
  @DESC    : Implementing REST API's
*/

//-----------------------------------------------------------------------------
// Import all the Modules
//-----------------------------------------------------------------------------
const http = require("http");
const https = require("https");
const fs = require("fs");
const url = require("url");
const { getEnv } = require("./lib/config");
const helpers = require("./lib/helpers");
// const _data = require("./lib/data");
const routes = require("./lib/routes");
const stringDecoder = require("string_decoder").StringDecoder;

const port = process.env.PORT || 4000;

//-----------------------------------------------------------------------------
//Create A HTTP Server and handle requests and responses
//-----------------------------------------------------------------------------

const httpServer = http.createServer((request, response) => {
  unifiedServer(request, response);
});
//Listening on a Server
httpServer.listen(port, () => {
  // console.log(
  //   `httpServer Listening on port ${getEnv.httpPort} in ${getEnv.envName}`
  // );
  console.log(`httpServer Listening on port ${port} in ${getEnv.envName}`);
});

//Create A HTTPS Server and handle requests and responses
const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem")
};
const httpsServer = https.createServer(
  httpsServerOptions,
  (request, response) => {
    unifiedServer(request, response);
  }
);
//Listening on a Server
// httpsServer.listen(getEnv.httpsPort, () => {
//   console.log(
//     `httpsServer Listening on port ${getEnv.httpsPort} in ${getEnv.envName}`
//   );
// });

//-----------------------------------------------------------------------------
// Invoke Appropriate Route Handlers
//-----------------------------------------------------------------------------
// Handle both http and https
const unifiedServer = (request, response) => {
  // Get request data attributes
  var trimmedPath = url
    .parse(request.url, true)
    .pathname.replace(/^\/+|\/+$/g, "");
  var queryObject = url.parse(request.url, true).query;
  var method = request.method.toLowerCase();
  var headers = request.headers;

  // Parsing request body
  const decoder = new stringDecoder("utf-8"); // constructor function

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

    if (!router[trimmedPath]) trimmedPath = "home";

    const chosenHandler =
      typeof router[trimmedPath] != "undefined"
        ? router[trimmedPath]
        : routes.notfound;

    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 200;
      payload = typeof payload === "object" ? payload : {};

      response.statusCode = statusCode;

      let payloadString = "";
      if (payload.html) {
        response.setHeader("Content-Type", "text/html");
        payloadString = payload.html;
      } else {
        //Convert payload to a string as the response accepts only string
        payloadString = JSON.stringify(payload);
        response.setHeader("Content-Type", "application/json");
      }

      response.end(payloadString);
    });
  });
};
