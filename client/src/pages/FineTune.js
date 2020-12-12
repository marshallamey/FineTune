import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import {
    Container, Row, Col, Form, FormGroup, FormText,
    Label, Input, Button, ButtonGroup,
} from "reactstrap";
import Knob from 'react-canvas-knob';
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
          tracks: [],
          value1: 0,
          value2: 0,
          value3: 0
        };
    }

    
// display list of playlist as options
// user filters which playlists to select songs from
// create song list
// filter song list with fineTune controls

    componentDidMount() {
        // Make sure Spotify API has access token
        const { spotifyTokens, getTracks, getPlaylists, playlists, songs } = this.props;
        !spotifyApi.getAccessToken() && spotifyApi.setAccessToken(spotifyTokens.access_token)
        if(!playlists.length || !songs.length) getPlaylists(spotifyTokens.access_token)
          .then(lists => getTracks(spotifyTokens.access_token, lists))
    }

    handleChange = (newValue, num) => {
      this.setState({['value'+num]: newValue});
    };

    render() {
      const { playlists, songs } = this.props;

        const Playlists = playlists.map( playlist => (
          <div>
            {playlist.name}
            {/* <img className='playlist-img' src={playlist.images[0].url} width='60' height='60'/> */}
          </div>
        ))
        const tracks = songs.map( track => (
          <div>
            {track.name}
            {/* <img className='playlist-img' src={playlist.images[0].url} width='60' height='60'/> */}
          </div>
        ))
        
        const playlistList = (
            <Container className="basic-search-form" onSubmit={ e => submitSongSearch(this.props, e) }>
         
                {Playlists}
            
            </Container>
        );

        const tracksList = (
          <Container className="basic-search-form" onSubmit={ e => submitSongSearch(this.props, e) }>
             {tracks}
          </Container>
      );



      const controls = (
        <div>
          <Knob 
            value={this.state.value1} 
            onChange={(e) => this.handleChange(e, 1)}
            bgColor="black"
            fgColor="#1756fe"
          />
          <Knob value={this.state.value2} onChange={(e) => this.handleChange(e, 2)}/>
          <Knob value={this.state.value3} onChange={(e) => this.handleChange(e, 3)}/>
          <Knob value={this.state.value3} onChange={(e) => this.handleChange(e, 3)}/>
          <AttrSlider
            name="duration"
            id="dur"
            min={60000}
            max={1800000}
            step={5000}
      />
      <AttrSlider
        name="signature"
        id="sig"
        min={1}
        max={13}
        step={1}
    />
    <AttrSlider
        name="key"
        id="key"
        min={0}
        max={11}
        step={1}
    />
    <AttrSlider
      name="speechiness"
      id="sp"
      min={0.0}
      max={1.0}
      step={0.01}
  />
        </div>
      )

  


        return (
            <Container className="music-search-form" fluid>
                {/* NOTIFICATIONS */}
                <ToastContainer />

                {/* FORM TITLE */}
                <h1 className="music-search-title">Found {songs.length} Songs</h1>

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
                    <Row>
                      {playlistList}
                      </Row>
                      <Row>
                        {controls}
                      </Row>
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
