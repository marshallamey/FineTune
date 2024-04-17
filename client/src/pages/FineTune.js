import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Container, Row, Col, Button, ButtonGroup } from 'reactstrap'
import SpotifyWebApi from 'spotify-web-api-js'
import { ToastContainer } from 'react-toastify'
import { onGenreChange, handleSubmit, submitSongSearch } from '../js/Helpers'
import * as actions from '../actions'
import PlaylistList from '../components/FineTune/PlaylistList'
import TrackList from '../components/FineTune/TrackList'
import FilterControls from '../components/FineTune/FilterControls'
import 'react-toastify/dist/ReactToastify.css'
import 'react-notifications/lib/notifications.css'
import 'rc-slider/assets/index.css'
import '../css/FineTune.css'

const spotifyApi = new SpotifyWebApi()

const FineTune = props => {
  const { spotifyTokens, getTracks, getPlaylists, playlists, songs } = props
  const [page, setPage] = useState('playlists')
  const [filteredTracks, setTracks] = useState(songs)
  const [playlistIds, setPlaylistIds] = useState([])
  console.log('MOUNTED PROPS', playlists, filteredTracks)

  const IDS = playlists.map(list => list.id)
  !playlistIds.length && setPlaylistIds(IDS)
  !spotifyApi.getAccessToken() && spotifyApi.setAccessToken(spotifyTokens.access_token)
  if (!playlists.length || !songs.length)
    getPlaylists(spotifyTokens.access_token)
      .then(lists => getTracks(spotifyTokens.access_token, lists))

  return (
    <Container id='finetune' fluid>
      <ToastContainer />
      <h1 className='finetune__title'>Found {songs.length} Songs</h1>
      <ButtonGroup className='finetune-buttons'>
        <Button
          className='finetune__buttons--playlists'
          color={page === 'playlists' ? 'danger' : 'secondary'}
          onClick={() => setPage('playlists')}>
          Load Playlists
        </Button>
        <Button
          className='finetune__buttons--search'
          color={page === 'search' ? 'danger' : 'secondary'}
          onClick={() => setPage('search')}>
          Search Music
        </Button>
      </ButtonGroup>

      {/* CONTENT GOES HERE */}
      <Row className='finetune__content'>
        <Col className='finetune__content--col'>
          <Row className='finetune__content--playlists'>
            <PlaylistList 
              playlists={playlists} 
              playlistIds={playlistIds}
              setPlaylistIds={setPlaylistIds} />
          </Row>
          <Row className='finetune__content--controls'>
            <FilterControls />
          </Row>
        </Col>
        <Col className='finetune__content--col'>
          <Row className='finetune__content--tracks'>
            <TrackList tracks={filteredTracks} />
          </Row>
          <Row className='finetune__content--data'></Row>
        </Col>
      </Row>
    </Container>
  )
}

FineTune.propTypes = {
  spotifyTokens: PropTypes.shape({
    access_token: PropTypes.string,
    refresh_token: PropTypes.string,
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
  history: PropTypes.shape({}).isRequired,
}

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
  keyword: state.keyword,
})

export default withRouter(connect(mapStateToProps, actions)(FineTune))
