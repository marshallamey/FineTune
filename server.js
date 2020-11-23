/**
 * This is a node.js script that performs the Authorization Code oAuth2
 *  flow to authenticate against Spotify accounts.
 *
 * For more information about Spotify Auth Flow, read the following:
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 **/

/* eslint-disable camelcase */
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path')
const cors = require('cors');
const AWS = require('aws-sdk');

const PORT = process.env.NODE_PORT || 8081;

const server = express();
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true, }))
server.use(cors())
server.use(cookieParser());
/* GET ENVIRONMENT VARIABLES */
AWS.config.region = 'us-west-2';
const ssm = new AWS.SSM();
const vars = {
    SPOTIFY_CLIENT_ID: '',
    SPOTIFY_CLIENT_SECRET: '',
    SPOTIFY_REDIRECT_URI: '',
    SPOTIFY_CALLBACK_URI: '',
};
for (const v in vars) {
    let value = ssm.getParameter({ Name: `/finetune.io/${v}`, WithDecryption: true }).promise()
    value.then(res => vars[v] = res.Parameter.Value)
    .catch(err => console.log("ERROR retrieving env variables from AWS:", err))
}

/* DETERMINE ROUTES */   
server.use('/spotify', require('./routes/spotify'))

/* DETERMINE NODE ENVIRONMENT */
if (process.env.NODE_ENV === 'production') {
    const root = path.join(__dirname, 'client', 'build')
    server.use(express.static(root));
    server.get("*", (req, res) => {
        res.sendFile('index.html', { root });
    })
} else {
server.use(express.static(`${__dirname}/public`))

}

/* LISTEN FOR TRAFFIC */
server.listen(PORT);
console.log(`finetune.io server listening on ${ PORT }`);
console.log(`Node environment set to ${ process.env.NODE_ENV }`);

/* eslint-enable */
