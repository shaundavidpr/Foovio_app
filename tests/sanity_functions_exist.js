const fs = require('fs');
const path = require('path');

const functions = ['verify-order', 'create-order'];
let ok = true;

functions.forEach((fn) => {
  const p = path.join(__dirname, '..', 'supabase', 'functions', fn, 'index.ts');
  if (!fs.existsSync(p)) {
    console.error('Missing function file:', p);
    ok = false;
  } else {
    console.log('Found', p);
  }
});

if (!ok) process.exit(2);
console.log('Sanity check passed.');
