const { createWriteStream } = require('fs');

module.exports = class WriteFile {
  constructor(path, opts) {
    this.stream = createWriteStream(path, opts);
  }
  // destroy() {
  //     this.stream.destroy();
  //     return this;
  // }
};
