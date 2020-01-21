import React from 'react';
import { Button, Row, Col } from 'reactstrap';
import { playSong, saveSong, deleteSong } from '../js/Helpers.js';
import '../css/SongButtons.css';

const SongButtons = (props) => {
    const { song } = props;
    console.warn("HEY! => ", props);
    return (
        <Row className="song-btn-row">
            <Col className="song-btn-col" xs="4">
                <Button className="song-btn" onClick={() => playSong(props)}>
                <i className="fas fa-play" />
                </Button>
            </Col>
            <Col className="song-btn-col" xs="4">
                <Button className="song-btn" onClick={() => saveSong(props)}>
                <i className="fas fa-plus" />
                </Button>
                </Col>
            <Col className="song-btn-col" xs="4">
                <Button className="song-btn" onClick={() => deleteSong(props)}>
                <i className="fas fa-trash-alt" />
                </Button>
            </Col>
        </Row>
    )
};

export default SongButtons;