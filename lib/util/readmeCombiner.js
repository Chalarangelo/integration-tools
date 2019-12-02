const fs = require('fs-extra');
const { red } = require('kleur');
const { capitalize } = require('./helpers');
const markdown = require('markdown-builder');
const { headers, misc, lists } = markdown;

/**
 * Loops over tags and snippets to create the table of contents.
 * @param snippetsArray An array of snippets.
 * @param tags An array of tags.
 * @param emojis An object with tag-emoji key-value pairs.
 */
const makeTableOfContents = (snippetsArray, tags, emojis) => {
  let output = '';
  for (const tag of tags) {
    const capitalizedTag = capitalize(tag, true);
    const taggedSnippets = snippetsArray.filter(
      snippet => snippet.attributes.tags[0] === tag
    );
    output += headers.h3((emojis[tag] || '') + ' ' + capitalizedTag).trim();

    output +=
    misc.collapsible(
      'View contents',
      lists.ul(taggedSnippets, snippet =>
        misc.link(
          `\`${snippet.title}\``,
          `${misc.anchor(snippet.title)}${
            snippet.attributes.tags.includes('advanced') ? '-' : ''
          }`
        )
      )
    ) + '\n';
  }
  return output;
};

/**
 * Creates the examples for a snippet.
 * @param snippet A snippet object.
 * @param config The repo's configuration object.
 */
const makeExamples = (snippet, config) => {
  return misc.collapsible(
    'Examples',
    `\`\`\`${config.language.short}\n${snippet.attributes.codeBlocks.example}\n\`\`\``
  ) +
  '\n<br>' +
  misc.link('⬆ Back to top', misc.anchor('Contents')) +
  '\n';
};

/**
 * Creates the header for a tag.
 * @param tag A tag.
 * @param emojis  An object with tag-emoji key-value pairs..
 */
const makeTagHeader = (tag, emojis) => {
  const capitalizedTag = capitalize(tag, true);
  return misc.hr() + headers.h2((emojis[tag] || '') + ' ' + capitalizedTag) + '\n';
};

/**
 * Creates the header for a snippet.
 * @param snippet A snippet object.
 */
const makeSnippetHeader = snippet => {
  if (snippet.attributes.tags.includes('advanced')) {
    return headers.h3(
      snippet.title + ' ' + misc.image('advanced', '/advanced.svg')
    ) + '\n';
  } else return headers.h3(snippet.title) + '\n';
};

/**
 * Creates the text for a snippet.
 * @param snippet A snippet object.
 */
const makeSnippetText = snippet => `${snippet.attributes.text}`;

/**
 * Creates the code for a snippet.
 * @param snippet A snippet object.
 * @param config The repo's configuration object.
 */
const makeSnippetCode = (snippet, config) => `\`\`\`${config.language.short}\n${snippet.attributes.codeBlocks.code}\n\`\`\``;

const combineSnippets = (snippetsArray, tags, config, startPart, endPart) => {
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
  makeTableOfContents,
  makeExamples,
  makeTagHeader,
  makeSnippetHeader,
  makeSnippetText,
  makeSnippetCode,
  combineSnippets,
};
