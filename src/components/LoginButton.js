import React from 'react';
import { Button } from 'reactstrap';
import "../css/Login.css";

export default function LoginButton() {
    return (
        <a  href={`https://finetune.io/spotify/login`}>
        <Button className="login-button" outline>
            <img className="spotify-logo" src="/img/spotify-logo.png" alt="spotify-logo.JPG" />
            Login with Spotify
        </Button>
        </a>
    );
}
