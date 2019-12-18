import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { clear } from 'redux-localstorage-simple';

export default function LogoutButton(props) {
  const { user } = props;
  return (
    <div>
      <p>
        Logged in as
        { user.id == null ? '' : ` ${user.id}` }
      </p>
      <a href="http://ec2-34-209-73-106.us-west-2.compute.amazonaws.com/logout">
        <Button outline onClick={() => clear()}>
          <img className="spotify-logo" src="/img/spotify-logo.png" alt="spotify-logo.JPG" />
          Logout
        </Button>
      </a>
    </div>
  );
}

LogoutButton.propTypes = {
  user: PropTypes.shape({}).isRequired,
};
