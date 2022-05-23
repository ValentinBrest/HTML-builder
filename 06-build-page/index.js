const path = require('path');
const { readdir, copyFile, rm, mkdir, readFile, writeFile } = require('fs/promises');

const distPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');

async function createDir(dirName) {
  await rm(dirName, {recursive: true, force: true});
  await mkdir(dirName);
}

async function createIndex() {
  let template = await readFile(templatePath);
  template = template.toString();
  const templateTags = template.match(/{{.+}}/gi)
    .map((tag) => tag.slice(2, tag.length - 2));

  const tags = {};
  for (let i = 0; i < templateTags.length; i++) {
    tags[templateTags[i]] = await readFile(componentsPath + `\\${templateTags[i]}.html`);
    tags[templateTags[i]] = tags[templateTags[i]].toString();
    let templateTemp = template.split(`{{${templateTags[i]}}}`);
    template = templateTemp[0] + tags[templateTags[i]] + templateTemp[1];
  }

  writeFile(distPath + '\\index.html', template);
}

async function addStyles() {
  let arrStyle = [];
  const files = await readdir(stylesPath, {withFileTypes: true});
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(stylesPath, files[i].name);
    if (files[i].isFile() && path.extname(filePath) === '.css') {
      const fileContent = await readFile(filePath);
      arrStyle.push(fileContent.toString());
    }

    writeFile(distPath + '\\style.css', arrStyle.join('\n'));
  }
}

async function copyDir(dir, dirCopy) {
  const dirFiles = await readdir(dir, {withFileTypes: true});
  dirFiles.forEach(async function (el) {
    if (el.isFile()) {
      copyFile(dir + '\\' + el.name, dirCopy + '\\' + el.name);
    } else if (el.isDirectory()) {
      await mkdir(dirCopy + '\\' + el.name);
      await copyDir(dir + '\\' + el.name, dirCopy + '\\' + el.name);
    }
  });
}

async function init() {
  await createDir(distPath);
  await createDir(distPath + '\\assets');
  createIndex();
  addStyles();
  copyDir(assetsPath, distPath + '\\assets');
}

init();