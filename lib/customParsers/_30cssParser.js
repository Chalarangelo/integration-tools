const { blue, red } = require('kleur');
const sass = require('node-sass');
const {
  getFilesInDir,
  getData,
  hashData,
  getGitMetadata,
  getId,
  getTags,
} = require('../util');
const caniuseDb = require('caniuse-db/data.json');

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

// Gets the textual content for a snippet file.
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
 * Gets the explanation for a snippet file.
 * @param str The snippet's data as a string.
 */
const getExplanation = str => {
  const regex = /####\s*Explanation([\s\S]*)####/g;
  const results = [];
  let m = null;
  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) regex.lastIndex += 1;

    m.forEach(match => {
      results.push(match);
    });
  }
  // console.log(results);
  return results[1].replace(/\r\n/g, '\n');
};

/**
 * Gets the browser support for a snippet file.
 * @param str The snippet's data as a string.
 */
const getBrowserSupport = str => {
  const regex = /####\s*Browser [s|S]upport([\s\S]*)/g;
  const results = [];
  let m = null;
  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) regex.lastIndex += 1;

    m.forEach(match => {
      results.push(match);
    });
  }
  let browserSupportText = results[1].replace(/\r\n/g, '\n');
  const supportPercentage = (
    browserSupportText.match(/https?:\/\/caniuse\.com\/#feat=.*/g) || []
  ).map(feat => {
    const featData = caniuseDb.data[feat.match(/#feat=(.*)/)[1]];
    // caniuse doesn't count "untracked" users, which makes the overall share
    // appear much lower than it probably is. Most of these untracked browsers
    // probably support these features. Currently it's around 5.3% untracked,
    // so we'll use 4% as probably supporting the feature. Also the npm package
    // appears to show higher usage % than the main website, this shows about
    // 0.2% lower than the main website when selecting "tracked users"
    // (as of Feb 2019).
    const UNTRACKED_PERCENT = 4;
    const usage = featData
      ? Number(featData.usage_perc_y + featData.usage_perc_a) + UNTRACKED_PERCENT
      : 100;
    return Math.min(100, usage);
  });
  return {
    text: browserSupportText,
    supportPercentage: Math.min(...supportPercentage, 100),
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
          explanation: getExplanation(data.body),
          browserSupport: getBrowserSupport(data.body),
          codeBlocks: getCodeBlocks(data.body, config),
          tags: getTags(data.attributes.tags),
        },
        meta: {
          hash: hashData(data.body),
          ...getGitMetadata(snippet),
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
  getExplanation,
  getBrowserSupport,
  readSnippets,
};
