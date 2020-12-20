import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import PropTypes from "prop-types"
import { Container } from 'reactstrap'

const PlaylistList = props => {
  const { playlists } = props;
  const Playlists = playlists.map(playlist => <div key={playlist.id}>{playlist.name}</div>)
  return <Container className="playlist-list">{Playlists}</Container>
}

PlaylistList.propTypes = { playlists: PropTypes.arrayOf(PropTypes.shape({})).isRequired }
const mapStateToProps = state => ({ playlists: state.playlists })
export default withRouter(connect(mapStateToProps)(PlaylistList))
