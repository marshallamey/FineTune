import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Container, Row, Col, Form, FormGroup, FormText, Label, Input, Button,
} from 'reactstrap';
import SpotifyWebApi from 'spotify-web-api-js';
import { ToastContainer } from 'react-toastify';
import AttrSlider from './AttrSlider';
import { onGenreChange, handleSubmit, submitSongSearch } from '../js/Helpers';
import * as actions from '../actions';
import 'react-toastify/dist/ReactToastify.css';
import 'react-notifications/lib/notifications.css';
import '../css/MusicSearchForm.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'rc-slider/assets/index.css';

const spotifyApi = new SpotifyWebApi();

class MusicSearchForm extends Component {
  componentDidMount() {
    console.log('FINETUNEAPP(MusicSearchForm):: COMPONENT MOUNTED');
    const { spotifyTokens } = this.props;

    // Make sure Spotify API has access token
    if (!spotifyApi.getAccessToken()) {
      spotifyApi.setAccessToken(spotifyTokens.access_token);
    }
  }

  componentDidUpdate() {
    console.log('FINETUNEAPP(MusicSearchForm):: COMPONENT UPDATED');
    const { redirect, setRedirect, history } = this.props;

    // Redirect to MusicList after form submit
    if (redirect) {
      setRedirect(false);
      history.push('/results', null);
    }
  }

  render() {
    console.log('FINETUNEAPP(MusicSearchForm):: (1)Rendering with these props ==> ', this.props);
    const {
      allGenres, selectedGenres, resetAttributes, setKeyword,
    } = this.props;
    return (
      <Container className="MusicSearchForm" fluid>
        <ToastContainer />
        <h1 className="MusicSearch-title">Music Search</h1>
        <Form onSubmit={e => submitSongSearch(this.props, e)}>
          <Input
            type="text"
            onChange={e => setKeyword(e.target.value)}
          />

          <Button type="submit"> Find Song </Button>
        </Form>
        <Form onSubmit={event => handleSubmit(this.props, event)}>
          <Row>

            {/* CHOOSE GENRE */}
            <Col className="genre-col" lg="3">
              <FormGroup>
                <Label for="genre"><h5>Search by genre</h5></Label>
                <FormText>*Required.  Select up to 5</FormText>
                <Input
                  className="genre-select"
                  type="select"
                  value={selectedGenres}
                  multiple
                  onChange={e => onGenreChange(this.props, e.target.options)}
                >
                  { allGenres.map(genre => (
                    <option key={genre.id}>{genre.name}</option>
                  ))}
                </Input>
              </FormGroup>
              <Button type="submit"> Find Music </Button>
            </Col>

            {/* ADJUST SONG ATTRIBUTES */}
            <Col>
              <Row>
                <div className="features">
                  <h5 className="features-heading">Search Options</h5>
                  <FormText>*Optional</FormText>
                  <Button onClick={() => resetAttributes()}>Reset</Button>
                </div>
              </Row>

              <Row>
                <Col md="6" sm="12">
                  <AttrSlider name="duration" id="dur" min={60000} max={1800000} step={5000} />
                  <AttrSlider name="acousticness" id="ac" min={0.0} max={1.0} step={0.01} />
                  <AttrSlider name="danceability" id="dnc" min={0.0} max={1.0} step={0.01} />
                  <AttrSlider name="energy" id="en" min={0.0} max={1.0} step={0.01} />
                  <AttrSlider name="instrumentalness" id="inst" min={0.0} max={1.0} step={0.01} />
                  <AttrSlider name="liveness" id="live" min={0.0} max={1.0} step={0.01} />
                  <AttrSlider name="loudness" id="loud" min={-60.0} max={0.0} step={0.5} />
                </Col>
                <Col>
                  <AttrSlider name="popularity" id="pop" min={0} max={100} step={1} />
                  <AttrSlider name="speechiness" id="sp" min={0.0} max={1.0} step={0.01} />
                  <AttrSlider name="tempo" id="temp" min={40} max={200} step={1} />
                  <AttrSlider name="valence" id="val" min={0.0} max={1.0} step={0.01} />
                  <AttrSlider name="signature" id="sig" min={1} max={13} step={1} />
                  <AttrSlider name="key" id="key" min={0} max={11} step={1} />
                  <AttrSlider name="mode" id="mode" min={0} max={1} step={1} />
                </Col>
              </Row>

              <Button type="submit"> Find Music </Button>

            </Col>
          </Row>
        </Form>
      </Container>
    );
  }
}

MusicSearchForm.propTypes = {
  spotifyTokens: PropTypes.shape({
    access_token: PropTypes.string,
    refresh_token: PropTypes.string,
  }).isRequired,
  allGenres: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedGenres: PropTypes.arrayOf(PropTypes.string).isRequired,
  user: PropTypes.shape({}).isRequired,
  redirect: PropTypes.bool.isRequired,
  resetAttributes: PropTypes.func.isRequired,
  setRedirect: PropTypes.func.isRequired,
  setKeyword: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => ({
  spotifyTokens: state.spotifyTokens,
  expireTime: state.expireTime,
  devices: state.devices,
  allGenres: state.allGenres,
  selectedGenres: state.selectedGenres,
  selectGenre: state.selectGenre,
  addSongs: state.addSongs,
  songs: state.songs,
  user: state.user,
  attributes: state.attributes,
  changeAttributes: state.changeAttributes,
  popovers: state.popovers,
  redirect: state.redirect,
  keyword: state.keyword,
});

export default withRouter(connect(mapStateToProps, actions)(MusicSearchForm));
