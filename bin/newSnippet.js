#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

// Load configuration and log a message when done or on error.
try {
  const template = fs.readFileSync(path.join(process.cwd(), 'snippet-template.md'), 'utf8');

  const snippetDirectory = fs.existsSync(path.join(process.cwd(), 'blog_posts')) ? 'blog_posts' : 'snippets';
  if(!fs.existsSync(path.join(process.cwd(), snippetDirectory)))
    fs.mkdirSync(path.join(process.cwd(), snippetDirectory));

  const snippetName = process.argv[2];

  const fileData = template.replace(/title:\s*.*\n/, `title: ${snippetName}\n`);

  fs.writeFileSync(path.join(process.cwd(), snippetDirectory, `${snippetName}.md`), fileData );
} catch (err) {
  console.log(`Snippet creation exited with error: ${err}`);
  process.exit(1);
}

console.log('Snippet creation complete');
