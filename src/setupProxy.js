const proxy = require('http-proxy-middleware')
const keys = require()

module.exports = function(app) {
    app.use(proxy('/login', { target: 'ec2-35-162-241-110.us-west-2.compute.amazonaws.com/spotify/login' }))
    app.use(proxy('/logout', { target: 'ec2-35-162-241-110.us-west-2.compute.amazonaws.com/spotify/logout' }))
    app.use(proxy('/refresh_token', { target: 'ec2-35-162-241-110.us-west-2.compute.amazonaws.com/spotify/refresh_token' }))
    app.use(proxy('/callback', { target: 'ec2-35-162-241-110.us-west-2.compute.amazonaws.com/spotify/callback' }))
}
