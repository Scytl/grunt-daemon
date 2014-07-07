'use strict';

module.exports = function (grunt) {
  grunt.registerTask('daemonize', 'Daemonize grunt execution', function () {
    this.async();
  });
};
