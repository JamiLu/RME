const Path = require('path');
const FileSystem = require('fs');
const rmeFile = 'rme.js';
const rmeBuildPath = Path.resolve(__dirname, '../rme-build-current/');
const rmeBuildTarget = Path.join(rmeBuildPath, rmeFile);
const rmeDevPath = Path.resolve(__dirname, '../src/');

const priorityFiles = ['util/util.js', 'app/valueStore.js','app/functions.js','app/manager.js'];
let mergeJobs = [];

const isFile = (path) => {
    return FileSystem.statSync(path).isFile();
}

const isDir = (path) => {
    return FileSystem.statSync(path).isDirectory();
}

const mergeFile = (path, toFile) => {
    const data = FileSystem.readFileSync(path, { encoding: 'UTF-8' });
    const parsedData = data.replace(/^import.*\';\n$|^export default.*\;$|^export {.*\}$/gms, '');
    try {
        FileSystem.appendFileSync(toFile, parsedData);
        console.log('file merged '+path);
    } catch (e) {
        console.error(e);
    }
}

const ls = (path) => {

    const files = FileSystem.readdirSync(path);
    files.forEach((file) => {
        const resolved = Path.resolve(path, file);
        if (isDir(resolved)) {
            ls(resolved);
        } else if (isFile(resolved)) {
            mergeJobs.push({name: resolved, job: () => mergeFile(resolved, rmeBuildTarget)});
        }
    });
}

FileSystem.writeFileSync(rmeBuildTarget, '/** RME BUILD FILE **/\n');
ls(rmeDevPath);

// organize files
priorityFiles.forEach((pf, i) => {

    const removed = mergeJobs.splice(mergeJobs.findIndex(job => {
        return job.name.search(pf) > -1;
    }), 1);
    
    mergeJobs.splice(i, 0, removed[0]);

});

mergeJobs.forEach(mergeJob => mergeJob.job());
