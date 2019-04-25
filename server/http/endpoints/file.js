const {
  createContent, createStream, getContent, getStream, upsertContent, upsertStream, deleteFile,
} = require('../../util/file_repository');
const auth = require('../util/auth');
const Busboy = require('busboy');

const { Readable } = require('stream');
const { join } = require('path');
const HandlerManager = require('../../handler/handler');
const body = require('../util/body');

module.exports = (app) => {
  app.post('/files', auth, async (req, res) => {
    try {
      const busboy = new Busboy({ headers: req.headers });

      let tmp = null;
      const cmd = {};

      busboy.on('file', async (_, file, filename) => {
        tmp = join('..', 'data', 'tmp');
        const fullpath = join(tmp, filename);

        const stream = await createStream(fullpath);

        cmd.type = filename.split('.')[1].toUpperCase();
        cmd.username = req.user || 'test';
        cmd.action = 'CREATE';
        cmd.filename = filename;
        cmd.tmp = tmp;

        file.pipe(stream);
      });

      busboy.on('finish', async () => {
        await HandlerManager.handle(cmd);

        res.statusCode = 201;
        res.end();
      });

      return req.pipe(busboy);
    } catch (err) {
      res.statusCode = 415;
      return res.end(JSON.stringify({ error: err.message }));
    }
  });

  app.post('/file/action', auth, body, async (req, res) => {
    try {
      const cmd = req.body;

      cmd.username = req.user || 'test';

      const result = await HandlerManager.handle(cmd);
      res.statusCode = 200;

      if (result instanceof Readable) {
        return result.pipe(res);
      }

      return res.end(JSON.stringify(result));
    } catch (err) {
      res.statusCode = 415;
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
                  <!-- <form action="/files" enctype="multipart/form-data" method="post"> -->
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
