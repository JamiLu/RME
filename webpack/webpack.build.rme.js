const Path = require('path');
const FileSystem = require('fs');
const UTF8 = 'utf-8';
const rmeFile = 'rme.js';
const rmeBuildPath = Path.resolve(__dirname, '../rme-build-current/');
const rmeBuildTarget = Path.join(rmeBuildPath, rmeFile);
const rmeDevPath = Path.resolve(__dirname, '../src/');

const ls = (path) => {
    FileSystem.readdir(path, UTF8, (err, files) => {
        files.forEach(file => {
            let resolved = Path.resolve(path, file);
            if (isDir(resolved)) {
                ls(resolved);
            } else if (isFile(resolved)) {
                mergeFile(resolved, rmeBuildTarget);
            }
        });
    });
}

FileSystem.writeFileSync(rmeBuildTarget, '/** RME BUILD FILE **/\n');
ls(rmeDevPath);

const mergeFile = (path, toFile) => {
    FileSystem.readFile(path, UTF8, (err, data) => {
        let parsedData = data.replace(/^import.*\';\n$|^export default.*\;$|^export {.*\}$/gms, '');
        FileSystem.appendFile(toFile, parsedData, err => console.log(err ? err : 'file merged '+path));
    });
}


const isFile = (path) => {
    return FileSystem.statSync(path).isFile();
}

const isDir = (path) => {
    return FileSystem.statSync(path).isDirectory();
}