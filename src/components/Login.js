import React from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col, Media } from 'reactstrap';
import PropTypes from 'prop-types';

import LoginButton from './LoginButton';
import "../css/Login.css";

const Login = (props) => {
    const { user } = props;
    if (user.id !== '') {
        return <Redirect to="/search" />;
    }
    return (
        <Container fluid className="Login" style={user.id ? { display: 'none' } : { display: 'block' }}>
            
            <Container className="transparent content" fluid>
                <h1><em>Discover music on your terms</em></h1>
            </Container>
            
         
                <Row className="intro">
                    <Col md='3' className='intro-img-col'>
                        <Media className='intro-img' object src='/img/Spotify_Icon_RGB_Green.png' alt='Spotify logo' />
                    </Col>
                    <Col md='9' className='intro-text'>
                        <p>FineTune is an advanced music search tool that allows you to find the exact music you need for any occassion. </p> 
                        <p>As a Spotify user, you can look for songs of a specific length, key, tempo, or even mood.  
                        FineTune makes this easier than ever and it's FREE to use! <br/> <a href='/about'> Learn more...</a></p>
                    </Col>  
                </Row>


            <Container className="transparent content"fluid></Container>
            
            <Container className="play content"fluid>
                <div className="dark-box">
                    <h1>Music in YOUR key</h1>
                    <p>Learning how to play an instrument?  Practice basic guitar chords or ignore all the black keys on the piano with this list!</p>
                    <img src="/img/song-list-play.png" alt="Guitar" />
                </div>
            </Container>

            <Container className="transparent content"fluid></Container>

            <Container className="run content"fluid>
                <div className="dark-box">
                    <h1>Music at YOUR pace</h1>
                    <p>Keep time to these sick beats</p>
                </div>
            </Container>

            <Container className="transparent content"fluid></Container>

            <Container className="dance content"fluid>
                <h1>Music for YOUR mood</h1>
            </Container>

            <Container className="transparent content"fluid>
                <h1><em>The possibilities are endless!</em></h1>
            </Container>

            <Container className="listen content" fluid>     
                <h1>Start building now!</h1>
                { user.id ? null : <LoginButton /> }
            </Container>

        </Container>
    );
};

Login.propTypes = {
  user: PropTypes.shape({}).isRequired,
};

export default Login;
