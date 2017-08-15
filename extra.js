'use strict';

function Extra() {
}

Extra.prototype.setupApi = function(app) {
    this.app = app;
    this.app.get('/extra', function (req, res) {
        res.render("extra", { });  
    });
}

module.exports = Extra;
