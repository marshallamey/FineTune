import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { applyMiddleware, createStore } from "redux";
import { save, load } from "redux-localstorage-simple";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import reducers from "./reducers";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';


const createStoreWithMiddleware = applyMiddleware(
    save(),
    thunk
    // Saving done here
)(createStore);

// Render the App component and place it in the root element (div)
/* eslint-disable no-underscore-dangle */
ReactDOM.render(
    <BrowserRouter>
        <Provider
            store={createStoreWithMiddleware(
                reducers,
                load(),
                window.__REDUX_DEVTOOLS_EXTENSION__ &&
                    window.__REDUX_DEVTOOLS_EXTENSION__()
            )} >
            <App />
        </Provider>
    </BrowserRouter>,
    document.getElementById("root")
);
/* eslint-enable */
