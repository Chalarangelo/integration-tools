const questions = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Specify a name for the repository:',
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
    name: 'projectPath',
    message: 'Specify a directory for the repository:',
    validate(input) {
      return input.trim().length ? true : 'Sorry, repository directory cannot be empty!';
    },
  },
  {
    type: 'input',
    name: 'projectURL',
    message: 'Specify a GitHub URL for the repository:',
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
