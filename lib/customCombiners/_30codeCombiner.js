const fs = require('fs-extra');
const { blue, red } = require('kleur');
const {
  makeTableOfContents,
  makeExamples,
  makeTagHeader,
  makeSnippetHeader,
  makeSnippetText,
} = require('../util');

/**
 * Creates the code for a snippet.
 * @param snippet A snippet object.
 * @param config The repo's configuration object.
 */
const makeSnippetCode = (snippet, config) => `\`\`\`${config.language.short}\n${snippet.attributes.codeBlocks.es6}\n\`\`\``;

const combineSnippets = (snippetsArray, tags, config, startPart, endPart) => {
  console.log(`${blue('integration-tools [INFO]  ')}Custom building logic from '_30codeCombiner' has been loaded.`);

  const EMOJIS = config.emojis || {};
  let output = `${startPart}\n`;
  try {

    output += makeTableOfContents(snippetsArray, tags, EMOJIS);

    for (const tag of tags) {
      output += makeTagHeader(tag, EMOJIS);

      const taggedSnippets = snippetsArray.filter(
        snippet => snippet.attributes.tags[0] === tag
      );

      for (let snippet of taggedSnippets) {
        output += makeSnippetHeader(snippet);

        output += makeSnippetText(snippet);

        output += makeSnippetCode(snippet, config);

        output += makeExamples(snippet, config);
      }
    }

    // Add the ending static part
    output += `\n${endPart}\n`;
    // Write to the README file
    fs.writeFileSync('README.md', output);
  } catch (err) {
    console.log(`${red('integration-tools [ERRR] ')} Build procedure has encountered an error during README.md generation: ${err}`);
    process.exit(1);
  }
};

module.exports = {
  makeSnippetCode,
  combineSnippets,
};
