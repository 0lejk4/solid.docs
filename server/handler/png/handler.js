const PngActions = require('./actions');
const CreateMixin = require('../mixins/create');
const DeleteMixin = require('../mixins/delete');
const GetMixin = require('../mixins/get');

const PngHandler = Object.assign(
  {}, PngActions,
  CreateMixin,
  DeleteMixin,
  GetMixin,
);

module.exports = PngHandler;
