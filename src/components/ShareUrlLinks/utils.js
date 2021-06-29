/**
 *
 * @param {Object.<String, *>} props - The componentProps
 * @param {Array.<String>} parameterString - The unique key strings to be added to the parameters
 * @returns {String} - The concatenated string
 */
export const getShareUrlParameters = (props, parameterString) =>
  parameterString.reduce((acc, key) => {
    const value = props[key];

    if (value !== undefined) {
      acc += `${acc.length > 0 ? '&' : ''}${key}=${value}`;
    }

    return acc;
  }, '');
