const { blue, red } = require('kleur');
const sass = require('node-sass');
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
  const replacer = new RegExp(`\`\`\`${config.language.short}([\\s\\S]*?)\`\`\``, 'g');
  const secondReplacer = new RegExp(`\`\`\`${config.secondLanguage.short}([\\s\\S]*?)\`\`\``, 'g');
  const optionalReplacer = new RegExp(`\`\`\`${config.optionalLanguage.short}([\\s\\S]*?)\`\`\``, 'g');
  results = results.map(v =>
    v
      .replace(replacer, '$1')
      .replace(secondReplacer, '$1')
      .replace(optionalReplacer, '$1')
      .trim()
  );
  if (results.length > 2) {
    return {
      html: results[0],
      css: results[1],
      js: results[2],
    }
    ;
  }
  return {
    html: results[0],
    css: results[1],
    js: '',
  };
};

/**
 * Synchronously read all snippets and sort them as necessary.
 * The sorting is case-insensitive.
 * @param snippetsPath The path of the snippets directory.
 */
const readSnippets = (snippetsPath, config) => {
  console.log(`${blue('integration-tools [INFO]  ')}Custom parsing logic from '_30cssParser' has been loaded.`);

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
      snippets[snippet].attributes.codeBlocks.scopedCss = sass
        .renderSync({
          data: `[data-scope="${snippets[snippet].id}"] { ${snippets[snippet].attributes.codeBlocks.css} }`,
        })
        .css.toString();
    }
  } catch (err) {
    console.log(`${red('integration-tools [ERRR]  ')}The current prodecure has encountered an error while reading snippets: ${err}`);
    process.exit(1);
  }
  return snippets;
};

module.exports = {
  getCodeBlocks,
  getTextualContent,
  readSnippets,
};
