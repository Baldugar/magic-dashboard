const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (app) => {
    app.use(
        '/config.js',
        createProxyMiddleware({
            target: 'http://localhost:8080/',
            changeOrigin: true,
        }),
    )
}
