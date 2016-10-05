var child = require('child_process');
var path = require('path');
var webpack = require('webpack');
var WebPackDevServer = require('webpack-dev-server');
var electron = require('electron-prebuilt');
var winston = require('winston');
var os = require('os');
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({ colorize: true })
  ]
});

/******************************************************
 * Webpack Dev Server
 *
 * @desc The webpack dev server is in charge of automatically rebuilding
 * javascript code and hot-reloading the frontend application without loosing
 * the current state. Less changes will also be automatically compiled to css
 * and updated without reloads on the frontend application.
 */

var config = require('../webpack/dev.config');
var compiler = webpack(config);

var WebPackDevServerConf = {
  hot: config.devServer.hot,
  port: config.devServer.port,
  host: config.devServer.host,
  contentBase: config.devServer.contentBase,
  publicPath: config.devServer.publicPath,
  inline: config.devServer.inline,
  quiet: false,
  noInfo: false,
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false
  },
  headers: config.devServer.headers
};

logger.info('===============[ Electron Application ]==============');
logger.info(`${config.devServer.contentBase}`);
logger.info('');
logger.info(`Your electron application will launch in a window...`);
logger.info('======================================================\n');

// Create the webpack dev server by wrapping the compiler and the server config
var devServer = new WebPackDevServer(compiler, WebPackDevServerConf);

// The webpack dev server stays running to serve and dynamically reload files
// on our frontend application.
devServer.listen(config.devServer.port, config.devServer.host, function(err) {
  if (err) return console.error(err);
});

// Start electron application with electron-prebuilt
child.spawn(electron, [path.join(__dirname, '../')], { env: process.env });
