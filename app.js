//Made By Andrea De Gaetano, @dega1999 , on github crazycoder1999
var express = require('express');
var multer = require('multer')
var FileData = require('./FileData.js');
var FileUtils = require('./FileUtils.js');
var Config = require("./Config.js");
var config = new Config();
var app = express();
var fs = require('fs');
var rootPath = config.rootPath;
var fileUtils = new FileUtils(rootPath);
var mv = require('mv');
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main'
});

var uploadMulter = multer({
        dest: __dirname + "/temporary",
        limits: {fileSize: config.fileSizeUpload, files:1},
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
console.log(""+__dirname + '/resources');
app.use(express.static(__dirname + '/resources/'));
app.set('port', process.env.port || 8000);

app.get('/', function (req, res) {
    res.redirect("/browse")
});

app.post('/upload' , uploadMulter.any(),function (req,res) {

    path = fileUtils.normalizeAndCheck(req.body.path);
    if( path === undefined ) {
        res.send("You can't upload file here");
        return;
    }

    if ( req.files.length === 0 ){
        res.send("Error: No File To Upload..");
        return;
    }

    var theFile = req.files[0];
    mv(theFile.path, path + '/' + theFile.originalname, function (err) {
        
        console.log("moving from " + theFile.path + " to " + path);
        if (err) {
            console.log("error renaming file once uploaded " + err);
            res.send("Sorry, operation aborted.");
            fs.unlink(theFile.path);
            return;
        }

        timedRedirect(res,"Upload Completed.","/browse?path=" + path);            
    });

});

app.get('/delete',function (req,res) {
    fullpath = req.query.path + "/" + req.query.filename;
    fullpath = fileUtils.normalizeAndCheck(fullpath);

    if( fullpath === undefined ) {
        res.send("You shall not pass!");
        return;
    }
    fs.unlink(fullpath);
    timedRedirect(res,"Delete Completed.","/browse?path=" + req.query.path);
});

app.get('/createFolder',function (req,res){
    path = fileUtils.normalizeAndCheck(req.query.path);
    if( path === undefined ) {
        res.send("You shall not pass!");
        return;
    }
    fs.mkdir(path + "/" + req.query.folderName,function(err) {
        if(err) {
            timedRedirect(res,"Unable to create folder","/browse?path=" + req.query.path);
        } else {
            timedRedirect(res,"Folder Created.","/browse?path=" + req.query.path);
        }
    });
});

app.get('/download',function (req,res) {
    path = fileUtils.normalizeAndCheck(req.query.path);
    if( path === undefined ) {
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

    path = fileUtils.normalizeAndCheck(path);
    if( path === undefined ) {
        res.send("You shall not pass!");
        return;
    }
    console.log("actual Path >>"+path+"<<");

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
                        var fileData = new FileData().dotDot();
                        theFiles.splice(0, 0, fileData);
                    }
                    var splittedPaths = path.split("/");
                    console.log(splittedPaths);
                    res.render('fileexplorer', { path: path, ffiles: theFiles , splittedPaths: splittedPaths});
                }
            });
        } else {
            res.render('fileexplorer', { error: "Nothing useful here..." });
        }
    });

});

function timedRedirect(res,message,destination) {
    res.render('temporarymsg', { message: message, path: destination });
}

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