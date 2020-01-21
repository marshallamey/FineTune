import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { ToastContainer } from "react-toastify";
import PropTypes from "prop-types";

import MusicSearchForm from "./MusicSearchForm";
import MusicList from "./MusicList";
import Header from "./Header";
import Login from "./Login";
import Donate from "./Donate";
import {
    areTokensAvailable,
    connectToSpotify,
    isTokenExpired,
    getNewToken
} from "../js/Helpers";
import * as actions from "../actions";

import "react-toastify/dist/ReactToastify.css";
import "react-notifications/lib/notifications.css";
import "../css/App.css";

class App extends React.Component {
    componentDidMount() {
        console.log("FINETUNEAPP(App):: COMPONENT MOUNTED");
        const { spotifyTokens } = this.props;

        // Check for existing tokens from Spotify, connect if available refresh if expired
        let tokens = areTokensAvailable(this.props);
        if (tokens) {
            connectToSpotify(this.props, tokens);
        }
        if (spotifyTokens.access_token && isTokenExpired(this.props)) {
            console.log("FINETUNEAPP(App):: REFRESHING TOKEN");
            getNewToken(this.props);
        }
    }

    componentDidUpdate() {
        console.log("FINETUNEAPP(App):: APP UPDATED");
    }

    render() {
        console.log(
            "FINETUNEAPP(App):: Rendering with these props ==> ",
            this.props
        );
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
                            render={() => <Login user={user} />}
                        />

                        <Route
                            path="/search"
                            render={() => <MusicSearchForm />}
                        />

                        <Route path="/results" render={() => <MusicList />} />

                        <Route path="/donate" render={() => <Donate />} />
                    </div>
                </BrowserRouter>
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
