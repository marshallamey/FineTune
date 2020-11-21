# Authentication Server

## Configuration
The following environment variables need to be set:
NODE_ENV                Either 'development' or 'production'
NODE_PORT               3000 is the default
SPOTIFY_CLIENT_ID       Provided by developer.spotify.com
SPOTIFY_CLIENT_SECRET   Provided by developer.spotify.com
SPOTIFY_REDIRECT_URI    URL to redirect to auth server
SPOTIFY_CALLBACK_URI    URL to redirect to application

```
if (process.env.NODE_ENV == 'development' ) {
```

You need to create a file called dev.js in the config folder that contains all the environment variables above.
**dev.js is included in the .gitignore file and should not be committed.  Please double check!**

```
} else if ('production') {
```

You need to export the necessary environment variables to the host machine of the authentication server.

```
}
```

## Installation
### In Development
Enter the following commands in the terminal:
```
touch config/dev.js
echo 'module.exports = {
  spotifyClientID: "<<Spotify Client ID>>",
  spotifyClientSecret: "<<Spotify Client Secret>>",
  spotifyRedirectURI: "<<Spotify Redirect URI>>",
  spotifyCallbackURI: "<<Spotify Callback URI>>",
};' > config/dev.js
npm install
npm run dev
```

### In Production (AWS)
There is a CloudFormation template available
```
..\aws\auth-server.yaml
```

## Current Auth Flows
### FineTune.io >> Spotify
Based on simple REST principles, the Spotify Web API endpoints return JSON metadata about music artists, albums, and tracks, directly from the Spotify Data Catalogue.  All requests to Web API require authentication. This is achieved by sending a valid OAuth access token in the request header. For more information about these authentication methods and the Web API, see the [Web API Developer Guide.](https://developer.spotify.com/documentation/web-api/)


