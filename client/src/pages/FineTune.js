import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import {
    Container, Row, Col, Form, FormGroup, FormText,
    Label, Input, Button, ButtonGroup,
} from "reactstrap";
import SpotifyWebApi from "spotify-web-api-js";
import { ToastContainer } from "react-toastify";
import AttrSlider from "../components/AttrSlider";
import { 
    onGenreChange, handleSubmit, submitSongSearch 
} from "../js/Helpers";
import * as actions from "../actions";

import "react-toastify/dist/ReactToastify.css";
import "react-notifications/lib/notifications.css";
import "rc-slider/assets/index.css";
import "../css/FineTune.css";


const spotifyApi = new SpotifyWebApi();

class FineTune extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          searchType: "advanced",
          playlists: [],
          tracks: []
        };
    }

    
// display list of playlist as options
// user filters which playlists to select songs from
// create song list
// filter song list with fineTune controls

    componentDidMount() {
        // Make sure Spotify API has access token
        const { spotifyTokens, getTracks, getPlaylists, playlists, songs } = this.props;
        console.log('PROPS1', playlists, songs)
        !spotifyApi.getAccessToken() && spotifyApi.setAccessToken(spotifyTokens.access_token)
        if(!playlists.length || !songs.length) getPlaylists(spotifyTokens.access_token)
          .then(lists => getTracks(spotifyTokens.access_token, lists))
    }


    render() {
        const {
            allGenres, selectedGenres, resetAttributes, setKeyword
        } = this.props;
        const playlists = this.state.playlists.map( playlist => (
          <div>
            {playlist.name}
            {/* <img className='playlist-img' src={playlist.images[0].url} width='60' height='60'/> */}
          </div>
        ))
        const tracks = this.state.tracks.map( tracks => (
          <div>
            {tracks.track.name}
            {/* <img className='playlist-img' src={playlist.images[0].url} width='60' height='60'/> */}
          </div>
        ))
        
        const playlistList = (
            <Container className="basic-search-form" onSubmit={ e => submitSongSearch(this.props, e) }>
         
                {playlists}
            
            </Container>
        );

        const tracksList = (
          <Container className="basic-search-form" onSubmit={ e => submitSongSearch(this.props, e) }>
             {tracks}
          </Container>
      );

  


        return (
            <Container className="music-search-form" fluid>
                {/* NOTIFICATIONS */}
                <ToastContainer />

                {/* FORM TITLE */}
                <h1 className="music-search-title">Your Songs</h1>

                {/* SEARCH TYPE BUTTONS */}
                <ButtonGroup className="search-type-buttons">
                    <Button 
                        className="search-type-button-basic" 
                        color={ this.state.searchType === "basic"? 'danger':'secondary' }
                        onClick={ () => console.log(this.state) }>
                        Basic
                    </Button>
                    <Button 
                        className="search-type-button-advanced" 
                        color={ this.state.searchType === "basic"? 'secondary':'danger' }
                        onClick={ () => this.setState({ searchType: "advanced" }) }>
                        Advanced
                    </Button>
                </ButtonGroup>

                {/* CONTENT GOES HERE */}
                <Row>
                  <Col>
                    {playlistList}
                  </Col>
                  <Col>
                    {tracksList}
                  </Col>
                </Row>
                
                {/* {this.state.searchType === "basic" ? basicSearchForm : advancedSearchForm} */}
            </Container>
        );
    }
}

FineTune.propTypes = {
    spotifyTokens: PropTypes.shape({
        access_token: PropTypes.string,
        refresh_token: PropTypes.string
    }).isRequired,
    allGenres: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    selectedGenres: PropTypes.arrayOf(PropTypes.string).isRequired,
    user: PropTypes.shape({}).isRequired,
    redirect: PropTypes.bool.isRequired,
    playlists: PropTypes.arrayOf(PropTypes.shape({})),
    resetAttributes: PropTypes.func.isRequired,
    getPlaylists: PropTypes.func.isRequired,
    setRedirect: PropTypes.func.isRequired,
    setKeyword: PropTypes.func.isRequired,
    history: PropTypes.shape({}).isRequired
};

const mapStateToProps = state => ({
    spotifyTokens: state.spotifyTokens,
    expireTime: state.expireTime,
    devices: state.devices,
    allGenres: state.allGenres,
    selectedGenres: state.selectedGenres,
    selectGenre: state.selectGenre,
    getPlaylists: state.getPlaylists,
    getTracks: state.getTracks,
    playlists: state.playlists,
    addSongs: state.addSongs,
    songs: state.songs,
    user: state.user,
    attributes: state.attributes,
    changeAttributes: state.changeAttributes,
    popovers: state.popovers,
    redirect: state.redirect,
    keyword: state.keyword
});

export default withRouter(connect(mapStateToProps, actions)(FineTune));
