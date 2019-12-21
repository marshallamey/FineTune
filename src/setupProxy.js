const proxy = require('http-proxy-middleware')
const keys = require()

module.exports = function(app) {
    app.use(proxy('/login', { target: 'ec2-34-209-73-106.us-west-2.compute.amazonaws.com/login' }))
    app.use(proxy('/logout', { target: 'ec2-34-209-73-106.us-west-2.compute.amazonaws.com/logout' }))
    app.use(proxy('/refresh_token', { target: 'ec2-34-209-73-106.us-west-2.compute.amazonaws.com/refresh_token' }))
    app.use(proxy('/callback', { target: 'ec2-34-209-73-106.us-west-2.compute.amazonaws.com/callback' }))
}
