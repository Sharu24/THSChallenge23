const http = require("http");
const url = require("url");
const fs = require("fs");

const { promisify } = require("util");

var appendFile = promisify(fs.appendFile);
var readFile = promisify(fs.readFile);
var access = promisify(fs.access);
var fileExists = true;
var userExists = false;

// PORT - Anything less than 1024 requies sudo permission
const PORT = process.env.PORT || 3000;

var getFile = () => {
  var dte = new Date();
  var lFile = `./logs/F${dte.getFullYear()}${dte.getMonth() +
    1}${dte.getDate()}.JSON`;
  return lFile;
};

var getDateTime = () => {
  var dte = new Date();
  var lDate = `${dte.getFullYear()}${dte.getMonth() + 1}${dte.getDate()}`;
  var lTime = `${dte.getHours()}:${dte.getMinutes() +
    1}:${dte.getSeconds()}:${dte.getMilliseconds()}`;
  return lDate + " " + lTime;
};

const app = http.Server(async (req, res) => {
  console.log("Server Code Executes---- ");
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET", "POST");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url !== "/favicon.ico") {
    fileExists = true;
    userExists = false;
    //get query params and prepare userData
    var qs = url.parse(req.url, true).query;
    console.log("QueryString = ", req.url);
    // var email = qs.email;
    var ePattern = `"email": "${qs.emailAddr}"`;
    var userData = `{"dateTime": "${getDateTime()}","firstName": "${
      qs.firstName
    }", "email": "${qs.emailAddr}", "password": "${qs.userPassword}" },`;

    console.log("UserData = ", userData);
    console.log(`FileName = ${getFile()}`);
    //---------------------------
    // Check if the File Exists
    //---------------------------
    try {
      var err = await access(getFile(), fs.F_OK);
      console.log(err, getFile());
    } catch (error) {
      fileExists = false;
    }

    console.log("File Exists ? = ", fileExists);

    //---------------------------
    // Read the File if it Exists
    //---------------------------
    try {
      if (fileExists) {
        var fileData = await readFile(getFile());
        // console.log(fileData.toString());
        console.log("Email Patttern = ", ePattern);
        var re = new RegExp(ePattern, "g");
        // console.log(re);
        if (re.exec(fileData.toString())) {
          userExists = true;
        }
      }
    } catch (err) {
      //   console.error("Read Gone Crazy");
      res.write("Read Gone Crazy");
      res.end();
    }

    console.log("User Exists ? = ", userExists);

    //---------------------------
    // Read the File if it Exists
    //---------------------------
    if (!userExists) {
      try {
        console.log(getFile());
        console.log(userData);
        await appendFile(getFile(), userData);
        res.writeHead(200);
        res.write("Written Successfully");
        res.end();
      } catch (err) {
        console.error("Append Gone crazy");
        //res.write("Append gone Crazy");
        //res.end();
      }
    } else {
      res.writeHead(200);
      res.write("User Already Exists");
      res.end();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Listening on server ${PORT}`);
});
