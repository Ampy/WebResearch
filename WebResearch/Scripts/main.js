require.config({
    paths: {
        jquery: 'lib/jquery-1.9.1.min',
        jqueryui: 'lib/jquery-ui-1.10.3.custom.min',
        blockui: 'lib/jquery.blockUI',
        json2: 'lib/json2',
        bootstrap: 'lib/bootstrap.min',
        backbone: 'lib/backbone-min',
        underscore: 'lib/underscore-min',
        quantumcode: 'lib/quantumcode',
        quantumcodee: 'lib/quantumcode-elements',
        colresizable: 'lib/colResizable-1.3.min',
        jqbrowser: 'lib/jqBrowser'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'jquery': {
            exports: '$'
        },
        'backbone': {
            deps: ['underscore', 'jquery', 'json2'],
            exports: 'Backbone'
        },
        'blockui': {
            deps: ['jquery']
        },
        'jqueryui': {
            deps: ['jquery']
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'quantumcode': {
            deps: ['jquery', 'quantumcodee']
        },
        'quantumcodee': {
            deps: ['jquery']
        },
        'jqbrowser':{
            deps: ['jquery']
        },
        'colresizable': {
            deps: ['jquery', 'jqbrowser']
        }
    },
    urlArgs: "bust=" + (new Date()).getTime()
});

define(['app'], function (app) {
    app.initialize();
});