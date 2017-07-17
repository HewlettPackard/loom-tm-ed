/*******************************************************************************
 * (c) Copyright 2017 Hewlett Packard Enterprise Development LP Licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance with the License. You
 * may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 *******************************************************************************/
'use strict';

const _getProp = ($elem, prop = '') => {
  return window.getComputedStyle($elem, null).getPropertyValue(prop);
};

/**
 * Converts '100px' to 100
 * String @param px
 * Number @returns value
 * @private
 */
const _pxToValue = (px) => parseInt(px.replace('px', ''));

/**
 * Get sibling elements in DOM tree
 * Element @param $elem
 * Array @returns siblings
 */
const getSiblings = ($elem) => {
  let siblings = []; // @todo: This should be a NodeList
  let $prev = $elem ? $elem.previousElementSibling : null;
  let $next = $elem ? $elem.nextElementSibling : null;

  while ($prev) {
    siblings.push($prev);
    $prev = $prev.previousElementSibling;
  }

  while ($next) {
    siblings.push($next);
    $next = $next.nextElementSibling;
  }

  return siblings;
};

/**
 * Get the height of an element on the page.
 *
 * Optionally pass the box model for obtaining the height including/excluding border, margin & padding
 *
 * Element @param $elem
 * String @param box
 * Boolean @param includeAbsoluteAndFixed
 * Number @returns height
 */
const getHeight = ($elem, { box = 'content' }, includeAbsoluteAndFixed = false ) => {
  let height, boxSizing, borderTop, borderBottom, marginTop, marginBottom, paddingTop, paddingBottom, values, spacing;

  if (!$elem) {
    return 0;
  }

  const position = _getProp($elem, 'position');

  if (!includeAbsoluteAndFixed && (position === 'fixed' || position === 'absolute')) {
    return 0;
  }


  height = _pxToValue(_getProp($elem, 'height'));
  boxSizing = _getProp($elem, 'box-sizing');
  borderTop = borderBottom = marginTop = marginBottom = paddingTop = paddingBottom = "0px";
  spacing = 0;

  if (box === 'border' && boxSizing === 'border-box') {
    borderTop = _getProp($elem, 'border-top-width');
    borderBottom = _getProp($elem, 'border-bottom-width');
    marginTop = _getProp($elem, 'margin-top');
    marginBottom = _getProp($elem, 'margin-bottom');
    paddingTop = _getProp($elem, 'padding-top');
    paddingBottom = _getProp($elem, 'padding-bottom');

    values = [ borderTop, borderBottom, marginTop, marginBottom, paddingTop, paddingBottom ];

    spacing = values.reduce((prev, curr) => {
      let val = _pxToValue(curr);
      return val > 0 ? prev + val : prev;
    }, 0);
  }

  return height - spacing;
};

/**
 * Get the width of an element on the page.
 *
 * Optionally pass the box model for obtaining the height including/excluding border, margin & padding
 *
 * Element @param $elem
 * String @param box
 * Boolean @param includeAbsoluteAndFixed
 * Number @returns width
 */
const getWidth = ($elem, { box = 'content' }, includeAbsoluteAndFixed = false) => {
  let width, position, boxSizing, borderRight, borderLeft, marginRight, marginLeft, paddingRight, paddingLeft, values, spacing;

  if (!$elem) {
    return 0;
  }

  position = _getProp($elem, 'position');

  if (!includeAbsoluteAndFixed && (position === 'fixed' || position === 'absolute')) {
    return 0;
  }

  width = _pxToValue(_getProp($elem, 'width'));
  boxSizing = _getProp($elem, 'box-sizing');
  borderRight = borderLeft = marginRight = marginLeft = paddingRight = paddingLeft = "0px";
  spacing = 0;

  if (box === 'border' && boxSizing === 'border-box') {
    borderRight = _getProp($elem, 'border-right-width');
    borderLeft = _getProp($elem, 'border-left-width');
    marginRight = _getProp($elem, 'margin-right');
    marginLeft = _getProp($elem, 'margin-left');
    paddingRight = _getProp($elem, 'padding-right');
    paddingLeft = _getProp($elem, 'padding-left');

    values = [ borderRight, borderLeft, marginRight, marginLeft, paddingRight, paddingLeft ];

    spacing = values.reduce((prev, curr) => {
      let val = _pxToValue(curr);
      return val > 0 ? prev + val : prev;
    }, 0);
  }

  return width - spacing;
};

/**
 * Find the unused height inside a DOM element, assuming that the siblings do not take up the full height.
 * This also assumes that sibling provided are elements using normal flow, see
 * https://www.w3.org/TR/CSS21/visuren.html#comp-normal-flow
 *
 * Element @param $parent
 * Array @param siblings
 * Number @returns height
 */
const getAvailableHeight = ($parent, siblings = []) => {
  if (!$parent) {
    return 0;
  }

  const totalHeight = getHeight($parent, { box: 'content' });
  const siblingsHeight = siblings.reduce((prev, $sibling) => {
    return prev + getHeight($sibling, { box: 'border' });
  }, 0);

  return totalHeight - siblingsHeight;
};

/**
 * Find the used width inside a DOM element, assuming that the siblings do not take up the full width.
 * This also assumes that sibling provided are elements using normal flow, see
 * https://www.w3.org/TR/CSS21/visuren.html#comp-normal-flow
 *
 * Element @param $parent
 * Array @param siblings
 * Number @returns width
 */
const getAvailableWidth = ($parent, siblings = []) => {
  if (!$parent) {
    return 0;
  }

  const totalWidth = getWidth($parent, { box: 'content' });
  const siblingsWidth = siblings.reduce((prev, $sibling) => {
    return prev + getWidth($sibling, { box: 'border' });
  }, 0);

  return totalWidth - siblingsWidth;
};

export {
  getSiblings,
  getHeight,
  getAvailableHeight,
  getWidth,
  getAvailableWidth
};
