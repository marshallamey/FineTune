import React from 'react';
import PropTypes from 'prop-types';
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton';

const Header = (props) => {
    const { user } = props;
    return (
        <header className="App-header sticky">
            <div className="App-header-content">
                <div className='left-content'>
                    <h4 className="App-title">FineTune</h4>
                    <p className="App-desc">A Playlist Builder</p>
                </div>
                <div className='right-content'>
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
