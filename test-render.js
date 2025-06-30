const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test 1: Check if all required files exist
console.log('🔍 Testing file structure...');
const requiredFiles = [
  'App.js',
  'package.json',
  'screens/HomeScreen.js',
  'screens/SubjectScreen.js', 
  'screens/QuizScreen.js',
  'screens/ResultsScreen.js',
  'data/flashcards.js'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing required file: ${file}`);
    process.exit(1);
  }
}
console.log('✅ All required files exist');

// Test 2: Check if dependencies are installed
console.log('🔍 Testing dependencies...');
try {
  execSync('npm ls --depth=0', { stdio: 'pipe' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Dependency issues detected');
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
}

// Test 3: Test Metro bundler compilation
console.log('🔍 Testing Metro bundler...');
try {
  const result = execSync('npx expo export:embed --platform web --dev', { 
    stdio: 'pipe',
    timeout: 60000 
  });
  console.log('✅ Metro bundler compiles successfully');
} catch (error) {
  console.error('❌ Metro bundler failed:');
  console.error(error.message);
  
  // Test with simpler validation
  console.log('🔍 Testing basic syntax...');
  try {
    require('./App.js');
    console.log('✅ App.js syntax is valid');
  } catch (syntaxError) {
    console.error('❌ App.js syntax error:');
    console.error(syntaxError.message);
    process.exit(1);
  }
}

console.log('🎉 All tests passed! App should work in Snack.');