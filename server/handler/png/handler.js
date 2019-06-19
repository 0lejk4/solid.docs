const PngActions = require('./actions');
const CreateMixin = require('../mixins/create');
const DeleteMixin = require('../mixins/delete');
const GetMixin = require('../mixins/get');
const DocMixin = require('../mixins/doc');

const PngHandler = Object.assign(
  {},
  PngActions,
  CreateMixin,
  DeleteMixin,
  GetMixin,
  DocMixin
);

PngHandler.doc = 'Handler for PNG files';

module.exports = PngHandler;
