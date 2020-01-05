import React from 'react';
import { connect } from 'react-redux';
import { Media, Button, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { Redirect, withRouter, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { CardStack, Card } from './CardStack';
import SpotifyWebApi from 'spotify-web-api-js';
import {
  playSong, saveTracks, createNewPlaylist,
} from '../js/Helpers';
import * as actions from '../actions';
import Song from './Song';
import SongButtons from './SongButtons';
import '../css/MusicList.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-notifications/lib/notifications.css';

const spotifyApi = new SpotifyWebApi();

const MusicList = (props) => {
    console.warn('FINETUNEAPP(MusicList):: Rendering with these props ==> ', props);
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
        <Card background="#333333" key={index}>

            {/* HEADER CONTENT GOES HERE */}
            <Row className="song-card-header">

                {/* ALBUM COVER */}
                <Col className="song-album-cover-col" lg="2" md="2" xs="2">
                    <Media
                        object
                        className="song-album-cover img-responsive"
                        src={song.album.images[2].url ? song.album.images[2].url : 'https://res.cloudinary.com/skooliesocial/image/upload/v1532741147/users/admin-1532741148018.jpg'}
                        alt="Album Cover"
                        // onClick={() => props.playSong(props, song)}
                    />
                </Col>
                
                {/* SONG TITLE & BUTTONS */}
                <Col className="song-info-col" lg="10" md="10" xs="10">
                    <Row className="song-info-row">                      
                        <Col className="song-title" lg="9" md="8" xs="12">
                            {song.name}{' - '}{song.artists[0].name}
                        </Col>
                        <Col className="song-btns" lg="3" md="4" xs="12">
                            <SongButtons song={song} />
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* SONG CONTENT GOES HERE */}
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
        <div className="music-list">

            {/* NOTIFICATIONS */}
            <ToastContainer />

            {/* PLAYLIST TITLE */}
            <h1 className="music-list-title">Your Playlist</h1>

            {/* SAVE PLAYLIST BUTTON */}
            <Button className="music-list-save-btn" onClick={() => createNewPlaylist(props, songURIs)}>
                Save this playlist to Spotify
            </Button>

            {/* NEW SEARCH LINK */}
            <Link className="new-search-link" to="/search">Start New Search</Link>

            {/* PLAYLIST GOES HERE */} 
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
