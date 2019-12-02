const fs = require('fs-extra');
const path = require('path');
const { green, red, blue } = require('kleur');
const util = require('./util');
const customParsers = require('./customParsers');
const customCombiners = require('./customCombiners');

/**
 * README building tool.
 * Generates the README.md file.
 * @param config The project's configuration file.
 */
const build = config => {
  // Paths (relative to package.json)
  const SNIPPETS_PATH = `./${config.snippetPath}`;
  const STATIC_PARTS_PATH = `./${config.staticPartsPath}`;

  // Terminate if parent commit is a Travis build
  if (
    util.isTravisCI() &&
      /^Travis build: \d+/g.test(process.env['TRAVIS_COMMIT_MESSAGE'])
  ) {
    console.log(
      `${green(
        'integration-tools [SKIP] '
      )} Build procedure terminated, parent commit is a Travis build!`
    );
    process.exit(0);
  }

  // Setup everything
  let snippets = {};
  let snippetsArray = [];
  let startPart = '';
  let endPart = '';

  console.time(`${blue(
    'integration-tools [STAT] '
  )} Build procedure completed in`);

  // Synchronously read all snippets from snippets folder and sort them as necessary (case-insensitive)
  if(config.parser && config.parser !== 'default')
    snippets = customParsers[config.parser].readSnippets(SNIPPETS_PATH, config);
  else
    snippets = util.readSnippets(SNIPPETS_PATH, config);


  snippetsArray = Object.keys(snippets).reduce((acc, key) => {
    acc.push(snippets[key]);
    return acc;
  }, []);

  // Load static parts for the README file
  try {
    startPart = fs.readFileSync(
      path.join(STATIC_PARTS_PATH, 'README-start.md'),
      'utf8'
    );
    endPart = fs.readFileSync(
      path.join(STATIC_PARTS_PATH, 'README-end.md'),
      'utf8'
    );
  } catch (err) {
    console.log(`${red('integration-tools [ERRR] ')} Build procedure has encountered an error during static part loading: ${err}`);
    process.exit(1);
  }

  const tags = util.prepTaggedData(
    Object.keys(snippets).reduce((acc, key) => {
      acc[key] = snippets[key].attributes.tags;
      return acc;
    }, {})
  );

  // Create and write the output for the README file
  if(config.combiner && config.combiner !== 'default')
    customCombiners[config.combiner].combineSnippets(snippetsArray, tags, config, startPart, endPart);
  else
    util.combineSnippets(snippetsArray, tags, config, startPart, endPart);

  console.log(`${green('integration-tools [DONE] ')} Build procedure for README.md completed.`);
  console.timeEnd(`${blue(
    'integration-tools [STAT] '
  )} Build procedure completed in`);
};

module.exports = build;
