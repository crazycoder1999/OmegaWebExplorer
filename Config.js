'use strict';

function Config() {
    this.rootPath = "/tmp";
    this.fileSizeUpload = 1024 * 1000 * 1000 * 2; //2 GB
    this.extra = true;
}

module.exports = Config;