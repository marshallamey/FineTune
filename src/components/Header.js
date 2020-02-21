import React from 'react';
import PropTypes from 'prop-types';
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton';

const Header = (props) => {
    const { user } = props;
    return (
        <header className="App-header sticky">
            <a href="/">
                {/* <img className="header-logo" src="/img/finetune-banner-logo.png" alt="finetune-banner-logo.png" /> */}
                <h2>FineTune</h2>
            </a>
            { user.id ? <LogoutButton user={user} /> : <LoginButton /> }
        </header>
    );
};

Header.propTypes = {
  user: PropTypes.shape({}).isRequired,
};

export default Header;
