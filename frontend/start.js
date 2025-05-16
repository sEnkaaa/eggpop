const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

const nodeEnv = process.env.NODE_ENV || 'development';
const distDir = path.join(__dirname, 'dist');

function execCommand(command) {
  console.log(`Exécution de : ${command}`);
  execSync(command, { stdio: 'inherit' });
}

function cleanDistDirectory() {
  if (fs.existsSync(distDir)) {
    console.log('Cleaning dist folder content...');
    fs.readdirSync(distDir).forEach((file) => {
      const filePath = path.join(distDir, file);
      fs.rmSync(filePath, { recursive: true, force: true });
    });
  }
}

if (nodeEnv === 'production') {
  console.log('Environment : Production');
  cleanDistDirectory();
  execCommand('npm install');
  execCommand('npm run build');
} else if (nodeEnv === 'development') {
  console.log('Environment : Development');
  execCommand('npm install');
  execCommand('npm run dev');
}
