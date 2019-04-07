const { createReadStream } = require('fs');

module.exports = class WriteFile {
  constructor(path, opts) {
    this.stream = createReadStream(path, opts);
  }
  pipe(destination, opts) {
    this.stream.pipe(destination);
  }
  // destroy() {
  //     this.stream.destroy();
  //     return this;
  // }
};
