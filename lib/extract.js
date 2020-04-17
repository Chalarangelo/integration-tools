const fs = require('fs-extra');
const path = require('path');
const { green, blue } = require('kleur');
const util = require('./util');
const customParsers = require('./customParsers');

/**
 * Snippet extraction tool.
 * Generates the snippets.json file.
 * @param config The project's configuration file.
 */
const extract = config => {
  // Terminate early if parent commit is a Travis build
  if (
    util.isTravisCI() &&
    /^Travis build: \d+/g.test(process.env['TRAVIS_COMMIT_MESSAGE'])
  ) {
    console.log(
      `${green(
        'integration-tools [SKIP] '
      )} Extraction procedure terminated, parent commit is a Travis build!`
    );
    process.exit(0);
  }

  // Paths (relative to package.json)
  const SNIPPETS_PATH = `./${config.snippetPath}`;
  const OUTPUT_PATH = `./${config.snippetDataPath}`;
  const SNIPPETS_JSON_FILENAME = `${config.snippetFilename}`;

  // Setup everything
  let snippets = {};
  let snippetsArray = [];
  console.time(`${blue(
    'integration-tools [STAT] '
  )} Extraction procedure completed in`);

  // Synchronously read all snippets from snippets folder and sort them as necessary (case-insensitive)
  if(config.parser && config.parser !== 'default')
    snippets = customParsers[config.parser].readSnippets(SNIPPETS_PATH, config);
  else
    snippets = util.readSnippets(SNIPPETS_PATH, config);

  snippetsArray = Object.keys(snippets).reduce((acc, key) => {
    acc.push(snippets[key]);
    return acc;
  }, []);

  const completeData = {
    data: [...snippetsArray],
    meta: {
      specification: 'http://jsonapi.org/format/',
      type: 'snippetArray',
      language: config.language,
    },
  };

  // Parse additional languages
  let otherLanguages = [];
  if(config.secondLanguage || config.optionalLanguage) {
    if(config.secondLanguage) otherLanguages.push(config.secondLanguage);
    if(config.optionalLanguage) otherLanguages.push(config.optionalLanguage);
    completeData.meta.otherLanguages = otherLanguages;
  }

  // Write files
  if(!fs.existsSync(OUTPUT_PATH))
    fs.mkdirSync(OUTPUT_PATH);
  fs.writeFileSync(
    path.join(OUTPUT_PATH, SNIPPETS_JSON_FILENAME),
    JSON.stringify(completeData, null, 2)
  );

  // Display messages and time
  console.log(
    `${green('integration-tools [DONE] ')} Extraction procedure for ${SNIPPETS_JSON_FILENAME} completed.`
  );
  console.timeEnd(`${blue(
    'integration-tools [STAT] '
  )} Extraction procedure completed in`);
};

module.exports = extract;
