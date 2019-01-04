const fp = require('fastify-plugin');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

function fastifyWebpackDevMiddleware (fastify, params, next) {
    const compiler = webpack(params.config);
    const devMiddleware = webpackDevMiddleware(compiler, params.options);
    const hotMiddleware = webpackHotMiddleware(compiler);

    function applyMiddleware(middleware) {
        function onRequest (request, response, next) {
            middleware(request, response, (err) => {
                if (err)
                    return next(err);

                return next();
            });
        }

        fastify.addHook('onRequest', onRequest);
    }

    applyMiddleware(devMiddleware);
    applyMiddleware(hotMiddleware);
    next();
}

module.exports = fp(fastifyWebpackDevMiddleware);
