import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import PropTypes from "prop-types"
import { Container, Row, Col } from 'reactstrap'
import { FaPlay, FaStop, FaInfo, FaTimes } from 'react-icons/fa';

const TrackList = props => {
  const { tracks } = props;
  const Tracks = tracks.map(track => {
    const name = new Intl.ListFormat('en', { style: 'short', type: 'conjunction' })
    const artists = track.artists.map(artist => artist.name)
    return (
    <Row className='tracklist__track'>
      <Col className='tracklist__track-album' sm='1' md='1' lg='1'>
        <img className='tracklist__track-album-img' src={track.album.images[track.album.images.length-1].url} />
      </Col>
      <Col className='tracklist__track-name' sm='5' md='5' lg='5'>
        {track.name}
      </Col>
      <Col className='tracklist__track-artist' sm='4' md='4' lg='4'>
        {name.format(artists)}
      </Col>
      <Col className='tracklist__track-buttons' sm='2' md='2' lg='2'>
        <Row className='tracklist__track-buttons-div'>
          <Col sm='3' md='3' lg='3'><FaPlay /></Col>
          <Col sm='3' md='3' lg='3'><FaStop /></Col>
          <Col sm='3' md='3' lg='3'><FaInfo /></Col>
          <Col sm='3' md='3' lg='3'><FaTimes /></Col>
        </Row>
      </Col>  
    </Row>)
  })
  return (
    <Container className="tracklist">
      {Tracks}
    </Container>)
}

TrackList.propTypes = { songs: PropTypes.arrayOf(PropTypes.shape({})).isRequired }
const mapStateToProps = state => ({ songs: state.songs })
export default withRouter(connect(mapStateToProps)(TrackList))
