import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { 
    Container, Media, Button, Row, Col, Modal, ModalHeader, ModalBody, Input
} from 'reactstrap';
import PropTypes from 'prop-types';
import SpotifyWebApi from 'spotify-web-api-js';
import { createNewPlaylist } from '../js/Helpers';
import * as actions from '../actions';
import Song from './Song';
import SongButtons from './SongButtons';
import '../css/MusicList.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-notifications/lib/notifications.css';

const spotifyApi = new SpotifyWebApi();

const MusicList = (props) => {
    const { spotifyTokens, user, className, setPlaylistName } = props;
    const [modal, setModal] = useState(false);
    const [selectedSong, selectSong] = useState(props.songs[0] || {name:"",artists:[{name:""}]});
    const toggle = (id = -1) => {
        setModal(!modal);
        if (id >= 0) { selectSong(props.songs[id]); }
    }

    // Redirect to login if no user
    if (!user.id) { return <Redirect to="/" />; }

    // Set Spotify API access token, if missing
    if (!spotifyApi.getAccessToken()) {
        spotifyApi.setAccessToken(spotifyTokens.access_token);
    }

    // Create Song components using array returned from Spotify music search.
    const SongURIs = props.songs.map(song => song.uri);
    const Songs = props.songs.map((song, index) => (
        <Col sm="12" background="#333333" key={index}>
            {/* HEADER CONTENT GOES HERE */}
            <Row className="song-card-header">

                {/* ALBUM COVER */}
                <Col className="song-album-cover-col" lg="2" md="2" xs="2">
                    <Media
                        object
                        className="song-album-cover img-responsive"
                        src={song.album.images[2].url ? song.album.images[2].url : 'https://res.cloudinary.com/skooliesocial/image/upload/v1532741147/users/admin-1532741148018.jpg'}
                        alt="Album Cover"
                        onClick={() => toggle(index)}
                    />
                </Col>
                
                {/* SONG TITLE & BUTTONS */}
                <Col className="song-info-col" lg="10" md="10" xs="10">
                    <Row className="song-info-row">                      
                        <Col className="song-title" lg="9" md="8" xs="12" onClick={() => toggle(index)}>
                            {song.name}{' - '}{song.artists[0].name}
                        </Col>
                        <Col className="song-btns" lg="3" md="4" xs="12">
                            <SongButtons {...props} song={song} index={index}/>
                        </Col>
                    </Row>
                </Col>
            </Row>    
        </Col>
    ));

    // If there is no playlist to render, alert user
    if (Songs === null || Songs.length === 0) {
        return (
            <div className="MusicList">
                <p>No music found. Please try a different search.</p>
                <Link to="/search">Search</Link>
            </div>
        );
    }

    return (
        <Container className="music-list-container">
            <ToastContainer />
            <h1 className="music-list-title">Your Playlist</h1>
            <Input 
                    className="music-list-name-input" 
                    type="text" 
                    placeholder="Playlist Name" 
                    onChange={ e => setPlaylistName(e.target.value) }
                />
            <Button className="music-list-save-btn" onClick={() => createNewPlaylist(props, SongURIs)}>
                Save this playlist to Spotify
            </Button>
            <Link className="music-list-search-link" to="/search">Start New Search</Link>
            <Row className="music-list">{Songs}</Row>          
            <Modal isOpen={modal} toggle={() => toggle()} className={className} size='lg'>
                <ModalHeader toggle={() => toggle()}>
                    {selectedSong.name}{' - '}{selectedSong.artists[0].name }
                </ModalHeader>
                <ModalBody>
                    <Song {...props} key={selectedSong.id} song={selectedSong} />                
                </ModalBody>
            </Modal>   
        </Container>
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
    playlistName: state.playlistName
});

export default withRouter(connect(mapStateToProps, actions)(MusicList));


