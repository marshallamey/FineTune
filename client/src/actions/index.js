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

export const setPlaylistName = name => ({
    type: 'SET_PLAYLIST_NAME',
    payload: name,
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

export const deleteSong = (songs, index) => async (dispatch) => {
    console.log(" DELETING ==> ", index);
    let newSongs = [...songs];
    newSongs.splice(index, 1);
    dispatch({type: 'DELETE_SONG', payload: newSongs });
};

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

// get all playlists
export const getPlaylists = accessToken => async (dispatch) => {
  spotifyApi.setAccessToken(accessToken);
  let ap = []
  const allPlaylists = await spotifyApi.getUserPlaylists({limit: 50, offset: 0 })
    .then(res => {
      ap.push(...res.items)
      const totalPages = Math.ceil(res.total/res.limit)
      for (let i=1; i<totalPages; i++) {
        spotifyApi.getUserPlaylists({limit: 50, offset: i*50 })
        .then(playlists => ap.push(...playlists.items))
      }
    })
    .then(() => ap)
    .catch(err => console.log('getPlaylists()::', err))
    console.log('returning playlists', allPlaylists)
  dispatch({ type: 'GET_PLAYLISTS', payload: allPlaylists });
  return allPlaylists
}

    // Input: Array of Spotify playlists
    // Output: Array of Spotify tracks from all the playlists + any saved tracks
    // ** To only retrieve liked songs (saved tracks), provide no argument
async function getPlaylistTracks(playlists) {
  let x = []
  for (let i=0; i<playlists.length; i++) {
    const q = await spotifyApi.getPlaylistTracks(playlists[i].owner.id, playlists[i].id, {limit: 100, offset: 0 })
      .then(async res => {
        const allTracks = []
        allTracks.push(...res.items)
        const totalPages = Math.ceil(res.total/res.limit)
        for (let j=1; j<totalPages; j++) {
          const moreTracks = await spotifyApi.getPlaylistTracks(playlists[j].owner.id, playlists[j].id, {limit: 100, offset: i*50 })
          allTracks.push(...moreTracks.items)
        }
        return allTracks
      })
      .catch(err => console.log('getAllTracksFromPlaylist()::', err))   
      console.log('q=', q)
      x.push(...q)
  }
  console.log('x=', x)
  return x
}
    
async function getSavedTracks() {
  
  // Look for saved tracks first
  const p = await spotifyApi.getMySavedTracks({limit: 50, offset: 0 })
    .then(async res => {
      const allTracks = []
      allTracks.push(...res.items)
      const totalPages = Math.ceil(res.total/res.limit)
      for (let i=1; i<totalPages; i++) {
        const moreTracks = await spotifyApi.getMySavedTracks({limit: 50, offset: i*50 })
        allTracks.push(...moreTracks.items)
      }
      return allTracks
    })
    .catch(err => console.log('getAllTracksFromPlaylist()::', err))   
    console.log(p)
    return p  
  }

export const getTracks = (accessToken, playlists) => async (dispatch) => {
  let p = await getPlaylists(accessToken)
  let tracks = await getPlaylistTracks(playlists)
  let savedTracks = await getSavedTracks()
  dispatch({ type: 'GET_TRACKS', payload: [...tracks, ...savedTracks] });
  return [...tracks, ...savedTracks]
}

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
