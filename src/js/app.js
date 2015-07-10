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
        jquery: 'vendor/jquery.min.js',
        app: 'app'
    }
});

// Start the main app logic.
requirejs(['app/game'],
    function (game) {
        game.start();
    });

