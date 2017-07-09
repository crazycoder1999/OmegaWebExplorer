
function createFolder(path) {
    var result = window.prompt("Insert the folder name");
    if ( result !== null ) {
        console.log("Creating folder " + result + " in " + path);
        window.location.href= "/createFolder?path=" + path + "&folderName=" + result ;
    }
}

function deleteTheFile(path, filename){
    var confirmed = window.confirm("Are you sure you want to delete the file " + filename);
    if ( confirmed ) {
        console.log("Deleting file " + filename + " in path " + path);
        window.location.href= "/delete?path=" + path + "&filename=" + filename ;
    }
}

function redirectMe(dest) {
    setTimeout(function() {
        window.location.href = "" + dest;
    },2000);
}