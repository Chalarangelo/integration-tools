const DEFAULT_CONFIG = {
  snippetPath: 'snippets',
  snippetDataPath: 'snippet_data',
  snippetFilename: 'snippets.json',
  snippetListFilename: 'snippetList.json',
  snippetArchiveFilename: 'archivedSnippets.json',
  snippetArchiveListFilename: 'archivedSnippetList.json',
  language: {
    short: '',
    long: '',
  },
  staticPartsPath: 'src/static-parts',  // TODO: Maybe remove src?
};

module.exports = {
  DEFAULT_CONFIG,
};
