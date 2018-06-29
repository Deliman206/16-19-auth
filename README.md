### Documentation
This is a simple back-end router and database that allow the user to sign up with an email, username and password.
The application is deployed using Heroku on HTTPS protocol. This can be verified using a program like POSTMAN and hitting a GET route at
```
https://lab-20-deploy-lab-16.herokuapp.com/all
```
This will return an array of all the users and a status code of 200.

### Usage
To use this application locally the project should be cloned/forked to a local file directory.
Run the following command
```
npm i
```
to install the node module dependencies

### Testing
This application uses JEST to do unit testing and it can be viewed by running the following command

Turn on the Mongo DB:
```
npm run dbon
```
Then run the Test program:

```
npm run test
```

### Libraries & Frameworks
This application uses the following:
```
MongoDB
Express
Node.js
Jest
Superagent
```

