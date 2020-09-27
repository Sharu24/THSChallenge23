// algorithm to generate the random token string which
// consists alphabets and numbers of length 20
// use only Math.random()

function getRandomToken() {
  var token = "",
    picker = 0;
  for (var i = 0; i < 20; i++) {
    picker = Math.floor(Math.random() * 3);
    if (picker === 0) token += Math.floor(Math.random() * 10);
    else if (picker === 1)
      token += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    else token += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }
  return token;
}

console.log(getRandomToken());
