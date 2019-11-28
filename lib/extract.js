const fs = require('fs-extra');
const path = require('path');
const { green, blue } = require('kleur');
const util = require('./util');

/**
 * Snippet extraction tool.
 * Generates the snippets.json file.
 * @param config The project's configuration file.
 */
const extract = config => {
  // Paths (relative to package.json)
  const SNIPPETS_PATH = `./${config.snippetPath}`;
  const OUTPUT_PATH = `./${config.snippetDataPath}`;
  const SNIPPETS_JSON_FILENAME = `${config.snippetFilename}`;
  const SNIPPET_LIST_JSON_FILENAME = `${config.snippetListFilename}`;

  // Terminate if parent commit is a Travis build
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

  // Setup everything
  let snippets = {};
  let snippetsArray = [];
  console.time(`${blue(
    'integration-tools [STAT] '
  )} Extraction procedure completed in`);

  // Synchronously read all snippets from snippets folder and sort them as necessary (case-insensitive)
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

  let listingData = {
    data: completeData.data.map(v => ({
      id: v.id,
      type: 'snippetListing',
      title: v.title,
      attributes: {
        text: v.attributes.text,
        tags: v.attributes.tags,
      },
      meta: {
        hash: v.meta.hash,
      },
    })),
    meta: {
      specification: 'http://jsonapi.org/format/',
      type: 'snippetListingArray',
      language: config.language,
    },
  };

  // Write files
  if(!fs.existsSync(OUTPUT_PATH))
    fs.mkdirSync(OUTPUT_PATH);
  fs.writeFileSync(
    path.join(OUTPUT_PATH, SNIPPETS_JSON_FILENAME),
    JSON.stringify(completeData, null, 2)
  );
  fs.writeFileSync(
    path.join(OUTPUT_PATH, SNIPPET_LIST_JSON_FILENAME),
    JSON.stringify(listingData, null, 2)
  );

  // Display messages and time
  console.log(
    `${green('integration-tools [DONE] ')} Extraction procedure for ${SNIPPETS_JSON_FILENAME} and ${SNIPPET_LIST_JSON_FILENAME} completed.`
  );
  console.timeEnd(`${blue(
    'integration-tools [STAT] '
  )} Extraction procedure completed in`);
};

module.exports = extract;
