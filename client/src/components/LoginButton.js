import React from 'react';
import { Button } from 'reactstrap';

export default function LoginButton() {
  return (
    <a href="/login">
      <Button outline>
        <img className="spotify-logo" src="/img/spotify-logo.png" alt="spotify-logo.JPG" />
        Login with Spotify to begin
      </Button>
    </a>
  );
}
