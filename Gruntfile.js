var path = require('path');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsdoc: {
      dist: {
        src: [
            'lib/**/*.js',
            'README.md'
        ],
        options:
        {
            destination: 'doc',
            configure:'doc/conf.json',
            template:'doc/template'
        }
      }
    }
  });


  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['jsdoc']);
};
