#!/usr/bin/env node

// Clear all caches and restart clean
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing all caches...\n');

// Clear Next.js cache
if (fs.existsSync('.next')) {
  fs.rmSync('.next', { recursive: true, force: true });
  console.log('✅ Cleared Next.js cache (.next)');
}

// Clear node_modules cache
const cacheDir = path.join('node_modules', '.cache');
if (fs.existsSync(cacheDir)) {
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log('✅ Cleared node_modules cache');
}

// Kill any running dev servers
exec('pkill -f "next dev"', (error) => {
  if (!error) {
    console.log('✅ Stopped running dev servers');
  }
});

// Clear npm cache
exec('npm cache clean --force', (error, stdout) => {
  if (!error) {
    console.log('✅ Cleared npm cache');
  }
  
  console.log('\n🎯 Cache clearing complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Clear your browser cache (F12 → Application → Storage → Clear Site Data)');
  console.log('2. Run: npm run dev');
  console.log('3. Visit http://localhost:3000 in an incognito window');
  console.log('\n🔑 If you still have auth issues:');
  console.log('1. Go to Supabase Dashboard → Authentication → Users');
  console.log('2. Delete all test users');
  console.log('3. Try signing up with a fresh email');
});