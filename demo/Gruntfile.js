'use strict';

var path = require('path');
var mockApi = require('../dist/index2');

module.exports = function(grunt) {

  grunt.initConfig({
    connect: {
      server: {
        options: {
          keepalive: true,
          middleware: [
            mockApi({
                  yamlPath: path.join(__dirname, './fi-test.json')
              })
          ],
        },
      },
    },
  });


  grunt.file.expand('../node_modules/grunt-*/tasks').forEach(grunt.loadTasks);

  grunt.registerTask('default', ['connect']);
};
