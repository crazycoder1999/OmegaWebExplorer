//Made By Andrea De Gaetano, @dega1999 , on github crazycoder1999
var express = require('express');
var FileData = require('./FileData.js');
var Config = require("./Config.js");
var config = new Config();
var app = express();
var fs = require('fs');
var pathLib = require('path');
var rootPath = config.rootPath;
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main'
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.port || 8000);

app.get('/', function (req, res) {
    res.redirect("/browse")
});

app.get('/download',function (req,res) {
    path = pathLib.normalize(req.query.path);
    if( ! path.startsWith( rootPath ) ) {
        res.send("You shall not pass!");
        return;
    }

    fs.lstat(req.query.path, (err, stats) => {
        if(stats.isFile()) {
            try {
                res.download(req.query.path);
            } catch (err) {
                console.log(err);
                res.send("go away");
                return;
            }
        } else {
            res.send("I can't download the file you requested.");
            return;
        }
    });
});

app.get('/browse', function (req, res) {
    var path = "";
    console.log(">>" + req.query.path + "<<");
    if (req.query.path === undefined) {
        path = rootPath;
    } else {
        path = req.query.path;
    }    

    path = pathLib.normalize(path);
    if( path === rootPath ) { 
        path += "/";
    }
    console.log("actual Path >>"+path+"<<");
    if( ! path.startsWith( rootPath ) ) {
        res.send("You shall not pass!");
        return;
    }

    fs.lstat(path, (err, stats) => {

        if (err) {
            console.log("ERR: "+err);
            res.render('fileexplorer', { error: err });            
            return;
        }
        console.log('Is directory: ${stats.isDirectory()}');
        if (stats.isDirectory()) {
            fs.readdir(path, function (err, items) {
                if (err !== null) {
                    res.render('fileexplorer', { error: err });
                } else {
                    
                    var theFiles = new Array();
                    for (var i = 0; i < items.length; i++) {                        
                        oneFile = fs.lstatSync(path + "/" + items[i]);
                        var fileData = new FileData(items[i],oneFile.size,oneFile.nlink === 1 );
                        theFiles.push(fileData);
                        console.log(fileData);
                    }
                    
                    if( path !== rootPath + "/" ) {                                          
                        //var fileData = { fname: "..", size: 0, isFiles: false };
                        var fileData = new FileData().dotDot();
                        theFiles.splice(0, 0, fileData);
                    }
                    res.render('fileexplorer', { path: path, ffiles: theFiles });
                }
            });
        } else {
            res.render('fileexplorer', { error: "Nothing useful here..." });
        }
    });

});

app.use(function (req, res) {
    res.type("text/plain");
    res.status(404);
    res.send('.');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type("text/plain");
    res.status(500);
    res.send('Server Error 500.');
});

app.listen(app.get('port'), function () {
    console.log("Running on port " + app.get('port') + ", Press CTRL + C to terminate.");
});