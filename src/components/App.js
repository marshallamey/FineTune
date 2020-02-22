import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Container } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import MusicSearchForm from "./MusicSearchForm";
import MusicList from "./MusicList";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import {
    areTokensAvailable, connectToSpotify, isTokenExpired, getNewToken
} from "../js/Helpers";
import * as actions from "../actions";

import "react-toastify/dist/ReactToastify.css";
import "react-notifications/lib/notifications.css";
import "../css/App.css";

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
            <Container className="App" fluid>
                <Header user={user} />
                <ToastContainer />
                <BrowserRouter>
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => <Login user={user} />} />
                        <Route
                            path="/search"
                            render={() => <MusicSearchForm />} />
                        <Route 
                            path="/results" 
                            render={() => <MusicList />} />
                    </div>
                </BrowserRouter>
                <Footer />
            </Container>
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
