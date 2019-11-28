#!/usr/bin/env node

const path = require('path');
const { build } = require('../index');
const { blue, green, red } = require('kleur');

// Log a message when the script is run
console.log(
  `${blue(
    'integration-tools [INIT] '
  )} Build procedure starting...`
);


const DEFAULT_CONFIG = {
  snippetPath: 'snippets',
  snippetDataPath: 'snippet_data',
  snippetFilename: 'snippets.json',
  snippetListFilename: 'snippetList.json',
};
let config;

// Load configuration and log a message when done or on error.
try {
  config = require(path.join(process.cwd(), process.argv[2]));
  console.log(
    `${green(
      'integration-tools [DONE] '
    )} Build procedure has loaded the configuration file.`
  );
} catch (err) {
  console.log(`${red('integration-tools [ERRR]  ')} Build prodecure has encountered an error while loading the configuration file: ${err}`);
  process.exit(1);
}

build(Object.assign({}, DEFAULT_CONFIG, config ));


console.log(
  `${blue(
    'integration-tools [EXIT] '
  )} Build procedure exiting...`
);
