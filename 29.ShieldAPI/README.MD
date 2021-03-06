# Avengers Registrations API -

## Implementing node JS with Core Node JS Modules

1. Creating a Web Server using http
2. Build Secure Access ( SSL) using openSSL and https
3. Handling Request Query Parameters, Request Objects
4. Propogate Responses with Callbacks
5. Build Router and Route Handlers using callbacks
6. Validate User Attributes and Values
7. Segregate Modules and define ownerships

## User Schema -

| Field Name   | Data Type | Unique |
| ------------ | --------- | ------ |
| firstName    | String    | No     |
| lastName     | String    | No     |
| mobileNumber | Number    | Yes    |
| email        | String    | No     |
| terms        | Boolean   | No     |
| _id          | timestamp | No     |


![Image of Avengers]
(https://github.com/Sharu24/THSChallenge23/blob/master/29.ShieldAPI/Avengers.png)

## High Level API Routes

1. Register an Avenger
   > POST /users
2. Consolidate and return an Array of Avengers with their details
   > GET /users - should give an Array of Objects (Exclude Passwords)
3. Add Hobbies to an Avenger
   > PUT /hobby?mobileNumber='XXX' - Array of hobbies
4. Get An Avenger Data
   > GET /users?mobileNumber='XXX'
5. Update an Avenger Data
   > PUT /users?mobileNumber='XXX'
6. Delete a hobby
   > PUT /hobby?mobileNumber='XXX'&hobby=YYY
7. Fetch an Avenger's Experience
   > GET /age?mobileNumber='XXX'
8. Bulk Load Avengers
   > POST /load

---------------------------------------------------------------------------

### Register an Avenger
#### POST 
##### http://localhost:4000/users/
```
{
   "firstName" : "Steve",
   "lastName": "Rogers",
   "mobileNumber": "9876543210",
   "emailAddress": "captain@avengers.com",
   "userPassword": "Ca@avenger123",
   "tcAgreement": true
}
```
---------------------------------------------------------------------------

### Add Hobbies to an Avenger
#### PUT 
##### /hobby?mobileNumber=9876543210

```
{
   "hobbies": ['running','boxing','dating']
}
```
---------------------------------------------------------------------------
### Get An Avenger Data
#### GET
##### /users?mobileNumber=9876543210


---------------------------------------------------------------------------
### Update An Avenger
#### PUT
##### /users?mobileNumber=9876543210

```
{
   "mobileNumber": "9876543210",
   "emailAddress":"Steve@avengers.com"
}
```
---------------------------------------------------------------------------
### Delete Hobby of an Avenger
#### PUT
##### /hobby?mobileNumber=9876543210&hobbies=boxing
---------------------------------------------------------------------------
### Get All Avengers
#### GET
##### /users
---------------------------------------------------------------------------
### Get Employment years for an Avenger
#### GET
##### /age?mobileNumber=9876543210
---------------------------------------------------------------------------
### Bulk Load Avengers
#### POST
##### /load
```
[
   {
      "firstName" : "Tony",
      "lastName": "Stark",
      "mobileNumber": "3000300033",
      "emailAddress": "imim@avengers.com",
      "userPassword": "Iron@3000",
      "tcAgreement": true
   },
   {
      "firstName" : "Natasha",
      "lastName": "Romanoff",
      "mobileNumber": "4204204204",
      "emailAddress": "bwidow@avengers.com",
      "userPassword": "Black420@widow",
      "tcAgreement": true
   },
   {
      "firstName" : "Bruce",
      "lastName": "Banner",
      "mobileNumber": "1234567890",
      "emailAddress": "hulk@avengers.com",
      "userPassword": "Nooo00@eg",
      "tcAgreement": true
   },
   {
      "firstName" : "Thor",
      "lastName": "SonOfOdin",
      "mobileNumber": "9999999999",
      "emailAddress": "god@avengers.com",
      "userPassword": "Thunder123@",
      "tcAgreement": true
   },
   {
      "firstName" : "Clint",
      "lastName": "Barton",
      "mobileNumber": "7777222211",
      "emailAddress": "hawkeye@avengers.com",
      "userPassword": "archeR77@",
      "tcAgreement": true
   }
]
```
### Heroku Depoyment
1. Create an account in Heroku
2. npm init -y
3. package.json
  "main": "index.js",
  "directories": {
    "lib": "lib"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js"
  },
  "engines": {
    "node": "12.x"
  },
4. heroku login
5. heroku create
6. git add .
7. git status
   1. Should be clean
8. git remote -v
   1. This displays heroku URL with git URL's
9.  git remote add heroku https://git.heroku.com/mysterious-wave-42132.git
10. git add .
11. git commit -m "added"
12. git push heroku master
13. heroku apps:rename sharu24