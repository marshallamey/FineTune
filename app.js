/**
 * This is a node.js script that performs the Authorization Code oAuth2
 *  flow to authenticate against the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
/* eslint-disable camelcase */
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const request = require('request');
const express = require('express');
const cors = require('cors');
const path = require('path');
const keys = require('./config/keys');

const app = express();
const client_id = keys.spotifyClientID;
const client_secret = keys.spotifyClientSecret;
const redirect_uri = keys.spotifyRedirectURI;
const stateKey = 'spotify_auth_state';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
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

app.get('/login', (req, res) => {
  const scope = 'user-read-private playlist-modify-public user-library-modify user-modify-playback-state user-read-playback-state user-read-currently-playing';
  const state = generateRandomString(16);

  res.cookie(stateKey, state);

  // your application requests authorization
  res.redirect(`https://accounts.spotify.com/authorize?${
    querystring.stringify({
      response_type: 'code',
      show_dialog: false,
      client_id,
      scope,
      redirect_uri,
      state,
    })}`);
});

app.get('/logout', (req, res) => {
  res.clearCookie(stateKey);
  res.redirect('/');
});

app.get('/callback', (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter
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
        redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: `Basic ${(Buffer.from(`${client_id}:${client_secret}`).toString('base64'))}`,
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const { access_token, refresh_token } = body;

        // we can also pass the token to the browser to make requests from there
        res.redirect(keys.spotifyCallbackURI
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

app.get('/refresh_token', (req, res) => {
  // requesting access token from refresh token
  const { refresh_token } = req.query;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { Authorization: `Basic ${(Buffer.from(`${client_id}:${client_secret}`).toString('base64'))}` },
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

if (process.env.NODE_ENV === 'production') {
  // Express will serve up production asset FILES (e.g., main.js, main.css)
  app.use(express.static('client/build'));

  // OR Express will serve up index.html ROUTES unrecognized
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 8888;
// console.log(`FineTune server started: Listening on ${  PORT}`);
app.listen(PORT);
/* eslint-enable */
