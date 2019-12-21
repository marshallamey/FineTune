import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import LoginButton from './LoginButton';

const Login = (props) => {
  const { user } = props;
  if (user.id !== '') {
    return <Redirect to="/search" />;
  }
  return (
    <Container className="Login" style={user.id ? { display: 'none' } : { display: 'block' }}>
      { user.id ? null : <LoginButton /> }
    </Container>
  );
};

Login.propTypes = {
  user: PropTypes.shape({}).isRequired,
};

export default Login;
