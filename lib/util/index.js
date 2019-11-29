const {
  isTravisCI,
  isTravisCronOrAPI,
  isNotTravisCronOrAPI,
} = require('./environmentCheck');
const {
  getMarkDownAnchor,
  objectFromPairs,
  capitalize,
  prepTaggedData,
} = require('./helpers');
const {
  getFilesInDir,
  getData,
  hashData,
  getId,
  getCodeBlocks,
  getTextualContent,
  getGitMetadata,
  getTags,
  readSnippets,
} = require('./snippetParser');

module.exports = {
  isTravisCI,
  isTravisCronOrAPI,
  isNotTravisCronOrAPI,
  getMarkDownAnchor,
  objectFromPairs,
  capitalize,
  prepTaggedData,
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
