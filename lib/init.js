const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const { blue, green, red } = require('kleur');

const stringifyConfig = config => `module.exports = ${JSON.stringify(config, null, 2)};`;

const init = (answers, cwd) => {
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
  const dirPath = path.join(cwd, answers.projectPath);
  try {
    fs.mkdirSync(dirPath);
    console.log(
      `${green(
        'integration-tools [DONE] '
      )} Initialization procedure has created the repository directory.`
    );

    fs.writeFileSync(path.join(dirPath, 'config.js'), stringifyConfig(config) );
    console.log(
      `${green(
        'integration-tools [DONE] '
      )} Initialization procedure has created the repository config file.`
    );

  } catch (err) {
    console.log(`${red('integration-tools [ERRR]  ')} Initialization prodecure has encountered an error while creating the repository: ${err}`);
    process.exit(1);
  }
};

module.exports = init;
