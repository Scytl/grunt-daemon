'use strict';

module.exports = function (grunt) {
  grunt.registerTask('daemonize', 'Daemonize grunt execution', function () {
    this.async();
  });

  grunt.registerTask('daemon', 'Start daemons', function () {
    var task = this.args.shift();

    var targets = this.args.map(function (target) {
      return task + ':' + target;
    });

    if (!targets.length) { targets.push(task); }
    targets.push('daemonize');

    grunt.task.run(targets);
  });
};
