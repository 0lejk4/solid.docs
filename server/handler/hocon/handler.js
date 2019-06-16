const HoconActions = require('./actions');
const CreateMixin = require('../mixins/create');
const DeleteMixin = require('../mixins/delete');
const GetMixin = require('../mixins/get');

const HoconHandler = Object.assign(
  {}, HoconActions,
  CreateMixin,
  DeleteMixin,
  GetMixin,
);

module.exports = HoconHandler;
