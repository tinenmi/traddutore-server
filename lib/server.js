'use strict';
import * as fastifyAutoPush from 'fastify-auto-push';
import webpackConfig from 'client';
import fastify from 'fastify';
import fastifyWebpackDevHotMiddleware from './fastify-webpack-dev-hot-middleware';
import path from 'path';

((params) => {
    process.on('unhandledRejection', (reason, p) => {
        // eslint-disable-next-line no-console
        console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
    });

    fastify({logger: true})
        .register(fastifyAutoPush.staticServe, {
            root: params.staticDir,
            prefix: params.publicPath,
        })

        .register(fastifyWebpackDevHotMiddleware, {
            config : webpackConfig,
            options: {hot: true, publicPath: params.publicPath},
        })

        .get('/api/', async (request, reply) => {
            reply.type('application/json').code(200);
            return { hello: 'world' };
        })

        .get('/', async (request, reply) => {
            reply.type('text/html').code(200);

            return `<html>
                <head>
                    <title>My App</title>
                    <link rel="stylesheet" href="/init.css">
                </head>
                <body>
                    <div id="root"></div>
                    <script src="./app.bundle.js"></script>
                </body>
            </html>`;
        })

        .listen(3000, (err, address) => {
            if (err) throw err;
            
            // eslint-disable-next-line no-console
            console.info(`server listening on ${address}`);
        });
})({
    staticDir: path.resolve(__dirname, '../../client/static'),
    publicPath: '',
});
