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
  const SNIPPET_LIST_JSON_FILENAME = `${config.snippetListFilename}`;

  const HAS_ARCHIVE = !!config.snippetArchivePath;
  const SNIPPETS_ARCHIVE_PATH = `./${config.snippetArchivePath}`;
  const SNIPPETS_ARCHIVE_JSON_FILENAME = `${config.snippetArchiveFilename}`;
  const SNIPPET_ARCHIVE_LIST_JSON_FILENAME = `${config.snippetArchiveListFilename}`;

  // Setup everything
  let snippets = {};
  let snippetsArray = [];
  let archivedSnippets = {};
  let archivedSnippetsArray = [];
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

  if(HAS_ARCHIVE) {
    if(config.parser && config.parser !== 'default')
      archivedSnippets = customParsers[config.parser].readSnippets(SNIPPETS_ARCHIVE_PATH, config);
    else
      archivedSnippets = util.readSnippets(SNIPPETS_ARCHIVE_PATH);

    archivedSnippetsArray = Object.keys(archivedSnippets).reduce((acc, key) => {
      acc.push(archivedSnippets[key]);
      return acc;
    }, []);
  }

  const completeData = {
    data: [...snippetsArray],
    meta: {
      specification: 'http://jsonapi.org/format/',
      type: 'snippetArray',
      language: config.language,
    },
  };

  const listingData = {
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

  // Parse additional languages
  let otherLanguages = [];
  if(config.secondLanguage || config.optionalLanguage) {
    if(config.secondLanguage) otherLanguages.push(config.secondLanguage);
    if(config.optionalLanguage) otherLanguages.push(config.optionalLanguage);
    completeData.meta.otherLanguages = otherLanguages;
    listingData.meta.otherLanguages = otherLanguages;
  }

  let archiveCompleteData = null;
  let archiveListingData = null;

  if(HAS_ARCHIVE) {
    archiveCompleteData = {
      data: [...archivedSnippetsArray],
      meta: {
        specification: 'http://jsonapi.org/format/',
        type: 'snippetArray',
        scope: SNIPPETS_ARCHIVE_PATH,
        language: config.language,
      },
    };
    archiveListingData = {
      data: archiveCompleteData.data.map(v => ({
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
        scope: SNIPPETS_ARCHIVE_PATH,
        language: config.language,
      },
    };

    if(config.secondLanguage || config.optionalLanguage) {
      archiveCompleteData.meta.otherLanguages = otherLanguages;
      archiveListingData.meta.otherLanguages = otherLanguages;
    }
  }

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

  if(HAS_ARCHIVE) {
    fs.writeFileSync(
      path.join(OUTPUT_PATH, SNIPPETS_ARCHIVE_JSON_FILENAME),
      JSON.stringify(archiveCompleteData, null, 2)
    );
    fs.writeFileSync(
      path.join(OUTPUT_PATH, SNIPPET_ARCHIVE_LIST_JSON_FILENAME),
      JSON.stringify(archiveListingData, null, 2)
    );
  }

  // Display messages and time
  console.log(
    `${green('integration-tools [DONE] ')} Extraction procedure for ${SNIPPETS_JSON_FILENAME} and ${SNIPPET_LIST_JSON_FILENAME} completed.`
  );
  if(HAS_ARCHIVE) {
    console.log(
      `${green('integration-tools [DONE] ')} Extraction procedure for ${SNIPPETS_ARCHIVE_JSON_FILENAME} and ${SNIPPET_ARCHIVE_LIST_JSON_FILENAME} completed.`
    );

  }
  console.timeEnd(`${blue(
    'integration-tools [STAT] '
  )} Extraction procedure completed in`);
};

module.exports = extract;
