const { getFileStream, deleteFile, createFileStream } = require('../../util/file');
const auth = require('../util/auth');
const Busboy = require('busboy');

module.exports = (app) => {
  app.get('/files/:fileId', auth, async (req, res) => {
    try {
      if (!req.params.fileId) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'missing required param `fileID`' }));
      }

      const stream = await getFileStream(req.params.fileId);

      res.statusCode = 200;
      return stream.pipe(res);
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Not Found' }));
      }

      res.statusCode = 400;
      return res.end(JSON.stringify({ error: err.message }));
    }
  });

  app.post('/files', auth, async (req, res) => {
    try {
      const busboy = new Busboy({ headers: req.headers });

      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const stream = createFileStream(filename, req.user);
        file.pipe(stream);
      });

      busboy.on('finish', () => {
        res.statusCode = 201;
        res.end();
      });

      return req.pipe(busboy);
    } catch (err) {
      res.statusCode = 415;
      return res.end(JSON.stringify({ error: err.message }));
    }
  });

  app.delete('/files/:fileId', auth, async (req, res) => {
    try {
      if (!req.params.fileId) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'missing required param `fileID`' }));
      }

      await deleteFile(req.params.fileId);

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
      </html>`);
  });
};
