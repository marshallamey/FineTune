import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import PropTypes from "prop-types"
import { Container } from 'reactstrap'

const TrackList = props => {
  const { tracks } = props;
  const Tracks = tracks.map(track => (<div>{track.name}</div>))
  return (<Container className="track-list">{Tracks}</Container>)
}

TrackList.propTypes = { songs: PropTypes.arrayOf(PropTypes.shape({})).isRequired }
const mapStateToProps = state => ({ tracks: state.songs })
export default withRouter(connect(mapStateToProps)(TrackList))
