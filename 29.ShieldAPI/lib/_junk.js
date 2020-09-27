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
