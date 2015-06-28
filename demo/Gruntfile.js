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
                  swaggerFile: path.join(__dirname, './test.yaml'),
                  //
                  // Example ways to ignore paths (i.e. to allow proxying to a live server)
                  //
                  ignorePaths: [
                  //
                    'GET /pets/{id}', // ignore specific methods in a path
                  //
                     '/pets' // ignore the entire path
                  //
                  ]
                  //
                  // Alternatively, specify ONLY the paths you want mocked:
                  //
                  // mockPaths: [
                  //   '/pets/{id}', // all methods
                  //   'GET DELETE /pets' // only specific methods
                  // ]
              })
          ],
        },
      },
    },
  });


  grunt.file.expand('../node_modules/grunt-*/tasks').forEach(grunt.loadTasks);

  grunt.registerTask('default', ['connect']);
};
