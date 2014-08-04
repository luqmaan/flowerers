module.exports = function(grunt) {
    grunt.initConfig({
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'src',
                    mainConfigFile: 'src/build.js',
                    include: 'main',
                    insertRequire: ['main'],
                    name: '../bower_components/almond/almond',
                    out: 'dist/built.js',
                    wrap: true,
                    optimize: 'uglify2',
                    preserveLicenseComments: false,
                    generateSourceMaps: true
                }
            }
        },
        connect: {
            server: {
              options: {
                port: 1234
              }
            }
        },
        'gh-pages': {
            options: {
                base: 'dist',
                repo: 'git@github.com:luqmaan/flowerers.git'
            },
            src: ['**']
        },
        replace: {
          index: {
            src: ['index.html'],             // source files array (supports minimatch)
            dest: 'dist/index.html',             // destination directory or file
            replacements: [{
              to: '<script src="built.js"></script>',                   // string replacement
              from: '<script data-main="/src/build" src="/bower_components/requirejs/require.js"></script>'
            }]
          }
        }
    });

    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-gh-pages');

    grunt.registerTask('yes', ['replace']);
    grunt.registerTask('build', ['requirejs', 'replace', 'gh-pages']);

    grunt.registerTask('serve', ['connect']);

};

