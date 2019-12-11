#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { makeSnippet } = require('../index');
const { blue, green, red } = require('kleur');
const { DEFAULT_CONFIG } = require('../params');

// Log a message when the script is run
console.log(
  `${blue(
    'integration-tools [INIT] '
  )} Snippet creation procedure starting...`
);

let config, template, snippetName;

// Load configuration and log a message when done or on error.
try {
  config = require(path.join(process.cwd(), 'config.js'));
  template = fs.readFileSync(path.join(process.cwd(), 'snippet-template.md'), 'utf8');
  snippetName = process.argv[2];
  console.log(
    `${green(
      'integration-tools [DONE] '
    )} Snippet creation procedure has loaded the configuration and template files.`
  );
} catch (err) {
  console.log(`${red('integration-tools [ERRR]  ')} Snippet creation prodecure has encountered an error while loading the configuration and template files: ${err}`);
  process.exit(1);
}

makeSnippet(Object.assign({}, DEFAULT_CONFIG, config ), template, snippetName, process.cwd());

console.log(
  `${blue(
    'integration-tools [EXIT] '
  )} Snippet creation procedure exiting...`
);
