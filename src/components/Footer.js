import React from 'react';
import PropTypes from 'prop-types';


const Footer = (props) => {
    const { user } = props;
    return (
        <footer className="App-footer">
            <a href="/">
                {/* <img className="footer-logo" src="/img/finetune-banner-logo.png" alt="finetune-banner-logo.png" /> */}
                <p>FineTune Footer</p>
            </a>
        </footer>
    );
};

Footer.propTypes = {
  user: PropTypes.shape({}).isRequired,
};

export default Footer;
