const proxy = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(proxy('/login', { target: 'http://finetune:8888/' }))
    app.use(proxy('/logout', { target: 'http://finetune:8888/' }))
    app.use(proxy('/refresh_token', { target: 'http://finetune:8888/' }))
    app.use(proxy('/callback', { target: 'http://finetune:8888/' }))
}
