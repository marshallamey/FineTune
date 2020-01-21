import SpotifyWebApi from 'spotify-web-api-js';
import axios from 'axios';
import {AuthServerURL} from '../js/Helpers.js';

const spotifyApi = new SpotifyWebApi();

export const selectGenre = genres => ({
  type: 'SELECT_GENRE',
  payload: genres,
});

export const addSongs = songs => ({
  type: 'ADD_SONGS',
  payload: songs,
});

export const setRedirect = redirect => ({
  type: 'SET_REDIRECT',
  payload: redirect,
});

export const setKeyword = keyword => ({
  type: 'SET_KEYWORD',
  payload: keyword,
});

export const changeAttributes = attributes => ({
  type: 'CHANGE_ATTRIBUTES',
  payload: attributes,
});

export const resetAttributes = () => ({
  type: 'RESET_ATTRIBUTES',
});

export const togglePopover = popovers => ({
  type: 'TOGGLE_POPOVER',
  payload: popovers,
});

export const getTokens = tokens => ({
  type: 'GET_TOKENS',
  payload: tokens,
});

export const getExpireTime = expireTime => async (dispatch) => {
  //  console.log('FINETUNEAPP(actions.getExpireTime):: Access Token Expires ==> ', expireTime);
  dispatch({ type: 'GET_EXPIRE_TIME', payload: expireTime });
};

export const getUser = accessToken => async (dispatch) => {
  spotifyApi.setAccessToken(accessToken);
  const user = await spotifyApi.getMe();
  // console.log('FINETUNEAPP(actions.getUser):: Fetching User ==> ', user);
  dispatch({ type: 'GET_USER', payload: user });
};

export const getGenres = accessToken => async (dispatch) => {
  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
  spotifyApi.setAccessToken(accessToken);
  const allGenres = await spotifyApi.getAvailableGenreSeeds()
    .then((genres) => {
      const g = genres.genres.map((genre, index) => ({
        name: capitalize(genre),
        id: index,
      }));
      return g;
    });
  // console.log('FINETUNEAPP(actions.getGenres):: Fetching Available genres ==> ', allGenres);
  dispatch({ type: 'GET_GENRES', payload: allGenres });
};


export const getDevices = accessToken => async (dispatch) => {
  spotifyApi.setAccessToken(accessToken);
  const allDevices = await spotifyApi.getMyDevices()
    .then((res) => {
      const devices = {};
      // If there are available devices, save the IDs
      if (res) {
        res.devices.forEach((device) => {
          devices[device.type] = device.id;
        });
      }
      return devices;
    });
    // .catch((err) => {
    // console.log('FINETUNEAPP(actions.getDevices):: ERROR RETRIEVING DEVICES ==> ', err); });
  // console.log('FINETUNEAPP(actions.getDevices):: Fetching Devices ==> ', allDevices);
  dispatch({ type: 'GET_DEVICES', payload: allDevices });
};

export const refreshTokens = spotifyTokens => async (dispatch) => {
  console.log('FINETUNEAPP(actions.refreshTokens)::  Attempting to refresh access token...');
  console.log('FINETUNEAPP(actions.refreshTokens):: Old Access Token ==> ', spotifyTokens.access_token);
  console.log('FINETUNEAPP(actions.refreshTokens):: Refresh Token ==> ', spotifyTokens.refresh_token);
  const newSpotifyTokens = await axios({
    method: 'GET',
    url: `${AuthServerURL}/spotify/refresh_token`,
    params: { refresh_token: spotifyTokens.refresh_token },
  })
    .then((res) => {
        console.log("SUCCESS!! =>", res.data.access_token);
      const response = {
        access_token: res.data.access_token,
        refresh_token: spotifyTokens.refresh_token,
      };
      return response;
    })
    .catch((err) => {
        console.log("ERROR!! =>", err)
      const response = {
        access_token: spotifyTokens.access_token,
        refresh_token: spotifyTokens.refresh_token,
      };
      return response;
    });
  console.log('FINETUNEAPP(actions.refreshTokens):: New Spotify Tokens ==> ', newSpotifyTokens);
  dispatch({ type: 'REFRESH_TOKENS', payload: newSpotifyTokens });
};
