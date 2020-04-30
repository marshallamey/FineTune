import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { connect } from "react-redux";
import PropTypes from "prop-types";


import MusicSearchForm from "../pages/MusicSearchForm";
import MusicList from "../pages/MusicList";
import Header from "./Header";
import Footer from "./Footer";
import Home from "../pages/Home";
import {
    areTokensAvailable, connectToSpotify, isTokenExpired, getNewToken
} from "../js/Helpers";
import * as actions from "../actions";

import "react-toastify/dist/ReactToastify.css";
import "react-notifications/lib/notifications.css";


class App extends React.Component {
    componentDidMount() {
        // Check for existing tokens from Spotify, connect if available refresh if expired  
        let tokens = areTokensAvailable(this.props);
        if (tokens) {
            connectToSpotify(this.props, tokens);
        }
        const { spotifyTokens } = this.props;
        if (spotifyTokens.access_token && isTokenExpired(this.props)) {
            getNewToken(this.props);
        }
    }

    render() {
        const { user } = this.props;
        return (
            <main className="App">
                <Header user={user} />
                <ToastContainer />
                <BrowserRouter>
                    <div className='main-div'>
                        <Route
                            exact
                            path="/"
                            render={() => <Home user={user} />} />
                        <Route
                            path="/search"
                            render={() => <MusicSearchForm />} />
                        <Route 
                            path="/results" 
                            render={() => <MusicList />} />
                    </div>
                </BrowserRouter>
                <Footer />
            </main>
        );
    }
}

App.propTypes = {
    spotifyTokens: PropTypes.shape({}).isRequired,
    user: PropTypes.shape({}).isRequired
};

const mapStateToProps = state => ({
    spotifyTokens: state.spotifyTokens,
    user: state.user,
    allGenres: state.allGenres,
    expireTime: state.expireTime,
    devices: state.devices
});

export default connect(mapStateToProps, actions)(App);
