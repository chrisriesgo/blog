// # Ghost bootloader
// Orchestrates the loading of Ghost
// When run from command line.

var express,
    ghost,
    parentApp,
    errors;

// Make sure dependencies are installed and file system permissions are correct.
require('./core/server/utils/startup-check').check();

// Proceed with startup
express = require('express');
ghost = require('./core');
errors = require('./core/server/errors');

// Create our parent express app instance.
parentApp = express();

ghost().then(function (ghostServer) {
    // Mount our ghost instance on our desired subdirectory path if it exists.
    parentApp.use('/.well-known', express.static('.well-known'));
    parentApp.use(ghostServer.config.paths.subdir, ghostServer.rootApp);
    
    parentApp.get('/.well-known/acme-challenge/:fileid', function(req, res){
        res.send('Requesting '+fileid)
    })

    // Let ghost handle starting our server instance.
    ghostServer.start(parentApp);
}).catch(function (err) {
    errors.logErrorAndExit(err, err.context, err.help);
});
