#Omega File Manager
## A Web FileManager
I created this project for 2 reasons:
* build a file manager to use in another project.
* make some code with NodeJS

This file manager is able to:
* explore a filesystem
* download files through a web interface
* upload a file
* delete a file
* create a folder

It is expandable with custom pages.

![Screenshot](https://raw.githubusercontent.com/crazycoder1999/OmegaWebExplorer/master/sample/1.png)

## Installation
You need nodejs installed: I used the 5.2.0 version
* clone the repository git clone https://github.com/crazycoder1999/OmegaWebExplorer
* go in the cloned directory and install the dependency with **npm install**
* edit the Config.js file and configure the rootPath: it will be use as the root point.
* run the application with **node app.js**
* open the browser on http://127.0.0.1:8000

## Configuration
The file Config.js contains:
- rootPath: the root folder. The software consider path starting only from rootPath
- fileSizeUpload: the limit of uploadable file
- extra: true, add an external page for customize the web pages /extra. false, disabled it

The software is tested on OSX and Linux (raspberry pi zero / raspbian).

## Customization
If you would like to add specific application features like new pages or new api, you can see: extra.handlebars,Extra.js. You need to enable config.extra.