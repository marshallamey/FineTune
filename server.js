/**
 * This is a node.js script that performs the Authorization Code oAuth2
 *  flow to authenticate against multiple accounts.
 *
 * For more information about Spotify Auth Flow, read the following:
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 **/

/* eslint-disable camelcase */
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const request = require('request');
const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');
const stateKey = 'spotify_auth_state';

const app = express();
console.log('AUTH SERVER STARTED...');

/** Get environment variables from AWS Parameter Store **/
// if (process.env.NODE_ENV !== 'prod') {
//     var myCredentials = new AWS.SharedIniFileCredentials({profile: 'default'});
//     AWS.config.credentials = myCredentials;
// }

AWS.config.region = 'us-west-2';


const ssm = new AWS.SSM();
let keys = {
    SPOTIFY_CLIENT_ID: '',
    SPOTIFY_CLIENT_SECRET: '',
    SPOTIFY_REDIRECT_URI: '',
    SPOTIFY_CALLBACK_URI: '',
    WEBSITE_KEY: '',
};
for (const key in keys) {
    let value = ssm.getParameter({ Name: key, WithDecryption: true }).promise();
    value.then(res => { 
        console.log("HEY!" + res);
        keys[key] = res.Parameter.Value; 
    })
    .catch( err => { console.log(err); })
}
ssm.getParameter({ Name: "/MJAdmin/WEBSITE_KEY", WithDecryption: true }).promise()
    .then(res => { keys['WEBSITE_KEY'] = res.Parameter.Value })
    .catch( err => err)
    
/** Generate a random string containing numbers and letters **/
const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i += 1) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


app.use(express.static(`${__dirname}/public`))
    .use(cors())
    .use(cookieParser());

app.get('/', (req,res) => {
    res.send('Auth Server running...');
});

/* FineTune removes authorization to Spotify */
app.get('/marshallamey/login', (req, res) => {
    console.log(req.query.key)
    const key = req.query.key || null;
    if (key === keys.WEBSITE_KEY) res.redirect('http://marshallamey.com/dashboard')
    else res.redirect('http://marshallamey.com/login');
});

/* FineTune sends request for authorization to Spotify */
app.get('/spotify/login', (req, res) => {   
    const scope = 'user-read-private playlist-modify-public user-library-modify user-modify-playback-state user-read-playback-state user-read-currently-playing';
    const stateValue = generateRandomString(16);
    res.cookie(stateKey, stateValue);  
    res.redirect(`https://accounts.spotify.com/authorize?${
        querystring.stringify({
        response_type: 'code',
        show_dialog: false,
        client_id: keys.SPOTIFY_CLIENT_ID,
        scope,
        redirect_uri: keys.SPOTIFY_REDIRECT_URI,
        state: stateValue,
    })}`);
});

/* FineTune removes authorization to Spotify */
app.get('/spotify/logout', (req, res) => {
    res.clearCookie(stateKey);
    res.redirect('http://finetune.io/');
});

/* Finetune requests refresh and access tokens after checking the state parameter */
app.get('/spotify/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect(`/#${
            querystring.stringify({
                error: 'state_mismatch',
        })}`);
    } else {
        res.clearCookie(stateKey);
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code,
                redirect_uri: keys.SPOTIFY_REDIRECT_URI,
                grant_type: 'authorization_code',
            },
            headers: {
                Authorization: `Basic ${(Buffer.from(`${keys.SPOTIFY_CLIENT_ID}:${keys.SPOTIFY_CLIENT_SECRET}`).toString('base64'))}`,
            },
            json: true,
        };

        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const { access_token, refresh_token } = body;
                // we can also pass the token to the browser to make requests from there
                res.redirect(keys.SPOTIFY_CALLBACK_URI
                    + querystring.stringify({
                    access_token,
                    refresh_token,
                    }));
            } else {
                res.redirect(`/#${querystring.stringify({ error: 'invalid_token' })}`);
            }
        });
    }
});

/* FineTune requests access token from Spotify using refresh token */
app.get('/spotify/refresh_token', (req, res) => {
    const { refresh_token } = req.query;
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { Authorization: `Basic ${(Buffer.from(`${keys.SPOTIFY_CLIENT_ID}:${keys.SPOTIFY_CLIENT_SECRET}`).toString('base64'))}` },
        form: {
        grant_type: 'refresh_token',
        refresh_token,
        },
        json: true,
    };

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const { access_token } = body;
            res.send({
                access_token,
            });
        }
    });
});

// if (process.env.NODE_ENV === 'production') {
//     // Express will serve up production asset FILES (e.g., main.js, main.css)
//     app.use(express.static('../client/build'));

//     // OR Express will serve up index.html ROUTES unrecognized
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
//     });
// }

const PORT = process.env.NODE_PORT || 8081;
console.log(`FineTune Server started: Listening on ${ PORT }`);
app.listen(PORT);

/* eslint-enable */
