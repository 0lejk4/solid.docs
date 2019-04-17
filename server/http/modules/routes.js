module.exports = (app) => {
  require('../endpoints/file')(app);
  require('../endpoints/createSubdicerotry')(app);
};
