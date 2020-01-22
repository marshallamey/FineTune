import SpotifyWebApi from 'spotify-web-api-js';
import axios from 'axios';
import {
  genreToast, searchingToast, trackSavedToast, playingToast, listCreatedToast,
} from './Toasts';

const spotifyApi = new SpotifyWebApi();

export const AuthServerURL = "http://ec2-44-229-197-205.us-west-2.compute.amazonaws.com"

/* areTokensAvailable()::
** Looks at the URL to find tokens from callback
** If a user has signed in to spotify, they will be available
** Function returns tokens if available, returns false otherwise
**************************************************************************** */
export const areTokensAvailable = (props) => {
  const tokens = {};
  let e; const r = /([^&;=]+)=?([^&;]*)/g;
  const q = window.location.hash.substring(1);
  e = r.exec(q);
  while (e) {
    tokens[e[1]] = decodeURIComponent(e[2]);
    e = r.exec(q);
  }
  // console.log('FINETUNEAPP(App.fetchTokens):: Retrieving Spotify tokens ==> ', tokens);
  if (tokens.access_token && tokens.refresh_token) {
    props.getTokens(tokens);
    return tokens;
  }
  return false;
};

/* connectToSpotify()::
** After user logs in, the access and refresh tokens are retrieved
** The current time and expire time are set and a connection to the
** Spotify API is created.  The API is then used to retrieve the user's
** id, available devices, and an array of genres
**************************************************************************** */
export const connectToSpotify = (props, tokens) => {
  // console.log('FINETUNEAPP(App.connectToSpotify):: Retrieving Spotify data');

  if (tokens.access_token) {
    // Get current time and expire time of access token
    const d = new Date();
    const currentTime = d.getTime();
    // console.log('FINETUNEAPP(App.connectToSpotify):: Current time ==> ', currentTime);
    if (!props.expireTime) props.getExpireTime(currentTime + 3500000);

    // Connect to spotify API
    spotifyApi.setAccessToken(tokens.access_token);
    // Get user id from Spotify
    props.getUser(tokens.access_token);
    // Get available genres from Spotify
    props.getGenres(tokens.access_token);
    // Get available user devices from Spotify
    props.getDevices(tokens.access_token);
  }
};

/* millisToMinutesAndSeconds()::
** Display the proper time for duration attribute and for token expiration time
**************************************************************************** */
export const millisToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

/* isTokenExpired()::
** Check if access token is expired.  Return true if valid, else return false
**************************************************************************** */
export const isTokenExpired = (props) => {
  const { expireTime } = props;
  const dd = new Date();
  if (expireTime && dd.getTime() >= expireTime) {
    console.log('FINETUNEAPP(Helper):: ACCESS TOKEN EXPIRED');
    return true;
  }
  console.log('FINETUNEAPP(Helper):: TOKEN VALID',
    millisToMinutesAndSeconds(expireTime - dd.getTime()),
    'remaining');
  return false;
};

/* getNewToken()::
** Request a new access token asynchronously. Update expireTime
**************************************************************************** */
export const getNewToken = async (props) => {
  await props.refreshTokens(props.spotifyTokens);
  const d = new Date();
  const currentTime = d.getTime();
  props.getExpireTime(currentTime + 3500000);
};

/* onGenreChange()::
** Create a new array of selected genres each time user changes selection
**************************************************************************** */
export const onGenreChange = (props, options) => {
  const genres = [];
  for (let i = 0; i < options.length; i += 1) {
    if (options[i].selected) genres.push(options[i].value);
  }
  // console.log('FINETUNEAPP(MusicSearchForm):: Currently selected genres ==> ', genres);
  props.selectGenre(genres);
};

export const submitSongSearch = (props, event) => {
  event.preventDefault();
  searchingToast();
  spotifyApi.setAccessToken(props.spotifyTokens.access_token);
  spotifyApi.searchTracks(props.keyword)
    .then((songs) => {
      // Get the IDs FINETUNEAPP(MusicSearchForm)::of all songs returned
      const songIds = songs.tracks.items.map(song => song.id);
      // console.log('FINETUNEAPP(MusicSearchForm):: (4)Fetching IDs of songs ==> ', songIds);

      // API request to fetch audio features for each song
      spotifyApi.getAudioFeaturesForTracks(songIds)
        .then((res) => {
          // console.log('FINETUNEAPP(MusicSearchForm)::
          // (5)Fetching song attributes ==> ', res.audio_features);

          // Update state ONCE with songs and features
          // Attach audio features to song
          const songsWithFeatures = songs.tracks.items.map((song, index) => {
            const songWithFeatures = song;
            songWithFeatures.audio_features = res.audio_features[index];
            return songWithFeatures;
          });
          props.setRedirect(true);
          props.addSongs(songsWithFeatures);
        });
    });
};

/* musicSearch()::
** Make a Spotify API request for music using the searchProps object
**************************************************************************** */
export const musicSearch = (props, searchProps) => {
  spotifyApi.setAccessToken(props.spotifyTokens.access_token);
  // API request to fetch songs
  spotifyApi.getRecommendations(searchProps)
    .then((songs) => {
      // console.log('FINETUNEAPP(MusicSearchForm)::
      // (3)Retrieving songs from Spotify ==> ', songs.tracks);

      // Get the IDs FINETUNEAPP(MusicSearchForm)::of all songs returned
      const songIds = songs.tracks.map(song => song.id);
      // console.log('FINETUNEAPP(MusicSearchForm):: (4)Fetching IDs of songs ==> ', songIds);

      // API request to fetch audio features for each song
      spotifyApi.getAudioFeaturesForTracks(songIds)
        .then((res) => {
          // console.log('FINETUNEAPP(MusicSearchForm)::
          // (5)Fetching song attributes ==> ', res.audio_features);

          // Update state ONCE with songs and features
          // Attach audio features to song
          const songsWithFeatures = songs.tracks.map((song, index) => {
            const songWithFeatures = song;
            songWithFeatures.audio_features = res.audio_features[index];
            return songWithFeatures;
          });
          props.setRedirect(true);
          props.addSongs(songsWithFeatures);
        });
    });
};

/* handleSubmit():: Create a searchProps object containing all the
** user's search criteria. Used as an argument in musicSearch()
**************************************************************************** */
export const handleSubmit = async (props, event) => {
  event.preventDefault();
  searchingToast();

  // Redirect to home if access token expired
  if (props.spotifyTokens.access_token && isTokenExpired(props)) {
    console.log('START:: Getting new token');
    getNewToken(props);
  }

  // Validate genre selection (0 < genres <= 5)
  if (!props.selectedGenres.length || props.selectedGenres.length > 5) {
    genreToast();
    return;
  }

  // Make sure genres are lower case before submitting
  const genres = props.selectedGenres.map(genre => genre.toLowerCase());

  // Add selected properties to Spotify API request
  const searchProps = { seed_genres: genres };
  if (props.attributes.min_acousticness !== 0.0 || props.attributes.max_acousticness !== 1.0) {
    searchProps.min_acousticness = props.attributes.min_acousticness;
    searchProps.max_acousticness = props.attributes.max_acousticness;
  }
  if (props.attributes.min_danceability !== 0.0 || props.attributes.max_danceability !== 1.0) {
    searchProps.min_danceability = props.attributes.min_danceability;
    searchProps.max_danceability = props.attributes.max_danceability;
  }
  if (props.attributes.min_energy !== 0.0 || props.attributes.max_energy !== 1.0) {
    searchProps.min_energy = props.attributes.min_energy;
    searchProps.max_energy = props.attributes.max_energy;
  }
  if (props.attributes.min_instrumentalness !== 0.0
    || props.attributes.max_instrumentalness !== 1.0) {
    searchProps.min_instrumentalness = props.attributes.min_instrumentalness;
    searchProps.max_instrumentalness = props.attributes.max_instrumentalness;
  }
  if (props.attributes.min_liveness !== 0.0 || props.attributes.max_liveness !== 1.0) {
    searchProps.min_liveness = props.attributes.min_liveness;
    searchProps.max_liveness = props.attributes.max_liveness;
  }
  if (props.attributes.min_loudness !== -60 || props.attributes.max_loudness !== 0) {
    searchProps.min_loudness = props.attributes.min_loudness;
    searchProps.max_loudness = props.attributes.max_loudness;
  }
  if (props.attributes.min_popularity !== 0 || props.attributes.max_popularity !== 100) {
    searchProps.min_popularity = props.attributes.min_popularity;
    searchProps.max_popularity = props.attributes.max_popularity;
  }
  if (props.attributes.min_speechiness !== 0.0 || props.attributes.max_speechiness !== 1.0) {
    searchProps.min_speechiness = props.attributes.min_speechiness;
    searchProps.max_speechiness = props.attributes.max_speechiness;
  }
  if (props.attributes.min_tempo !== 40 || props.attributes.max_tempo !== 200) {
    searchProps.min_tempo = props.attributes.min_tempo;
    searchProps.max_tempo = props.attributes.max_tempo;
  }
  if (props.attributes.min_valence !== 0.0 || props.attributes.max_valence !== 1.0) {
    searchProps.min_valence = props.attributes.min_valence;
    searchProps.max_valence = props.attributes.max_valence;
  }
  if (props.attributes.min_duration !== 60000 || props.attributes.max_duration !== 1800000) {
    searchProps.min_duration = props.attributes.min_duration;
    searchProps.max_duration = props.attributes.max_duration;
  }
  if (!props.attributes.signatureDisabled) {
    searchProps.target_time_signature = props.attributes.target_time_signature;
  }
  if (!props.attributes.modeDisabled) searchProps.target_mode = props.attributes.target_mode;
  if (!props.attributes.keyDisabled) searchProps.target_key = props.attributes.target_key;

  console.log('FINETUNEAPP(MusicSearchForm):: (2)Sending these search props ==> ', searchProps);
  musicSearch(props, searchProps);
};

/* createNewPlaylist()::
** Make a Spotify API request to create a playlist with found music
**************************************************************************** */
export const createNewPlaylist = (props, songURIs) => {
  const { user, spotifyTokens, devices } = props;
  // Redirect to home if access token expired
  if (spotifyTokens.access_token && isTokenExpired(props)) {
    console.log('START:: Getting new token');
    getNewToken(props);
  }
  spotifyApi.setAccessToken(spotifyTokens.access_token);
  const date = new Date().toLocaleString();
  // Create a Spotify playlist
  spotifyApi.createPlaylist(user.id, { name: `FineTune Playlist ${date}` })
    .then((playlist) => {
      // Add the tracks to the playlist
      spotifyApi.addTracksToPlaylist(user.id, playlist.id, songURIs)
        .then(() => {
          listCreatedToast();
          const device = Object.values(devices);
          if (device.length === 0) {
            // Open playlist on the web if no available device
            window.open(playlist.external_urls.spotify, '_blank');
          } else {
            // Start the playlist on the first available device
            spotifyApi.play({
              device_id: device[0],
              context_uri: playlist.uri,
            });
          }
        });
    });
};

/* saveTracks()::
** Make a Spotify API request to save array of tracks to library
*************************************************************************** */
export const saveSong = (props) => {
  // Redirect to home if access token expired
  if (props.spotifyTokens.access_token && isTokenExpired(props)) {
    console.log('START:: Getting new token');
    getNewToken(props);
  }
  spotifyApi.setAccessToken(props.spotifyTokens.access_token);
  console.log("==> ", props.song.id);
  axios({
    method: 'PUT',
    url: 'https://api.spotify.com/v1/me/tracks',
    headers: { 
        "Authorization": `Bearer ${props.spotifyTokens.access_token}`, 
        "Content-Type": "application/json" },
    data: { ids: [props.song.id] },
  }).then((res) => {
      trackSavedToast();
    });
};



/* playSong()::
** Make a Spotify API request to play selected song
*************************************************************************** */
export const playSong = (props) => {
  // Redirect to home if access token expired
  if (props.spotifyTokens.access_token && isTokenExpired(props)) {
    console.log('START:: Getting new token');
    getNewToken(props);
  }

  if (Object.keys(props.devices).length === 0) {
    // Open playlist on the web if no available device
    window.open(props.song.external_urls.spotify, '_blank');
    playingToast(props.song.name, 'new window');
  } else {
    const device = Object.entries(props.devices);
    console.log("==> ", device);
    axios({
      method: 'PUT',
      url: 'https://api.spotify.com/v1/me/player/play',
      headers: { Authorization: `Bearer ${props.spotifyTokens.access_token}` },
      params: { device_id: device[0][1] },
      data: { uris: [props.song.uri] },
    });
    playingToast(props.song.name, device[0][0]);
  }
};

/* convertKey()::
** Takes an integer argument (note) and returns the corresponding key
** in the musical scale
*************************************************************************** */
export const convertKey = (note) => {
  const pitchNotation = {
    0: 'C',
    1: 'C# / D\u266D',
    2: 'D',
    3: 'D# / E\u266D',
    4: 'E',
    5: 'F',
    6: 'F# / G\u266D',
    7: 'G',
    8: 'G# / A\u266D',
    9: 'A',
    10: 'A# / B\u266D',
    11: 'B',
  };
  return pitchNotation[note];
};

/* capitalize()::
** Takes a string as an argument and returns a capitalized string
**************************************************************************** */
export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

/* onRangeChange()::
** Change state of song attributes when user moves any input slider
**************************************************************************** */
/* eslint-disable prefer-destructuring */
export const onRangeChange = (props, id, value) => {
  const attrMin = `min_${id}`;
  const attrMax = `max_${id}`;
  const newState = {};
  newState[attrMin] = value[0];
  newState[attrMax] = value[1];
  props.changeAttributes(newState);
};
/* eslint-enable */

/* onSliderChange()::
** Change state of song attributes when user moves any input slider
**************************************************************************** */
export const onSliderChange = (props, id, value) => {
  const attr = `target_${id}`;
  const newState = {};
  newState[attr] = value;
  props.changeAttributes(newState);
};

/* toggleAttr()::
** Disable an input slider if user does not want to use attribute
**************************************************************************** */
export const toggleAttr = (props, id) => {
  const disabledState = `${id}Disabled`;
  const newState = {};
  newState[disabledState] = !props.attributes[disabledState];
  props.changeAttributes(newState);
};

/* togglePopover()::
** Show popover with more information about each attribute
**************************************************************************** */
export const togglePopover = (props, id) => {
  const popoverState = `${id}PopoverOpen`;
  const newState = {};
  newState[popoverState] = !props.popovers[popoverState];
  props.togglePopover(newState);
};

/* getTipFormatter()::
** Format slider values based on attribute id
**************************************************************************** */
export const getTipFormatter = (id, value) => {
  switch (id) {
    case 'dur':
      return millisToMinutesAndSeconds(value);
    case 'loud':
      return `${value} dB`;
    case 'pop':
      return Math.floor(value);
    case 'temp':
      return Math.floor(value);
    default:
      return value * 100;
  }
};
