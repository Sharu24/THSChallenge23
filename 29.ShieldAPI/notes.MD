/\*
Implementing node JS with code Node JS Modules

1. Creating a Web Server using http
2. Handling URL, Request and Response using URL, path, Event Emitters
3. Build Router and Route Handles using callbacks
4. Build Secure Access ( SSL) using openSSL and https

\*/

# Assignments -

## User Schema -

firstName - String
lastName - String
mobileNumber - Number (Unique)
email - String
terms - Boolean
\_id - new Date() (log the timestamp - in miliseconds)

## Instructions

1. Write an API to register a user in the above schema
   POST /users
2. Write an API to consolidate User Data
   GET /users - should give an Array of Objects (Exclude Passwords)
3. Write an API to add multiple Hobbies to the user
   PUT /hobby?mobileNumber=3003003003 - Array of hobbies
4. Write an API to access individual user data
   PUT /users?mobileNumber=3003003003
5. Write an API to Delete a hobby (Just one Hobby)
   PUT /hobby?mobileNumber=3003003003&hobby=sleeping
6. Write an API to calculate the age of user
   GET /age?mobileNumber=3003003003

{
"firstName" : "Steve",
"lastName": "Rogers",
"mobileNumber": "9876543210",
"emailAddress": "captain@avengers.com",
"userPassword": "Ca@avenger123",
"tcAgreement": true
}

"hobbies": ['running','boxing','dating']

{
"firstName" : "Tony",
"lastName": "Stark",
"mobileNumber": "3000300033",
"emailAddress": "imim@avengers.com",
"userPassword": "Iron@3000",
"tcAgreement": true
}

{
"firstName" : "Natasha",
"lastName": "Romanoff",
"mobileNumber": "4204204204",
"emailAddress": "bwidow@avengers.com",
"userPassword": "Black420@widow",
"tcAgreement": true
}

{
"firstName" : "Bruce",
"lastName": "Banner",
"mobileNumber": "1234567890",
"emailAddress": "hulk@avengers.com",
"userPassword": "Nooo00@eg",
"tcAgreement": true
}

{
"firstName" : "Thor",
"lastName": "SonOfOdin",
"mobileNumber": "9999999999",
"emailAddress": "god@avengers.com",
"userPassword": "Thunder123@",
"tcAgreement": true
}
{
"firstName" : "Clint",
"lastName": "Barton",
"mobileNumber": "7777222211",
"emailAddress": "hawkeye@avengers.com",
"userPassword": "archeR77@",
"tcAgreement": true
}
