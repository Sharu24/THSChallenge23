var fsys = "";
var binArr = [48, 49, 8];
var decArr = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 8];
var hexArr = [
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  65,
  66,
  67,
  68,
  69,
  70,
  97,
  98,
  99,
  100,
  101,
  102,
  8
];

var fromSys = document.querySelectorAll("#fromSys");
var input = document.querySelector("#userInput");
var btnConvert = document.querySelector("#btnConvert");
var oBin = document.querySelector("#oBin");
var oDec = document.querySelector("#oDec");
var oHex = document.querySelector("#oHex");

fromSys.forEach(ele => {
  ele.addEventListener("click", evt => {
    console.log("Hello", evt.target.value);
    input.disabled = false;
    input.value = "";
    input.focus();
    oBin.innerHTML = "";
    oDec.innerHTML = "";
    oHex.innerHTML = "";

    if (evt.target.value === "binary") fsys = "b";
    else if (evt.target.value === "decimal") fsys = "d";
    else if (evt.target.value === "hexadecimal") fsys = "h";
  });
});

input.addEventListener("input", e => {
  console.log(e.keyCode, fsys, input.value);
  if (input.value) {
    btnConvert.disabled = false;
    btnConvert.style.backgroundColor = "#2b2b2b";
  } else {
    btnConvert.disabled = true;
    btnConvert.style.backgroundColor = "#5c5e57";
  }
});

input.addEventListener("keydown", e => {
  console.log(e.keyCode, fsys, input.value);
  if (
    !(
      (fsys === "b" && binArr.includes(e.keyCode)) ||
      (fsys === "d" && decArr.includes(e.keyCode)) ||
      (fsys === "h" && hexArr.includes(e.keyCode))
    )
  )
    e.preventDefault();
});

function decimalToOthers(num, sys) {
  var hex = { A: 10, B: 11, C: 12, D: 13, E: 14, F: 15 };
  var eval;

  if (sys === "binary") base = 2;
  else if (sys === "octa") base = 8;
  else if (sys === "hexa") base = 16;

  function fromDecimal(val, eval) {
    if (val === 0) return "";
    else {
      eval = val % base;
      var idx = Object.values(hex).indexOf(eval);
      eval = idx === -1 ? eval : Object.keys(hex)[idx];
      console.log(idx, eval);
      return fromDecimal(Math.floor(val / base), eval) + "" + eval;
    }
  }
  return fromDecimal(num);
}

function othersToDecimal(num, sys) {
  var base = 10,
    hex = { A: 10, B: 11, C: 12, D: 13, E: 14, F: 15 };

  if (sys === "binary") base = 2;
  else if (sys === "octa") base = 8;
  else if (sys === "hexa") base = 16;

  var arr = num.split("").map(ele => {
    return Object.keys(hex).indexOf(ele) !== -1 ? hex[ele] : Number(ele);
  });

  function toDecimal(arr, base, count = 0) {
    if (!arr.length) return 0;
    else {
      return arr.pop() * base ** count + toDecimal(arr, base, ++count);
    }
  }
  return toDecimal(arr, base);
}

function mapOtherSystem() {
  console.log(oBin);

  if (fsys === "b") {
    oBin.innerHTML = input.value;
    oDec.innerHTML = othersToDecimal(input.value, "binary");
    oHex.innerHTML = decimalToOthers(oDec.innerHTML, "hexa");
  } else if (fsys === "d") {
    oDec.innerHTML = input.value;
    oBin.innerHTML = decimalToOthers(input.value, "binary");
    oHex.innerHTML = decimalToOthers(input.value, "hexa");
  } else if (fsys === "h") {
    oHex.innerHTML = input.value;
    oDec.innerHTML = othersToDecimal(input.value, "hexa");
    oBin.innerHTML = decimalToOthers(oDec.innerHTML, "binary");
  }
}
