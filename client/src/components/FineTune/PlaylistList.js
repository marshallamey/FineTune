import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import PropTypes from "prop-types"
import { Container, Row, Col } from 'reactstrap'

const PlaylistList = props => {
  const { playlists } = props;
  const Playlists = playlists.map(playlist => (
    <Row className='playlists-list__item' key={playlist.id}>
      <Col className='playlists-list__item--image' sm='1' md='1' lg='1'>
        <img className= 'playlists-list__item--img' src={playlist.images[0].url} />
      </Col>
      <Col className='playlists-list__item--name' sm='7' md='7' lg='7'>
        {playlist.name}
      </Col>
      <Col className='playlists-list__item--total' sm='3' md='3' lg='3'>
        {playlist.tracks.total} songs
      </Col>
      <Col className='playlists-list__item--select' sm='1' md='1' lg='1'>
        <div className='playlists-list__item--checkbox'>
          <img className='playlists-list__item--check' src='img/check.png' />
        </div>
      </Col>
      
    </Row>
  ))
  return <Container className='playlists-list'>{Playlists}</Container>
}

PlaylistList.propTypes = { playlists: PropTypes.arrayOf(PropTypes.shape({})).isRequired }
const mapStateToProps = state => ({ playlists: state.playlists })
export default withRouter(connect(mapStateToProps)(PlaylistList))
