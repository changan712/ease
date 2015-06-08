// Generated on 2015-05-04 using
// generator-webapp 0.5.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Configurable paths
    var config = {
        app: 'app',
        dist: 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost',
                base: '.'
            },
            livereload: {
                options: {
                    middleware: function (connect, options) {
                        return [
                            require('connect-livereload')({
                                port: 35737
                            }),
                            // Serve static files.
                            connect.static(options.base),
                            // Make empty directories browsable.
                            connect.directory(options.base)
                        ];
                    }
                }
            }
        },
        watch: {
            allfiles: {
                files: ['*.html', 'css/**', 'js/**'],
                tasks: ['less:development', 'cssmin'],
                options: {
                    livereload: 35737
                }
            }
        }

    });


    grunt.registerTask('default', function () {
        grunt.task.run([ 'connect', 'watch']);
    });
};
