const fs = require('fs-extra');
const path = require('path');
const { red } = require('kleur');
const crypto = require('crypto');
const frontmatter = require('front-matter');

/**
 * Reads all files in a directory and returns the resulting array.
 * @param directoryPath The path of the directory to read.
 * @param withPath Should the path be included into the final result.
 * @param exclude File names to be excluded.
 */
const getFilesInDir = (directoryPath, withPath, exclude = null) => {
  try {
    let directoryFilenames = fs.readdirSync(directoryPath);
    directoryFilenames.sort((a, b) => {
      a = a.toLowerCase();
      b = b.toLowerCase();
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });

    if (withPath) {
      // a hacky way to do conditional array.map
      return directoryFilenames.reduce((fileNames, fileName) => {
        if (
          exclude == null ||
          !exclude.some(toExclude => fileName === toExclude)
        )
          fileNames.push(`${directoryPath}/${fileName}`);
        return fileNames;
      }, []);
    }
    return directoryFilenames.filter(v => v !== 'README.md');
  } catch (err) {
    console.log(`${red('ERROR!')} During snippet loading: ${err}`);
    process.exit(1);
  }
};

/**
 * Creates a hash for a value using the SHA-256 algorithm.
 * @param val The value to be hashed.
 */
const hashData = val =>
  crypto
    .createHash('sha256')
    .update(val)
    .digest('hex');

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
    code: results[0],
    example: results[1],
  };
};

/**
 * Gets the textual content for a snippet.
 * @param str The snippet's raw content.
 */
const getTextualContent = str => {
  const regex = /([\s\S]*?)```/g;
  const results = [];
  let m = null;
  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) regex.lastIndex += 1;

    m.forEach(match => {
      results.push(match);
    });
  }
  return results[1].replace(/\r\n/g, '\n');
};

/**
 * Synchronously read all snippets and sort them as necessary.
 * The sorting is case-insensitive.
 * @param snippetsPath The path of the snippets directory.
 */
const readSnippets = snippetsPath => {
  const snippetFilenames = getFilesInDir(snippetsPath, false);

  let snippets = {};
  try {
    for (let snippet of snippetFilenames) {
      let data = frontmatter(
        fs.readFileSync(path.join(snippetsPath, snippet), 'utf8')
      );
      snippets[snippet] = {
        id: snippet.slice(0, -3),
        title: data.attributes.title,
        type: 'snippet',
        attributes: {
          fileName: snippet,
          text: getTextualContent(data.body),
          codeBlocks: getCodeBlocks(data.body),
          tags: data.attributes.tags.split(',').map(t => t.trim()),
        },
        meta: {
          hash: hashData(data.body),
        },
      };
    }
  } catch (err) {
    console.log(`${red('ERROR!')} During snippet loading: ${err}`);
    process.exit(1);
  }
  return snippets;
};

module.exports = {
  getFilesInDir,
  hashData,
  getCodeBlocks,
  getTextualContent,
  readSnippets,
};
