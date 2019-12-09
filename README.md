# FineTune
<p align="center">
<img src=https://res.cloudinary.com/skooliesocial/image/upload/v1533356615/finetune-square-border-logo_e4hwdv.jpg width=500>
</p>
<p align="center">
FineTune is the best complement to Spotify you'll ever find!
</p>
<p align="center">
Discover exactly the music you want using Spotify's amazing API.
</p>
<p align="center">
Users can search by genre, mood, tempo, key, duration, popularity, and much more!
</p>
<p align="center">
Find danceable tracks, find instrumental tracks, find live recordings!
</p>
<p align="center">
Perfect for choreographers, DJs, and any audiophile with specific music tastes!
</p>
<p align="center">
Built on Node, Express, React, and D3!!
</p>
<p align="center">
  <a href="https://finetune.herokuapp.com">CHECK IT OUT HERE!</a>
</p>

# Installation
<p>
You need to modify the config/dev.sample.js file before using the application.
Enter your Spotify developer information (client ID, client secret, callback URI).
Rename the file dev.js
Enter the following commands in the terminal:
</p>
```
npm install
cd client
npm install
cd ..
npm run dev
```
# About Spotify
<p>
This web application uses Spotify's Web API.  Based on simple REST principles, the Spotify Web API endpoints return JSON metadata about music artists, albums, and tracks, directly from the Spotify Data Catalogue.

All requests to Web API require authentication. This is achieved by sending a valid OAuth access token in the request header. For more information about these authentication methods and the Web API, see the [Web API Developer Guide.](https://developer.spotify.com/documentation/web-api/)

An access token is only valid for 1 hour and a new one must be requested using the supplied refresh token.  In order to refrain from disrupting the user's workflow.  I created a listener function called isTokenExpired() that checks the validity of the access token whenever the user performs an action on the site.  If the function returns true, it invokes a separate function getNewToken() which makes an asynchronous request that updates the app with the new access token before continuing with the user's request.  These functions are located in `/client/js/Helpers.js`.
</p>

# Future Improvements
<p>
  
  **Basic and Advanced searching:** With so many options, some users would prefer a simpler interface to find music recommendations.
  
  **Search for specific songs:** Get all Spotify's detailed information about your favorite track.
  
  **Search by artist, album, or track:** Instead of choosing a genre, get recommendations based on whatever you like.
  
  **Name your playlist:** Choose a name for your new playlist before you save it.
  
  **More play options:** By default, the application chooses the first available device to preview your songs or opens a new window if no devices are available.  Soon you will be able to select your preference.
</p>
