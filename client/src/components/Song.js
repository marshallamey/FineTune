import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Row, Col, Button, Media,
} from 'reactstrap';
import BarChart from './BarChart/BarChart';
import { millisToMinutesAndSeconds, convertKey } from '../js/Helpers';
import '../css/Song.css';

const Song = (props) => {
  const { song } = props;

  return (
    <div className="Song">
      <Row className="song-row">

        <Col className="BarChart-col">
          <BarChart song={song} features={song.audio_features} />
          <Row className="btn-row center">
            <Button className="save-btn" onClick={() => props.saveTracks(props, [song.id])}>
              <i className="fas fa-plus" />
            </Button>
            <span className="song-text">Save this song</span>
            <a href='#'>Find more songs like this one</a>
          </Row>
        </Col>
      </Row>

      <Row className="more-details">
        <Col className="detail" lg="2" md="4" xs="12">
          <p className="song-text">
            <b>Length: </b>
            {millisToMinutesAndSeconds(song.duration_ms)}
          </p>
        </Col>
        <Col className="detail" lg="2" md="4" xs="12">
          <p className="song-text">
            <b>Key: </b>
            {convertKey(song.audio_features.key)}
            {song.audio_features.mode === 1 ? ' Major' : ' Minor'}
          </p>
        </Col>
        <Col className="detail" lg="2" md="4" xs="12">
          <p className="song-text">
            <b>Time Signature: </b>
            {song.audio_features.time_signature}
            /4
          </p>
        </Col>
        <Col className="detail" lg="2" md="4" xs="12">
          <p className="song-text">
            <b>Loudness: </b>
            {song.audio_features.loudness.toFixed(1)}
            {' dB'}
          </p>
        </Col>
        <Col className="detail" lg="2" md="4" xs="12">
          <p className="song-text">
            <b>Tempo: </b>
            {song.audio_features.tempo.toFixed(1)}
            {' bpm'}
          </p>
        </Col>
      </Row>
    </div> 
  );
};

Song.propTypes = {
  saveTracks: PropTypes.func.isRequired,
  playSong: PropTypes.func.isRequired,
  song: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => ({
  spotifyTokens: state.spotifyTokens,
  songs: state.songs,
  devices: state.devices,
  expireTime: state.expireTime,
});

export default withRouter(connect(mapStateToProps)(Song));
