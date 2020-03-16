import React from 'react';
import PropTypes from 'prop-types';
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton';

const Header = (props) => {
    const { user } = props;
    return (
        <header className="header header--sticky">
            <div className="header__content">
                <div className='header__content-left'>
                    <h4 className="header-title">FineTune</h4>
                    <p className="header-tag">Find Music. Create Playlists.</p>
                </div>
                <div className='header__content-right'>
                    { user.id ? <LogoutButton user={user} /> : <LoginButton /> }
                </div>
            </div>     
        </header>
    );
};

Header.propTypes = {
  user: PropTypes.shape({}).isRequired,
};

export default Header;
