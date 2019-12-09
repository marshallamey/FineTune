import React from 'react';
import { connect } from 'react-redux';
import { Media, Button, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import { Redirect, withRouter, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { CardStack, Card } from 'react-cardstack';
import SpotifyWebApi from 'spotify-web-api-js';
import AttrSlider from './AttrSlider';
import {
  playSong, saveTracks, createNewPlaylist, millisToMinutesAndSeconds,
} from '../js/Helpers';
import * as actions from '../actions';
import Song from './Song';
import '../css/MusicList.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-notifications/lib/notifications.css';

const spotifyApi = new SpotifyWebApi();

const MusicList = (props) => {
  console.log('FINETUNEAPP(MusicList):: Rendering with these props ==> ', props);
  const { spotifyTokens, user, songs } = props;

  // Redirect to login if no user
  if (!user.id) { return <Redirect to="/" />; }

  // Set Spotify API access token, if missing
  if (!spotifyApi.getAccessToken()) {
    spotifyApi.setAccessToken(spotifyTokens.access_token);
  }

  // If there is no playlist to render, alert user
  if (songs === null || songs.length === 0) {
    return (
      <div className="MusicList">
        <p>No music found. Please sign in or conduct a search.</p>
        <Link to="/search">Search</Link>
      </div>
    );
  }

  // Create Song components with array returned from Spotify music search.
  const tracks = songs.map((song, index) => (
    <Card background="#222222">
      <div className="card-header">
        <Media
          object
          className="album-cover img-responsive"
          src={song.album.images[2].url ? song.album.images[2].url : 'https://res.cloudinary.com/skooliesocial/image/upload/v1532741147/users/admin-1532741148018.jpg'}
          alt="Album Cover"
          // onClick={() => props.playSong(props, song)}
        />

        {/* <h1> */}
          {song.name}
          {' - '}
          {song.artists[0].name}
        {/* </h1> */}
      </div>

      <Song
        {...props}
        key={song.id}
        song={song}
        saveTracks={saveTracks}
        playSong={playSong}
        index={index}
      />

      <Table>
        {/* <thead>
          <tr>
            <th>#</th>
            <th></th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
        </thead> */}
        <tbody>
          <tr>
            <th scope="row">Length</th>
            <td>{millisToMinutesAndSeconds(song.duration_ms)}</td>
            <td><AttrSlider name="duration" id="dur" min={60000} max={1800000} step={5000} /></td>
          </tr>
          <tr>
            <th scope="row">Acousticness</th>
            <td>{Math.floor(song.audio_features.acousticness * 100)}</td>
            <td><AttrSlider name="acousticness" id="ac" min={0.0} max={1.0} step={0.01} /></td>
          </tr>
          <tr>
            <th scope="row">Danceability</th>
            <td>{song.acousticness}</td>
            <td><AttrSlider name="danceability" id="dnc" min={0.0} max={1.0} step={0.01} /></td>
          </tr>
          <tr>
            <th scope="row">Energy</th>
            <td>{song.acousticness}</td>
            <td><AttrSlider name="energy" id="en" min={0.0} max={1.0} step={0.01} /></td>
          </tr>
          <tr>
            <th scope="row">Instrumentalness</th>
            <td>{song.acousticness}</td>
            <td><AttrSlider name="instrumentalness" id="inst" min={0.0} max={1.0} step={0.01} /></td>
          </tr>
          <tr>
            <th scope="row">Liveness</th>
            <td>{song.acousticness}</td>
            <td><AttrSlider name="liveness" id="live" min={0.0} max={1.0} step={0.01} /></td>
          </tr>
          <tr>
            <th scope="row">Loudness</th>
            <td>{song.acousticness}</td>
            <td><AttrSlider name="loudness" id="loud" min={-60.0} max={0.0} step={0.5} /></td>
          </tr>
          <tr>
            <th scope="row">Popularity</th>
            <td>{song.acousticness}</td>
            <td><AttrSlider name="popularity" id="pop" min={0} max={100} step={1} /></td>
          </tr>
          <tr>
            <th scope="row">Speechiness</th>
            <td>{song.acousticness}</td>
            <td><AttrSlider name="speechiness" id="sp" min={0.0} max={1.0} step={0.01} /></td>
          </tr>
          <tr>
            <th scope="row">Tempo</th>
            <td>{song.acousticness}</td>
            <td><AttrSlider name="tempo" id="temp" min={40} max={200} step={1} /></td>
          </tr>
          <tr>
            <th scope="row">Valence</th>
            <td>{song.acousticness}</td>
            <td><AttrSlider name="valence" id="val" min={0.0} max={1.0} step={0.01} /></td>
          </tr>
          <tr>
            <th scope="row">Signature</th>
            <td>{song.acousticness}</td>
            <td><AttrSlider name="signature" id="sig" min={1} max={13} step={1} /></td>
          </tr>
          <tr>
            <th scope="row">Key</th>
            <td>{song.acousticness}</td>
            <td><AttrSlider name="key" id="key" min={0} max={11} step={1} /></td>
          </tr>
          <tr>
            <th scope="row">Mode</th>
            <td>{song.acousticness}</td>
            <td><AttrSlider name="mode" id="mode" min={0} max={1} step={1} /></td>
          </tr>
        </tbody>
      </Table>

    </Card>
  ));

  // Create array of song URIs to create a Spotify playlist
  const songURIs = songs.map(song => song.uri);

  // console.log('FINETUNEAPP(MusicSearchForm):: Song URIs to create playlist: ', songURIs);
  return (
    <div className="MusicList">

      <ToastContainer />

      <h1>Your Playlist</h1>

      <Button className="save-playlist-btn" onClick={() => createNewPlaylist(props, songURIs)}>
        Save this playlist to Spotify
      </Button>
      <br />
      <Link className="search-link" to="/search">Perform Another Search</Link>

      <CardStack
        className="card-stack"
        height={1400}
        width="75%"
        background="#333333"
        hoverOffset={10}
      >
        {tracks}
      </CardStack>

    </div>
  );
};

MusicList.propTypes = {
  spotifyTokens: PropTypes.shape({
    access_token: PropTypes.string,
    refresh_token: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({}).isRequired,
  songs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const mapStateToProps = state => ({
  spotifyTokens: state.spotifyTokens,
  songs: state.songs,
  user: state.user,
  devices: state.devices,
  expireTime: state.expireTime,
});

export default withRouter(connect(mapStateToProps, actions)(MusicList));
