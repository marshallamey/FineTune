import React, { useState } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import PropTypes from "prop-types"
import { Container, Row, Col } from 'reactstrap'

const PlaylistList = props => {
  const { playlists, playlistIds, setPlaylistIds } = props;

  const handleClick = id => { 
    console.log('checking PlaylistIds', playlistIds)

    let newList
    if (playlistIds.includes(id)) {
      document.getElementById('pl-'+id).style.display = 'none'
      newList = playlistIds.filter(pid => pid !== id)
      console.log('newList', newList)
      setPlaylistIds(newList)
      console.log('remove playlistids', playlistIds)
    }
    else {
      document.getElementById('pl-'+id).style.display = 'block'
      newList = [...playlistIds, id]
      console.log('newList', newList)
      setPlaylistIds(newList)
      console.log('add playlistids', playlistIds)
    }
  }

  const Playlists = playlists.map(playlist => (
    <Row className='playlists-list__item' key={playlist.id}>
      <Col className='playlists-list__item--image' sm='1' md='1' lg='1'>
        <img className= 'playlists-list__item--img' src={playlist.images.length == 0? '' : playlist.images[0].url } />
      </Col>
      <Col className='playlists-list__item--name' sm='7' md='7' lg='7'>
        {playlist.name}
      </Col>
      <Col className='playlists-list__item--total' sm='3' md='3' lg='3'>
        {playlist.tracks.total} songs
      </Col>
      <Col className='playlists-list__item--select' sm='1' md='1' lg='1'>
        <div id={playlist.id} className='playlists-list__item--checkbox' onClick={(e)=>handleClick(e.target.id)}></div>
        <img id={'pl-'+ playlist.id} className='playlists-list__item--check' src='img/check.png' />
      </Col>
      
    </Row>
  ))
  return <Container className='playlists-list'>{Playlists}</Container>
}

PlaylistList.propTypes = { playlists: PropTypes.arrayOf(PropTypes.shape({})).isRequired }
const mapStateToProps = state => ({ playlists: state.playlists })
export default withRouter(connect(mapStateToProps)(PlaylistList))
