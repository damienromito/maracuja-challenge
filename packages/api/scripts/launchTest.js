const util = require('util')

const exec = util.promisify(require('child_process').exec)

const testId = process.argv[2]
console.log('testId:', testId)

;(async () => {
  console.log('okkkk')
  await exec(`npm run test`, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
  })


})()