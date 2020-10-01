/*
    * The Entry File to handle all the APIs
    @Author : The Hacking School
    @DESC : Implementing RESTful APIs
*/
//Import all the modules
const http = require("http");
const url = require("url");
const stringDecoder = require("string_decoder").StringDecoder;
const handlers = require("./lib/handlers");
const helpers = require("./lib/helpers");

//Only for Heroku Deployment
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  //Get the URL and Parse It
  const parsedUrl = url.parse(req.url, true);
  //Get the Path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  //Get the HTTP Method
  const method = req.method.toLowerCase();
  //Get the Query Params as an object because of 'true'
  const queryStringObject = parsedUrl.query;
  // Get the Headers as an object
  const headers = req.headers;

  //To get the payload(body) client to server

  const decoder = new stringDecoder("utf-8");

  let buffer = "";

  req.on("data", data => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    //Choose the handler where  request should go according to the route path ..
    const chosenHandler =
      typeof router[trimmedPath] != "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data to send to the chosen handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer)
    };

    //Route the request to the handler that we choosed
    chosenHandler(data, (statusCode, payload) => {
      //Use the statusCode called back by the handler or 200;
      statusCode = typeof statusCode == "number" ? statusCode : 200;
      //Use the payload called back by the handler or default to an empty object
      payload = typeof payload == "object" ? payload : {};
      //Convert the Payload to a string
      payloadString = JSON.stringify(payload);
      //Send the final Response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
      //To be Removed in Production
      console.log(statusCode, payloadString);
    });
  });
});

//This is a HTTP Server
server.listen(port, () => {
  console.log(`Server started at ${port} in Heroku mode`);
});

//Implementing a Router
const router = {
  ping: handlers.ping,
  users: handlers.users
};
