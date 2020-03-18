import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import LoginButton from '../components/LoginButton';

const Home = (props) => {
    const { user } = props;
    if (user.id !== '') {
        return <Redirect to="/search" />;
    }
    return (
        <div fluid className="home">
            
            <div className="home__spacer"></div>
            
            <section className="home__content home__content--transparent">
                <h1 className='heading-secondary'>Discover music on your terms</h1>
            </section>

            <section className='home__content'>
                <div className='intro'>  
                    <div className='intro__img-box'>
                        <img className='intro__img' object src='/img/Spotify_Icon_RGB_Green.png' alt='Spotify logo' />
                        <div className='intro__img-text'>Powered by Spotify</div>
                    </div>
                    <div className='intro__text-box'>
                        <p className='intro__text'>FineTune is an advanced music search tool that allows you to find the exact music you need for any occassion. </p> 
                        <p className='intro__text'>As a Spotify user, you can look for songs of a specific length, key, tempo, or even mood.  
                        FineTune makes this easier than ever and it's FREE to use!</p>
                    </div> 
                </div>  

                <div className="row">
                    <div className="card-group">
                        <div className="col-1-3">
                            <div className="card">
                                <div className="card-title">CARD 1</div>
                            </div>
                        </div>
                        <div className="col-1-3">
                            <div className="card">
                            <div className="card-title">CARD 2</div>
                            </div>
                        </div>
                        <div className="col-1-3">
                            <div className="card">
                            <div className="card-title">CARD 3</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="home__content home__content--transparent">
                <h1 className='heading-secondary'>The possibilities are endless</h1>
            </section>

            <section className="home__content login">     
                <h1 className='heading-primary'>Start building now!</h1>
                <LoginButton />
            </section>
        </div>
    );
};

Home.propTypes = {
  user: PropTypes.shape({}).isRequired,
};

export default Home;
