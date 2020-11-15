const fs = require("fs");
const util = require("util");
const path = require("path");

const readdir = util.promisify(fs.readdir);

const baseDir = path.join(__dirname);

/*
const listFiles = async (tree, currDir) => {
  try {
    //console.log("I am here", baseDir, currDir);
    const files = await readdir(currDir);
    if (!files) {
      console.log("There are no files in the current path");
    }
    files.forEach(file => {
      var isDir = fs.existsSync(file) && fs.lstatSync(file).isDirectory();
      console.log(`|${"-".repeat(tree)}${file}`);
      if (isDir) {
        listFiles(++tree, file);
      }
    });
  } catch (err) {
    console.log(err);
  }
};
*/

const listFiles = async (listArr, curArr, dir) => {
  try {
    console.log("Out Array = ", listArr);
    console.log("Current Array : " + curArr);
    console.log("Dir to Scan = ", baseDir + "/" + dir);

    const files = await readdir(baseDir + "/" + dir);
    if (!files) {
      console.log(
        "There are no files in the current path : ",
        baseDir + "/" + dir
      );
    }
    for (var i = 0; i < files.length; i++) {
      var isDir =
        fs.existsSync(files[i]) && fs.lstatSync(files[i]).isDirectory();
      // console.log(`|${"-".repeat(tree)}${file}`);
      if (isDir) {
        console.log("dir - ", files[i]);
        listArr[files[i]] = [];
        await listFiles(listArr, files[i], files[i]);
      } else {
        console.log("file - ", files[i]);
        listArr.push(files[i]);
      }
    }

    return dirArr;
  } catch (err) {
    console.log(err);
  }
};

listFiles([], [], "").then(res => console.log(res));
