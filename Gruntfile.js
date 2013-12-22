var path = require('path');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsdoc: {
      dist: {
        src: [
            'lib/**/*.js'
        ],
        dest: 'doc'
      }
    },
    jshint: {
      server: {
        options: {
          jshintrc: '.jshintrc-server'
        },
        src: [
          'lib/**/*.js'
        ]
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('default', ['build', 'lint']);
  grunt.registerTask('build', ['jsdoc']);
  grunt.registerTask('lint', ['jshint']);
};
