const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

const nodeEnv = process.env.NODE_ENV || 'development'

const distDir = path.join(__dirname, 'dist')

function execCommand(command) {
  console.log(`Exécution de : ${command}`)
  execSync(command, { stdio: 'inherit' })
}

if (nodeEnv === 'production') {
  console.log('Environment : Production')
  if (fs.existsSync(distDir)) {
    console.log('Deleting dist folder content...')
    fs.rmSync(distDir, { recursive: true, force: true })
  }
  execCommand('npm install')
  execCommand('npm run build')
} else {
  console.log('Environment : Development')
  execCommand('npm install')
  execCommand('npm run dev')
}