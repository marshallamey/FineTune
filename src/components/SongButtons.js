import React from 'react';
import { Button, Row, Col } from 'reactstrap';
import '../css/SongButtons.css';

const SongButtons = (props) => {
    const { song } = props;
    return (
        <Row className="song-btn-row">
            <Col className="song-btn-col" xs="4">
                <Button className="song-btn" onClick={() => props.playTracks(props, [song.id])}>
                <i className="fas fa-play" />
                </Button>
            </Col>
            <Col className="song-btn-col" xs="4">
                <Button className="song-btn" onClick={() => props.saveTracks(props, [song.id])}>
                <i className="fas fa-plus" />
                </Button>
                </Col>
            <Col className="song-btn-col" xs="4">
                <Button className="song-btn" onClick={() => props.deleteTracks(props, [song.id])}>
                <i className="fas fa-trash-alt" />
                </Button>
            </Col>
        </Row>
    )
};

export default SongButtons;