const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Vercel build script...');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

// Check if public directory exists
const publicPath = path.join(__dirname, 'public');
console.log('Looking for public directory at:', publicPath);

if (!fs.existsSync(publicPath)) {
  console.error('ERROR: public directory not found!');
  process.exit(1);
}

// List contents of public directory
console.log('Contents of public directory:');
fs.readdirSync(publicPath).forEach(file => {
  console.log(`- ${file}`);
});

// Check if index.html exists in public directory
const indexPath = path.join(publicPath, 'index.html');
console.log('Looking for index.html at:', indexPath);

if (!fs.existsSync(indexPath)) {
  console.error('ERROR: index.html not found in public directory!');
  process.exit(1);
}

console.log('index.html found, proceeding with build...');

try {
  // Run the build
  console.log('Running build command...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
