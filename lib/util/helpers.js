/**
 * Returns the markdown anchor slug for a given title.
 * @param paragraphTitle A string represenation of your title
 */
const getMarkDownAnchor = paragraphTitle =>
  paragraphTitle
    .trim()
    .toLowerCase()
    .replace(/[^\w\- ]+/g, '')
    .replace(/\s/g, '-')
    .replace(/-+$/, '');

/**
 * Creates an object from an array of pairs.
 * @param arr An array of pairs.
 */
const objectFromPairs = arr => arr.reduce((a, v) => ((a[v[0]] = v[1]), a), {});

/**
 * Capitalizes the first letter of a string.
 * @param str The string to be transformed.
 * @param {*} lowerRest Should of the string the rest be lowercased?
 */
const capitalize = (str, lowerRest = false) =>
  str.slice(0, 1).toUpperCase() +
  (lowerRest ? str.slice(1).toLowerCase() : str.slice(1));

module.exports = {
  getMarkDownAnchor,
  objectFromPairs,
  capitalize,
};
