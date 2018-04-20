# Face emotion detector

Cloud Journey #13 - Face emotion detector web application using Azure Cogintive Service APIs.

## Get Started

```javascript
// server/env/environment.js
const cosmosPort = 1234; // replace with your port
const dbName = 'your-cosmos-db-name-goes-here';
const key = 'your-key-goes-here';

module.exports = {
  cosmosPort,
  dbName,
  key
};
```

## Running The App

In development, the app runs via two separate processes...

### Start the Express Server

```bash
node server/server.js
```


### Start Create React App

In a different terminal tab...

```bash
npm start
```

## Building For Production

In production, you want Express to serve up your app.

### Build React App

```bash
npm build
```

Now start the Express server from the server folder

```bash
cd server
npm start
```

Your entire application is now running on port 3001.

Everything in the `server` folder is what is needed in production. Those are all of the build assets. 


