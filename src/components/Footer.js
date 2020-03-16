import React from 'react';
import PropTypes from 'prop-types';


const Footer = (props) => {
    const { user } = props;
    return (
        <footer className="App-footer">
            <a href="/">About</a>
            <a href="/">Privacy Policy</a>
            <a href="/">Cookie Policy</a>
            <a href="/">Marshall Jarreau &copy; 2020</a>
        </footer>
    );
};

Footer.propTypes = {
  user: PropTypes.shape({}).isRequired,
};

export default Footer;
