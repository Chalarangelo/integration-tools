/**
 * Checks if current enviroment is Travis CI.
 * Returns true if it is, false if it isn't.
 */
const isTravisCI = () => 'TRAVIS' in process.env && 'CI' in process.env;

/**
 * Checks if the current Travis CI event is a CRON or API event.
 * Returns true if it is one of them, false if it isn't either one.
 */
const isTravisCronOrAPI = () =>
  process.env['TRAVIS_EVENT_TYPE'] === 'cron' ||
  process.env['TRAVIS_EVENT_TYPE'] === 'api';

/**
 * Checks if the current Travis CI event is not a CRON or API event.
 * Returns true if it is none of them, false if it is either one.
 */
const isNotTravisCronOrAPI = () => !isTravisCronOrAPI();

module.exports = {
  isTravisCI,
  isTravisCronOrAPI,
  isNotTravisCronOrAPI,
};
