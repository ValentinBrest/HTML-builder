const path = require('path');
const fs = require('fs');
const {readdir} = require('fs/promises');

const totalFilePath = path.join(__dirname, 'project-dist', 'bundle.css');
const currentFilesPath = path.join(__dirname, 'styles');
const arrStyles = [];

const writeStream = fs.createWriteStream(totalFilePath);

async function getData(filePath) {
  const readStream = fs.createReadStream(filePath);
  for await (const chunk of readStream) {
    arrStyles.push(chunk);
  }
}

readdir(currentFilesPath, {withFileTypes: true})
  .then(async (files) => {
    for (let i = 0; i < files.length; i++) {
      const filePath = path.join(currentFilesPath, files[i].name);
      if (files[i].isFile() && path.extname(filePath) === '.css') {
        await getData(filePath);
      }
    }
    writeStream.write(arrStyles.join('\n').toString());
  });