// routes/spotify.js
const querystring = require('querystring');
const request = require('request');
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

/* GET ENVIRONMENT VARIABLES */
AWS.config.region = 'us-west-2';
const ssm = new AWS.SSM();
const vars = {
    SPOTIFY_CLIENT_ID: '',
    SPOTIFY_CLIENT_SECRET: '',
    SPOTIFY_REDIRECT_URI: '',
    SPOTIFY_CALLBACK_URI: '',
};
const secretsPath = process.env.NODE_ENV === 'production' ? '/finetune.io' : '/finetune.io/dev'
for (const v in vars) {
    let value = ssm.getParameter({ Name: `${secretsPath}/${v}`, WithDecryption: true }).promise()
    value.then(res => vars[v] = res.Parameter.Value)
    .catch(err => console.log("ERROR retrieving env variables from AWS:", err))
}

const stateKey = 'spotify_auth_state';
/** Generate a random string containing numbers and letters **/
const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


// AUTH ROUTES
/* FineTune sends request for authorization to Spotify */
router.get('/login', (req, res) => {   
    console.log('hello?')
  const scope = 'user-read-private playlist-modify-public user-library-modify user-library-read user-modify-playback-state user-read-playback-state user-read-currently-playing';
  const stateValue = generateRandomString(16);
  res.cookie(stateKey, stateValue);  
  res.redirect(`https://accounts.spotify.com/authorize?${
      querystring.stringify({
      response_type: 'code',
      show_dialog: true,
      client_id: vars.SPOTIFY_CLIENT_ID,
      scope,
      redirect_uri: vars.SPOTIFY_REDIRECT_URI,
      state: stateValue,
  })}`);
});

/* FineTune removes authorization to Spotify */
router.get('/logout', (req, res) => {
  res.clearCookie(stateKey);
  process.env.NODE_ENV === 'prod' ? res.redirect('http://finetune.io') : res.redirect('http://localhost:3000')
});

/* Finetune requests refresh and access tokens after checking the state parameter */
router.get('/callback', (req, res) => {
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
              redirect_uri: vars.SPOTIFY_REDIRECT_URI,
              grant_type: 'authorization_code',
          },
          headers: {
              Authorization: `Basic ${(Buffer.from(`${vars.SPOTIFY_CLIENT_ID}:${vars.SPOTIFY_CLIENT_SECRET}`).toString('base64'))}`,
          },
          json: true,
      };

      request.post(authOptions, (error, response, body) => {
          if (!error && response.statusCode === 200) {
              const { access_token, refresh_token } = body;
              // we can also pass the token to the browser to make requests from there
              res.redirect(vars.SPOTIFY_CALLBACK_URI
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
router.get('/refresh_token', (req, res) => {
  const { refresh_token } = req.query;
  const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { Authorization: `Basic ${(Buffer.from(`${vars.SPOTIFY_CLIENT_ID}:${vars.SPOTIFY_CLIENT_SECRET}`).toString('base64'))}` },
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

module.exports = router;