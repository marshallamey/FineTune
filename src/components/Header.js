import React from 'react';
import PropTypes from 'prop-types';
import LogoutButton from './LogoutButton';

const Header = (props) => {
    const { user } = props;
    return (
        <header className="App-header">
            <a href="/">
                <img className="header-logo" src="/img/finetune-banner-logo.JPG" alt="finetune-banner-logo.JPG" />
            </a>
            { user.id ? <LogoutButton user={user} /> : null }
        </header>
    );
};

Header.propTypes = {
  user: PropTypes.shape({}).isRequired,
};

export default Header;
