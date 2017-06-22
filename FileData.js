'use strict';

function FileData() {
    this.fname = "";
    this.size = 0;
    this.isFile = undefined;
}

function FileData (ffname,ssize,iisFile) {
    this.fname = ffname;
    this.size = ssize;
    this.isFile = iisFile;
}

FileData.prototype.dotDot = function() {
    this.fname = "..";
    this.size = 0;
    this.isFile = false;
    return this;
}

module.exports = FileData;
