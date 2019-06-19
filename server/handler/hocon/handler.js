const HoconActions = require('./actions');
const CreateMixin = require('../mixins/create');
const DeleteMixin = require('../mixins/delete');
const GetMixin = require('../mixins/get');
const DocMixin = require('../mixins/doc');

const HoconHandler = Object.assign(
  {}, HoconActions,
  CreateMixin,
  DeleteMixin,
  GetMixin,
  DocMixin,
  { doc: "Handler for HOCON files" },
);

module.exports = HoconHandler;
