import React from 'react';
import { Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';
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
                    <h1>Welcome</h1>
                
            </Container>
            
            <Container className="intro content"fluid>
                <h1>Short Introduction</h1>
            </Container>

            <Container className="transparent content"fluid>
  
            </Container>
            
            <Container className="play content"fluid>
                <div className="dark-box">
                    <h2>Music in YOUR key</h2>
                    <p>Learning how to play an instrument?  Practice basic guitar chords or ignore all the black keys on the piano with this list!</p>
                    <img src="/img/song-list-play.png" alt="Guitar" />
                </div>
            </Container>

            <Container className="transparent content"fluid>
             
            </Container>

            <Container className="run content"fluid>
                <div className="dark-box">
                    <h1>Music at YOUR pace</h1>
                    <p>Keep time to these sick beats</p>
                </div>
                
            </Container>

            <Container className="transparent content"fluid>
                
            </Container>

            <Container className="dance content"fluid>
                <h1>Music for YOUR mood</h1>
            </Container>

            <Container className="transparent content"fluid>
                <h2>Endless Possibilities!</h2>
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
