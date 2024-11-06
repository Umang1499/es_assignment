/* eslint-disable implicit-arrow-linebreak */
/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) =>
  keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});

const formatErrorMsg = (e) => {
  let message = '';
  if (typeof e === 'string') {
    message = e;
  } else if (e.meta) {
    message = e.meta.cause || '';
  } else if (e.message) {
    message = e.message;
  } else {
    message = 'Something went wrong.';
  }
  return message;
};

module.exports = {
  pick,
  formatErrorMsg,
};
