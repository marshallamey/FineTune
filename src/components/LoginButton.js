import React from 'react';



export default function LoginButton() {
    return (
        <a href={`https://finetune.io/spotify/logout`}>
            <button className="btn__login">
                <div className='logo'>
                    <img className="spotify-logo" src="/img/spotify-logo.png" alt="spotify-logo.JPG" />
                    Login with Spotify
                </div>
            </button>
        </a>
    );
}
