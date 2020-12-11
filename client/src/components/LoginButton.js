import React from 'react';

const loginPath = process.env.NODE_ENV === 'production' 
    ? 'http://finetune.io/spotify/login' 
    : 'http://localhost:8081/spotify/login'

export default function LoginButton() {
    return (
        <a href={loginPath}>
            <button className="btn btn__login">
                <div className='logo'>
                    <img className="spotify-logo" src="/img/spotify-logo.png" alt="spotify-logo.JPG" />
                    Login with Spotify
                </div>
            </button>
        </a>
    );
}
