const fs = require('fs-extra');
const path = require('path');
const { red } = require('kleur');
const crypto = require('crypto');
const frontmatter = require('front-matter');
const execSync = require('child_process').execSync;

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
      // Technically, this should never run as names in a directory are unique
      /* istanbul ignore next */
      return 0;
    });

    const _exclude = exclude === null ? ['README.md'] : ['README.md', ...exclude];

    return directoryFilenames.reduce((fileNames, fileName) => {
      if (
        _exclude.every(toExclude => fileName !== toExclude)
      ) {
        fileNames.push( withPath ?
          `${directoryPath}/${fileName}` :
          `${fileName}`
        );
      }
      return fileNames;
    }, []);
  } catch (err) {
    /* istanbul ignore next */
    console.log(`${red('integration-tools [ERRR]  ')} The current prodecure has encountered an error while getting files in a directory: ${err}`);
    /* istanbul ignore next */
    process.exit(1);
  }
};

/**
 * Gets the data from a snippet file in a usable format, using frontmatter.
 * @param snippetsPath The path of the snippets directory.
 * @param snippet The name of the snippet file.
 */
const getData = (snippetsPath, snippet) => frontmatter(
  fs.readFileSync(path.join(snippetsPath, snippet), 'utf8')
);

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
  if(config.optionalLanguage && config.optionalLanguage.short) {
    const optionalReplacer = new RegExp(`\`\`\`${config.optionalLanguage.short}([\\s\\S]*?)\`\`\``, 'g');
    results = results.map(v =>
      v
        .replace(replacer, '$1')
        .replace(optionalReplacer, '$1')
        .trim());
    if (results.length > 2) {
      return {
        style: results[0],
        code: results[1],
        example: results[2],
      };
    }
    return {
      style: '',
      code: results[0],
      example: results[1],
    };
  } else {
    results = results.map(v => v.replace(replacer, '$1').trim());
    return {
      code: results[0],
      example: results[1],
    };
  }
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
 * Gets the git metadata for a snippet.
 * @param snippet The name of the snippet file.
 */
const getGitMetadata = (snippet, snippetsPath) => {
  return ({
    firstSeen: execSync(`git log --diff-filter=A --pretty=format:%at -- ${snippetsPath}/${snippet} | head -1`).toString(),
    lastUpdated: execSync(`git log -n 1 --pretty=format:%at -- ${snippetsPath}/${snippet} | head -1`).toString(),
    updateCount: execSync(`git log --pretty=%H -- ${snippetsPath}/${snippet}`).toString().split('\n').length,
    authorCount: [...new Set(execSync(`git log --pretty=%an -- ${snippetsPath}/${snippet}`).toString().split('\n'))].length,
  });
};

/**
 * Gets the tag array for a snippet from the tags string.
 * @param tagStr The string of tags for the snippet.
 */
const getTags = tagStr =>
  tagStr
    .split(',')
    .map(t => t.trim())
    .reduce((acc, t) => acc.includes(t) ? acc : [...acc, t], []);

/**
 * Gets the snippet id from the snippet's filename.
 * @param snippetFilename Filename of the snippet.
 */
const getId = snippetFilename => snippetFilename.slice(0, -3);

/**
 * Synchronously read all snippets and sort them as necessary.
 * The sorting is case-insensitive.
 * @param snippetsPath The path of the snippets directory.
 */
const readSnippets = (snippetsPath, config) => {
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
    /* istanbul ignore next */
    console.log(`${red('integration-tools [ERRR]  ')}The current prodecure has encountered an error while reading snippets: ${err}`);
    /* istanbul ignore next */
    process.exit(1);
  }
  return snippets;
};

module.exports = {
  getFilesInDir,
  getData,
  hashData,
  getId,
  getCodeBlocks,
  getTextualContent,
  getGitMetadata,
  getTags,
  readSnippets,
};
