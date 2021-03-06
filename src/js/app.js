/* globals requirejs: false */
requirejs.config({
    // By default load all module IDs from:
    baseUrl: 'js',
    // except, if the module ID starts with "app",
    // load it from the js/app directory. paths
    // config is relative to the baseUrl, and
    // never includes a ".js" extension since
    // the paths config could be for a directory.
    paths: {
        jquery: 'vendor/jquery.min',
        lodash: 'vendor/lodash.custom',
        app: 'app'
    },
    shim: {
        // Libraries
        jquery: {
            exports: '$'
        },
        lodash: {
            exports: '_'
        }
    }
});

// Start the main app logic.
requirejs(['app/Game'],
    function (Game) {
        Game.start();
    });

