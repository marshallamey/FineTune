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
            <Container className="top" fluid>

            </Container>
            <Container className="middle"fluid>
            <h2>Jump back in</h2>
            </Container>
            <Container className="bottom" fluid>
            { user.id ? null : <LoginButton /> }
            </Container>
        </Container>
    );
};

Login.propTypes = {
  user: PropTypes.shape({}).isRequired,
};

export default Login;
