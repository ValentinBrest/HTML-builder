const path = require('path');
const { readdir, copyFile, rm, mkdir } = require('fs/promises');

const mainPath = path.join(__dirname, 'files');
const mainCopyPath = path.join(__dirname, 'files-copy');

async function copyDir(dir, dirCopy) {
  const dirAllFiles = await readdir(dir, {withFileTypes: true});
  dirAllFiles.forEach(async function (elem) {
    if (elem.isFile()) {
      copyFile(dir + '\\' + elem.name, dirCopy + '\\' + elem.name);
    } else if (elem.isDirectory()) {
      await mkdir(dirCopy + '\\' + elem.name);
      await copyDir(dir + '\\' + elem.name, dirCopy + '\\' + elem.name);
    }
  });
}

(async function () {
  await rm(mainCopyPath, {recursive: true, force: true});
  await mkdir(mainCopyPath);
  copyDir(mainPath, mainCopyPath);
})();
