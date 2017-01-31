#!/usr/bin/env node

var connector = require("./index");
var argv = require('argv');

var args = argv.option({
    name: 'config',
    short: 'c',
    type: 'string',
    description: 'Defines the config file location',
    example: "poeditor-connector --config=config/poeditor.sample.json"
}).run();

connector.init(args.options.config);

connector.importMessages()
    .then(function() {
        return connector.exportAllLanguages()
    })
    .catch(function(exception) {
        console.error(exception);
    });
