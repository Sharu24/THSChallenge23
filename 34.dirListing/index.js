const fs = require("fs");
const path = require("path");

function dTree(dPath) {
  try {
    const dObj = { name: path.basename(dPath) };
    let stats = fs.statSync(dPath);

    if (stats.isDirectory()) {
      let dList = fs.readdirSync(dPath);
      if (dList === null) return null;
      dObj.dChild = dList.map(child => dTree(path.join(dPath, child)));
      return dObj;
    } else if (stats.isFile()) {
      return dObj;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// console.log(dTree(path.join(__dirname, "/temp")));
// console.log(directoryTree(path.join(__dirname, "/temp")).dChild[1].dChild[1]);

let tree = dTree(path.join(__dirname, "/temp"));

const getTree = tree => {
  for (var key in tree) {
    console.log(key);
    if (key === "dChild" && tree["dChild"].length > 0) {
      console.log(tree["name"]);
      getTree(tree["dChild"]);
    } else {
      console.log(tree["name"]);
    }
  }
};
