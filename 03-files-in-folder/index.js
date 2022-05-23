const path = require('path');
const {readdir} = require('fs/promises');
const { stat } = require('fs');
const { stdout } = process;

const folderPath = path.join(__dirname, 'secret-folder');

readdir(folderPath, {withFileTypes: true})
  .then(res => {
    for (const file of res) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileObj = path.parse(filePath);

        stat(filePath, (err, stats) => {
        if (err) {
            return stdout.write(`Error: ${err}\n`);
            }
            stdout.write(`\n${fileObj.name} - ${fileObj.ext.slice(1)} - ${stats.size} bytes`);
        });
      }
    }
  });