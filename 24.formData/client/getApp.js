var submitData = document.querySelector("input[type='submit']");
// var submitData = document.querySelector("button");

var name = document.querySelector('input[name="firstName"]');
var email = document.querySelector('input[name="emailAddr"]');
var password = document.querySelector('input[name="userPassword"]');

console.log("Printing form fields getApp- ");
console.log(name.value, email.value, password.value);

console.log(
  name.value.length() && email.value.length() && password.value.length()
);
if (name.value.length() && email.value.length() && password.value.length()) {
  var getUrl = () => {
    var baseUrl = "http://127.0.0.1:3000/?";
    return `${baseUrl}name=${name.value}&email=${email.value}&password=${password.value}`;
  };

  axios({
    method: "GET",
    url: getUrl(),
    withCredentials: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }
  })
    .then(response => {
      console.log("Recevied Response back");
      console.log(response.data);
      document.querySelector("#output").innerHTML = response.data;
      setTimeout(() => {
        console.log("client object ");
      }, 4000);
    })
    .catch(error => console.log("Its an Error", error));
}
