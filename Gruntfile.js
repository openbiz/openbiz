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
    }
  });


  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['jsdoc']);
};
