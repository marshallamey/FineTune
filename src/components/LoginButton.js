import React from 'react';



export default function LoginButton() {
    return (
        <form>
        <button className="btn btn__login" type="submit" formaction="https://www.finetune.io/spotify/login">
            <div className='logo'>
                <img className="spotify-logo" src="/img/spotify-logo.png" alt="spotify-logo.JPG" />
                Login with Spotify
            </div>   
        </button>
        </form> 
    );
}
