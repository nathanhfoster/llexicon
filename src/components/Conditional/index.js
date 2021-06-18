import React from 'react';
import PropTypes from 'prop-types';

/**
 * Cleans a childKeys string and splits them into an array of key strings
 * @param {Number|String} childKey - childKeys string to be cleaned
 * @returns {Array.<String>} - array of keys
 */
const getArrayOfKeys = childKeys => {
  const stringChildrenKey = childKeys.toString();
  const childrenKeyWithNoSpaces = stringChildrenKey.replace(/\s+/g, '');
  const arrayOfChildrenKeys = childrenKeyWithNoSpaces.split(',');
  return arrayOfChildrenKeys;
};

/**
 * Conditional Component conditionally renders a child that matches a given key or index
 * @param {Boolean} show - whether or not to return the children
 * @param {String|Number} childrenKeysToRender - unqiue keys (',' is the delimeter) of the children to render
 * @param {React.children} children - the child component(s)
 * @returns {React.Component|React.FunctionComponent|null} - the found child or null
 */
const Conditional = ({ show, childrenKeysToRender, children }) => {
  // If children or show is falsey
  if (!(children && show)) return null;
  // If the childrenKeysToRender is falsey
  if (!childrenKeysToRender) return children;

  /**
   *  Filter out children whose childKeys are not a subset of childrenKeysToRender.
   *  The childrenKeysToRender or childKey strings can have a ',' as a delinator
   */
  const childrenToRender =
    children.filter(({ key: childKey }, index) => {
      if (!childKey) {
        throw new TypeError(`Child component at index: ${index} does not have a key!`);
      }
      const childKeys = getArrayOfKeys(childKey);
      const childrenKeys = getArrayOfKeys(childrenKeysToRender);
      // return all the childKeys that are a subset of childrenKeys
      const childFound = childrenKeys.some(c => childKeys.includes(c));
      return childFound;
    }) || null;

  return childrenToRender;
};

Conditional.propTypes = {
  show: PropTypes.bool,
  childrenKeysToRender: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
};

Conditional.defaultProps = { show: true, childrenKeysToRender: undefined, children: undefined };

export default Conditional;
