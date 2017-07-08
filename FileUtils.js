'use strict';
var pathLib = require('path');

function FileUtils(safeRoot) {
    this.safeRoot = safeRoot;
}

FileUtils.prototype.normalizeAndCheck = function(path) {
    var newPath = pathLib.normalize(path);
    if( ! newPath.startsWith( this.safeRoot ) )
        return undefined;

    if( newPath === this.safeRoot ) { 
        newPath += "/";
    }
    return newPath;
}

module.exports = FileUtils;
