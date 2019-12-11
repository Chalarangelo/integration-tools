const fs = require('fs-extra');
const path = require('path');
const { green, red } = require('kleur');
const execSync = require('child_process').execSync;

const stringifyConfig = config => `module.exports = ${JSON.stringify(config, null, 2)};`;

const getFile = filePath => fs.readFileSync(filePath, 'utf8');

const replaceRepoURL = (string, repoURL) => string.replace(/repoURL/g, repoURL);

const replaceRepoShortLang = (string, repoShortLang) => string.replace(/repoShortLang/g, repoShortLang);

const replaceRepoLongLang = (string, repoLongLang) => string.replace(/repoLongLang/g, repoLongLang);

const copyGeneratedFile = (fileName, sourceDir, targetDir, config) => {
  const fileData = replaceRepoURL(
    replaceRepoShortLang(
      replaceRepoLongLang(
        getFile(path.join(sourceDir, fileName)),
        config.language.short
      ),
      config.language.long
    ),
    config.repositoryUrl
  );
  fs.writeFileSync(path.join(targetDir, fileName), fileData );
};

const init = (answers, cwd, dirName) => {
  const sourcePath = path.join(dirName, '..', 'initData');
  const config = {
    name: answers.projectName,
    description: answers.projectDescription,
    repositoryUrl: answers.projectURL,
    snippetPath: 'snippets',
    snippetDataPath: 'snippet_data',
    language: {
      short: answers.projectLangShort,
      long: answers.projectLangLong,
    },
  };

  const pkg = {
    name: config.name,
    version: '1.0.0',
    description: config.description,
    main: 'config.js',
    scripts: {
      extractor: 'extract-snippet-data config.js',
    },
    repository: {
      type: 'git',
      url: config.repositoryUrl,
    },
    author: '30-seconds',
    license: 'CC0-1.0',
    bugs: {
      url: `${config.repositoryUrl}/issues`,
    },
    homepage: 'https://www.30secondsofcode.org',
    dependencies: {},
    devDependencies: {
      '@30-seconds/integration-tools': '^1.1.0',
    },
  };

  const dirPath = cwd;

  try {
    [
      '.github',
      path.join('.github', 'ISSUE_TEMPLATE'),
      '.travis',
      'snippets',
      'snippet_data',
    ].forEach(dName => {
      if(!fs.existsSync(path.join(dirPath, dName)))
        fs.mkdirSync(path.join(dirPath, dName));
    });
    console.log(
      `${green(
        'integration-tools [DONE] '
      )} Initialization procedure has created the necessary directories.`
    );

    fs.writeFileSync(path.join(dirPath, 'config.js'), stringifyConfig(config) );
    console.log(
      `${green(
        'integration-tools [DONE] '
      )} Initialization procedure has created the repository config file.`
    );

    fs.writeFileSync(path.join(dirPath, 'package.json'), JSON.stringify(pkg, null, 2) );
    console.log(
      `${green(
        'integration-tools [DONE] '
      )} Initialization procedure has created the repository package file.`
    );

    [
      'CODE_OF_CONDUCT.md',
      'LICENSE',
      'logo.png',
      '.travis.yml',
      path.join('.github', 'ISSUE_TEMPLATE', 'bug_report.md'),
      path.join('.github', 'ISSUE_TEMPLATE', 'discussion.md'),
      path.join('.github', 'ISSUE_TEMPLATE', 'feature_request.md'),
    ].forEach(fName => {
      fs.copyFileSync(path.join(sourcePath, fName), path.join(dirPath, fName));
    });
    console.log(
      `${green(
        'integration-tools [DONE] '
      )} Initialization procedure has copied the static files.`
    );

    [
      'CONTRIBUTING.md',
      'snippet-template.md',
      'README.md',
      path.join('.travis', 'push.sh'),
      path.join('.github', 'PULL_REQUEST_TEMPLATE.md'),
    ].forEach(fName => {
      copyGeneratedFile(fName, sourcePath, dirPath, config);
    });
    console.log(
      `${green(
        'integration-tools [DONE] '
      )} Initialization procedure has copied the generated files.`
    );

    console.log(execSync('npm install', { cwd: dirPath }).toString());
    console.log(
      `${green(
        'integration-tools [DONE] '
      )} Initialization procedure has installed the necessary dependencies.`
    );

  } catch (err) {
    console.log(`${red('integration-tools [ERRR]  ')} Initialization prodecure has encountered an error while creating the repository: ${err}`);
    process.exit(1);
  }
};

module.exports = init;
