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
  hashData,
  getCodeBlocks,
  getTextualContent,
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
  hashData,
  getCodeBlocks,
  getTextualContent,
  readSnippets,
};
