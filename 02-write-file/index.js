const fs = require('fs')
const path = require('path')
const { stdin, stdout, exit} = require('process');
const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'))


stdout.write('Пожалуйста, введите ваш текст:');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') exit();
  stream.write(data.toString());
});

process.on('exit', () => stdout.write('Пока'));
process.on('SIGINT', exit);