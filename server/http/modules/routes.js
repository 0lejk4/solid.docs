module.exports = (app) => {
  require('../endpoints/file')(app);
  require('../endpoints/createSubdirectory')(app);
};
