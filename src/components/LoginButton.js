import React from 'react';

import "../css/Login.css";

export default function LoginButton() {
    return (
        <a  href={`https://finetune.io/spotify/login`}>
        <button className="btn__login">
            <img className="spotify-logo" src="/img/spotify-logo.png" alt="spotify-logo.JPG" />
            Login with Spotify
        </button>
        </a>
    );
}
