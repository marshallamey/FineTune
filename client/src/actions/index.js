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
  let plist = []
  const allPlaylists = await spotifyApi.getUserPlaylists({limit: 50, offset: 0 })
    .then(playlists => {
      plist.push(...playlists.items)
      const totalPages = Math.ceil(playlists.total/playlists.limit)
      for (let i = 1; i < totalPages; i++) {
        spotifyApi.getUserPlaylists({limit: 50, offset: i*50 })
        .then(morePlaylists => plist.push(...morePlaylists.items))
      }
    })
    .then(() => plist)
    .catch(err => console.log('getPlaylists()::', err))
  dispatch({ type: 'GET_PLAYLISTS', payload: allPlaylists || [] });
  return allPlaylists
}

async function addAudioFeatures(tracks) {
  const trackIds = tracks.items.map(x => x.track.id);
  const allTracksWithFeatures = await spotifyApi.getAudioFeaturesForTracks(trackIds)
    .then(res => {
      const tracksWithFeatures = tracks.items.map((track, index) => {
        const trackWithFeatures = track.track;
        trackWithFeatures.audio_features = res.audio_features[index];
        delete trackWithFeatures.available_markets
        delete trackWithFeatures.album.available_markets
        delete trackWithFeatures.album.artists
        return trackWithFeatures;
      });
      return tracksWithFeatures
    })
    return allTracksWithFeatures
}

    // Input: Array of Spotify playlists
    // Output: Array of Spotify tracks from all the playlists + any saved tracks
    // ** To only retrieve liked songs (saved tracks), provide no argument
async function getPlaylistTracks(playlists) {
  let allPlaylistTracks = []
  for (let i = 0; i < playlists.length; i++) {
    const playlistTracks = await spotifyApi.getPlaylistTracks(playlists[i].owner.id, playlists[i].id, {limit: 100, offset: 0 })
      .then( async tracks => {
        const allTracks = []
        const tracksWithFeatures = await addAudioFeatures(tracks)
        allTracks.push(...tracksWithFeatures)
        const totalPages = Math.ceil(tracks.total/tracks.limit)
        for (let j=1; j<totalPages; j++) {
          const moreTracks = await spotifyApi.getPlaylistTracks(playlists[j].owner.id, playlists[j].id, {limit: 100, offset: i*50 })
          const moreTracksWithFeatures = await addAudioFeatures(moreTracks)
        allTracks.push(...moreTracksWithFeatures)
        }
        return allTracks
      })
      .catch(err => console.log('getPlaylistTracks()::', err))   
      allPlaylistTracks.push(...playlistTracks)
  }
  return allPlaylistTracks
}
    
async function getSavedTracks() {
  const allSavedTracks = await spotifyApi.getMySavedTracks({limit: 50, offset: 0 })
    .then( async tracks => {
      const allTracks = []
      const tracksWithFeatures = await addAudioFeatures(tracks)
      allTracks.push(...tracksWithFeatures)
      const totalPages = Math.ceil(tracks.total/tracks.limit)
      for (let i=1; i<totalPages; i++) {
        const moreTracks = await spotifyApi.getMySavedTracks({limit: 50, offset: i*50 })
        const moreTracksWithFeatures = await addAudioFeatures(moreTracks)
        allTracks.push(...moreTracksWithFeatures)
      }
      return allTracks
    })
    .catch(err => {console.log('getSavedTracks()::', err); return []})   
    return allSavedTracks 
  }

export const getTracks = (accessToken, playlists) => async (dispatch) => {
  let p = await getPlaylists(accessToken)
  let tracks = await getPlaylistTracks(playlists)
  let savedTracks = await getSavedTracks()
  const allSongs = [...tracks, ...savedTracks]
  console.log('FINISHED!! allTracks', allSongs)
  dispatch({ type: 'GET_TRACKS', payload: allSongs });
  return allSongs
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

const filters = {
  tempo: {
    min_tempo: 40,
    max_tempo: 300,
  },
  popularity: {
    min_popularity: 0,
    max_popularity: 100,
  },
  duration: {
    min_duration: 60000,
    max_duration: 1800000,
  },
  acoustic: {
    min_acousticness: 0.0,
    max_acousticness: 1.0,
  },
  valence: {
    min_valence: 0.0,
    max_valence: 1.0,
  },
  words: {
    min_speechiness: 0.0,
    max_speechiness: 1.0,
    min_instrumentalness: 0.0,
    max_instrumentalness: 1.0,
  },
  energy: {
    min_energy: 0.0,
    max_energy: 1.0,
    min_danceability: 0.0,
    max_danceability: 1.0,
  },
  key: {
    target_key: 0,
    target_mode: 1,
  },
}

function filterByAudioFeatures(songs, filters) {
  songs.filter(song => { 
    return filters.hasOwnProperty('words') ? wordFilter(song.audio_features) : true 
    && filters.hasOwnProperty('key') ? keyFilter(song.audio_features) : true
    && filters.hasOwnProperty('energy') ? energyFilter(song.audio_features) : true
    && filters.hasOwnProperty('popularity') ? mainFilter(song, 'popularity') : true
    && filters.hasOwnProperty('tempo') ? mainFilter(song.audio_features, 'tempo') : true
    && filters.hasOwnProperty('mood') ? mainFilter(song.audio_features, 'valence') : true
    && filters.hasOwnProperty('duration') ? mainFilter(song.audio_features, 'duration') : true
    && filters.hasOwnProperty('acoustic') ? mainFilter(song.audio_features, 'acoustic') : true
  })

  function mainFilter(song, feature) {
    return song[feature] >= filters[feature].min_popularity 
    && song[feature] <= filters[feature].max_popularity
  }
  function wordFilter(song) {
    return song.speechiness   >= filters.words.min_speechiness 
    && song.speechiness       <= filters.words.min_speechiness
    && song.instrumentalness  >= filters.words.min__instrumentalness 
    && song.instrumentalness  <= filters.words.max__instrumentalness
  }
  function energyFilter(song) {
    return song.energy   >= filters.energy.min_energy 
    && song.energy       <= filters.energy.max_energy
    && song.danceability >= filters.energy.min_danceability
    && song.danceability <= filters.energy.max_danceability
  }
  function keyFilter(song) {
    return song.key === filters.key.target_key 
    && song.mode <= filters.key.target_mode
  }
}

function filterByPlaylists (songs, playlistIds) {
  return songs.filter(song => playlistIds.includes(song.playlist_id))
}