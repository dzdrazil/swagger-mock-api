'use strict';

var path = require('path');
var mockApi = require('../dist/index');

module.exports = function(grunt) {

  grunt.initConfig({
    connect: {
      server: {
        options: {
          keepalive: true,
          middleware: [
            mockApi({
                  swaggerFile: path.join(__dirname, './test.yaml')
              })
          ],
        },
      },
    },
  });


  grunt.file.expand('../node_modules/grunt-*/tasks').forEach(grunt.loadTasks);

  grunt.registerTask('default', ['connect']);
};
