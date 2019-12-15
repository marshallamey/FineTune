import React from 'react';
import { connect } from 'react-redux';
import { Media, Button, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { Redirect, withRouter, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { CardStack, Card } from 'react-cardstack';
import SpotifyWebApi from 'spotify-web-api-js';
import {
  playSong, saveTracks, createNewPlaylist,
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
        <Card background="#333333">
            <Row className="card-header">
                <Col lg="2" md="3" xs="2">
                    <Media
                    object
                    className="album-cover img-responsive"
                    src={song.album.images[2].url ? song.album.images[2].url : 'https://res.cloudinary.com/skooliesocial/image/upload/v1532741147/users/admin-1532741148018.jpg'}
                    alt="Album Cover"
                    // onClick={() => props.playSong(props, song)}
                    />
                </Col>
                <Col lg="8" md="6" xs="8">
                    {/* <h1> */}
                    {song.name}
                    {' - '}
                    {song.artists[0].name}
                    {/* </h1> */}
                </Col>
                

                <Col className="btn-row center" lg="2" md="3" xs="2">
                    <Button className="track-btn" onClick={() => props.saveTracks(props, [song.id])}>
                    <i className="fas fa-play" />
                    </Button>
                    <Button className="track-btn" onClick={() => props.saveTracks(props, [song.id])}>
                    <i className="fas fa-plus" />
                    </Button>
                    <Button className="track-btn" onClick={() => props.saveTracks(props, [song.id])}>
                    <i className="fas fa-trash-alt" />
                    </Button>
                    
                </Col>
            </Row>

            <Song
                {...props}
                key={song.id}
                song={song}
                saveTracks={saveTracks}
                playSong={playSong}
                index={index}
            />

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
            <div className="card-stack">
            <CardStack       
                height={1400}
                width="100%"
                background="#333333"
                hoverOffset={10} >
                {tracks}
            </CardStack>
            </div>
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
