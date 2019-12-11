const execSync = require('child_process').execSync;

const questions = (cwd = '') => [
  {
    type: 'input',
    name: 'projectName',
    message: 'Specify a name for the repository:',
    default() {
      return `${cwd.split(/[\\/]/).slice(-1)}`;
    },
    validate(input) {
      return input.trim().length ? true : 'Sorry, repository name cannot be empty!';
    },
  },
  {
    type: 'input',
    name: 'projectDescription',
    message: 'Specify a description for the repository:',
    default: 'Short code snippets for all your development needs',
    validate(input) {
      return input.trim().length ? true : 'Sorry, repository description cannot be empty!';
    },
  },
  {
    type: 'input',
    name: 'projectURL',
    message: 'Specify a GitHub URL for the repository:',
    default() {
      return execSync('git config --get remote.origin.url', { cwd }).toString().trim().replace(/\/*\.git$/, '');
    },
    validate(input) {
      return input.trim().length ? true : 'Sorry, repository URL cannot be empty!';
    },
  },
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

module.exports = questions;
