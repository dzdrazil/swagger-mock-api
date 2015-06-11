'use strict';

var path = require('path');

var mockApiGenerator = require('../index.js');

var mockApi = mockApiGenerator({
    yamlPath: path.join(__dirname, './test.yaml')
});

mockApi({
    method: 'GET',
    url: 'http://localhost:8080/api/pets/'
}, {
    write: function(s) {console.log(s);},
    end: function(){},
    setHeader: function(){}
}, function() {
    throw new Error('route not matched!');
});
