const { blue, red } = require('kleur');
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
 * Synchronously read all snippets and sort them as necessary.
 * The sorting is case-insensitive.
 * @param snippetsPath The path of the snippets directory.
 */
const readSnippets = (snippetsPath, config) => {
  console.log(`${blue('integration-tools [INFO]  ')}Custom parsing logic from '_30blogParser' has been loaded.`);

  const snippetFilenames = getFilesInDir(snippetsPath, false);

  let snippets = {};
  try {
    for (let snippet of snippetFilenames) {
      let data = getData(snippetsPath, snippet);
      snippets[snippet] = {
        id: getId(snippet),
        title: data.attributes.title,
        type: `blog.${data.attributes.type}`,
        attributes: {
          fileName: snippet,
          cover: data.attributes.cover,
          authors: getTags(data.attributes.authors),
          text: data.body,
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
  readSnippets,
};
