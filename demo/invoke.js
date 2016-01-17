'use strict';

const path = require('path');
const mockApi = require('../dist/index');

const request = {
  method: 'get',
  url: '/pets/1'
};

const response = {
  setHeader: () => {},
  write: console.log.bind(console)
};

const next = () => {};

let api = mockApi({swaggerFile: path.join(__dirname, './test.yaml')});

api(request, response, next);
