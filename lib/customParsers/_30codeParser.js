const { blue, red } = require('kleur');
const babel = require('@babel/core');
const {
  getFilesInDir,
  getData,
  hashData,
  getTextualContent,
  getGitMetadata,
  getId,
  getTags,
} = require('../util');

/**
 * Gets the code blocks for a snippet.
 * @param str The snippet's raw content.
 * @param config The project's configuration file.
 */
const getCodeBlocks = (str, config) => {
  const regex = /```[.\S\s]*?```/g;
  let results = [];
  let m = null;
  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) regex.lastIndex += 1;

    // eslint-disable-next-line
    m.forEach(match => {
      results.push(match);
    });
  }
  const replacer = new RegExp(
    `\`\`\`${config.language.short}([\\s\\S]*?)\`\`\``,
    'g'
  );
  results = results.map(v => v.replace(replacer, '$1').trim());
  return {
    es6: results[0],
    es5: babel.transformSync(results[0], { presets: ['@babel/preset-env'] }).code.replace('"use strict";\n\n', ''),
    example: results[1],
  };
};

/**
 * Synchronously read all snippets and sort them as necessary.
 * The sorting is case-insensitive.
 * @param snippetsPath The path of the snippets directory.
 */
const readSnippets = (snippetsPath, config) => {
  console.log(`${blue('integration-tools [INFO]  ')}Custom parsing logic from '_30codeParser' has been loaded.`);

  const snippetFilenames = getFilesInDir(snippetsPath, false);

  let snippets = {};
  try {
    for (let snippet of snippetFilenames) {
      let data = getData(snippetsPath, snippet);
      snippets[snippet] = {
        id: getId(snippet),
        title: data.attributes.title,
        type: 'snippet',
        attributes: {
          fileName: snippet,
          text: getTextualContent(data.body),
          codeBlocks: getCodeBlocks(data.body, config),
          tags: getTags(data.attributes.tags),
        },
        meta: {
          hash: hashData(data.body),
          ...getGitMetadata(snippet, snippetsPath),
        },
      };
    }
  } catch (err) {
    console.log(`${red('integration-tools [ERRR]  ')}The current prodecure has encountered an error while reading snippets: ${err}`);
    process.exit(1);
  }
  return snippets;
};

module.exports = {
  getCodeBlocks,
  readSnippets,
};
