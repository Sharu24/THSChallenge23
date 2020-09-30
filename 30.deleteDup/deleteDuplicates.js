// Can you all give me all possible ways of removing duplicated values in an Array ?
// You can make use of ES6 array helper methods, sets , for loops.

var remDup1 = arr =>
  arr.filter(ele => arr.indexOf(ele) === arr.lastIndexOf(ele));

var remDup2 = arr => arr.filter((ele, index) => index === arr.lastIndexOf(ele));

var remDup3 = arr => Array.from(new Set(arr));

var remDup4 = arr => [...new Set(arr)];

var remDup5 = arr => {
  var temp = {};
  var out = [];
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    temp[arr[i]] = "";
  }
  for (key in temp) {
    out.push(Number(key));
  }
  return out;
};

Array.prototype.unique = function() {
  var temp = [];
  for (var i = 0; i < this.length; i++) {
    var ele = this[i];
    if (temp.indexOf(ele) === -1) temp.push(ele);
  }
  return temp;
};

console.log("0", remDup1([10, 22, 7, 1, 7, 1, 7]));
console.log("A)", remDup2([10, 22, 7, 1, 7, 1, 7]));
console.log("B)", remDup3([10, 22, 7, 1, 7, 1, 7]));
console.log("C)", remDup4([10, 22, 7, 1, 7, 1, 7]));
console.log("D)", remDup5([10, 22, 7, 1, 7, 1, 7]));
console.log("E)", [10, 22, 7, 1, 7, 1, 7].unique());
