requirejs.config({
    baseUrl: 'src',
    paths: {
        'Arg': '../bower_components/argjs/release/arg.js.v1.1',
        'd3': '../bower_components/d3/d3',
        'jsnx': 'lib/networkx.min',
        'domReady': '../bower_components/requirejs-domready/domReady',
        'request': '../bower_components/request/request',
    },
    shim: {
        'Arg': {
            exports: 'Arg'
        }
    },
    packages: [{
        name: 'when',
        location: '../bower_components/when',
        main: 'when'
    }],
});

requirejs(['main']);
