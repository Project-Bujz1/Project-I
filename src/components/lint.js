const { execSync } = require('child_process');

const isCI = process.env.CI === 'true';

const eslintArgs = ['eslint', '.'];
if (isCI) {
  eslintArgs.push('--max-warnings', '0'); // Treat warnings as errors in CI
} else {
  eslintArgs.push('--max-warnings', '10'); // Allow up to 10 warnings locally
}

execSync(eslintArgs.join(' '), { stdio: 'inherit' });
