#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');

const questions = [
  {
    type: 'input',
    name: 'projectLangLong',
    message: 'Specify a long programming language name for the repository:',
    validate(input) {
      return input.trim().length ? true : 'Sorry, repository language long name cannot be empty!';
    },
  },
  {
    type: 'input',
    name: 'projectLangShort',
    message: 'Specify a short programming language name for the repository:',
    validate(input) {
      return input.trim().length ? true : 'Sorry, repository language short name cannot be empty!';
    },
  },
];

const copyGeneratedFile = (fileName, sourceDir, targetDir, repoShortLang, repoLongLang) => {
  const fileData = fs.readFileSync(path.join(sourceDir, fileName), 'utf8')
    .replace(/repoLongLang/g, repoLongLang)
    .replace(/repoShortLang/g, repoShortLang);
  fs.writeFileSync(path.join(targetDir, fileName), fileData );
};

const initialize = (answers, cwd, dirName) => {
  const sourcePath = path.join(dirName, '..', 'initData');
  const dirPath = cwd;

  try {
    [
      '.github',
      'snippets',
    ].forEach(dName => {
      if(!fs.existsSync(path.join(dirPath, dName)))
        fs.mkdirSync(path.join(dirPath, dName));
    });

    [
      'CODE_OF_CONDUCT.md',
      'LICENSE',
      'logo.png',
      '.gitattributes',
      path.join('.github', 'config.yml'),
      path.join('.github', 'lock.yml'),
      path.join('.github', 'stale.yml'),
    ].forEach(fName => {
      fs.copyFileSync(path.join(sourcePath, fName), path.join(dirPath, fName));
    });

    [
      'CONTRIBUTING.md',
      'snippet-template.md',
      'README.md',
    ].forEach(fName => {
      copyGeneratedFile(fName, sourcePath, dirPath, answers.projectLangShort, answers.projectLangLong);
    });

  } catch (err) {
    console.log(`Initialization prodecure has encountered an error while creating the repository: ${err}`);
    process.exit(1);
  }
};

// Log a message when the script is run
console.log('Initializing new content repository');

inquirer
  .prompt(questions)
  .then(
    answers => {
      initialize(answers, process.cwd(), __dirname);
      console.log('Initialization process complete');
    }
  );
