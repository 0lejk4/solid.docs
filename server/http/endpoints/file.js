const upload = require('../utils/uploader');
const { promises: fs, createReadStream, constants } = require('fs');
const { join } = require('path');

module.exports = (app) => {

  app.get('/files', async (req, res) => {
    try {
      if (!req.query.fileId) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'missing required param `fileID`' }));
      }
      const file = join(__dirname, '..', '..', 'data', req.query.fileId); 
      await fs.access(file, constants.F_OK | constants.R_OK);
      const stream = createReadStream(file);
      
      res.statusCode = 200;
      return stream.pipe(res);
    } catch(err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Not Found' }));
      }
      
      res.statusCode = 400;
      return res.end();
    }
  });

  app.post('/files', async (req, res) => {
    try {
      await upload(req, res);
      
      res.statusCode = 201;
      return res.end();
    } catch (err) {
      res.statusCode = 415;
      return res.end();
    } 
  });
  
  // no modification, this should rewrite file, at least so far
  // app.put('/files', (req, res) => {
  // });
  
  app.delete('/files', async (req, res) => {
    try {
      if (!req.query.fileId) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'missing required param `fileID`' }));
      }
      const file = join(__dirname, '..', '..', 'data', req.query.fileId); 
      await fs.unlink(file);
      
      res.statusCode = 204;
      return res.end();
    } catch (err) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: err.message }));
    } 
  });

  app.get('/', (req, res) => {
    res.end(`<!DOCTYPE html>
      <html>
      <head>
          <title>Simple file Upload | Nodejsera | Code Snippet</title>
          <!-- Including bootstrap for styling -->
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
          <!-- Including external css -->
      </head>
      <body>
      
          <br>
          <Br>
          <div class="row">
              <div class="col-md-2">
                      <!-- EMPTY div -->
              </div>
              <div class="col-md-8 form">
                  <br>
                  <br>
                  <!-- Form starts here -->
                  <form action="/files" enctype="multipart/form-data" method="post">	
                      <!-- Field to choose the files to be uploaded -->
                      <label class="up_styles">
                          <input type="file" name="upload" multiple />
                      </label>
                      <br>
                      <!-- Button to upload the choosed files -->
                      <input class="sub" type="submit" value="Upload">
                  </form>
                  <br>
                  <br>
              </div>
              <div class="col-md-2">
                      <!-- EMPTY div -->
              </div>
          </div>
      </body>
      </html>	`);
  });
};
