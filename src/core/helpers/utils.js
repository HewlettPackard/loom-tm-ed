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

import _ from 'lodash';

/**
 * Format a flat object of floats for display:
 *
 * formatFloats({ foo: 3.14 }) => { foo: 3.1 }
 * formatFloats({ bar: 10 }) => { bar: 10 } // This is because parseFloat is used and we can't format to strings :(
 * formatFloats({ foo: 3.1415, bar: 10 }, 2) => { foo: 3.14, bar: 10 }
 * formatFloats({ foo: NaN }) => { foo: 0 }
 * formatFloats({ foo: NaN, bar: 3.1415 }, 3) => { foo: 0, bar: 3.141 }
 *
 * @param floats
 * @param precision
 * @returns {{ key: number }}
 */
const formatFloats = (floats, precision = 1) => {
  const formattedFloats = {};
  _.each(floats, (item, key) => {
    formattedFloats[key] =  _.isFinite(item) ? parseFloat(item.toFixed(precision)) : 0;
  });

  return formattedFloats;
};

/**
 * Format numbers as follows (with or without padding):
 *
 * (1000) => 1,000
 * (1, 2) => 01
 * (1, 4) => 0001
 * (0, 2) => 0
 *
 * @param n
 * @param padMin
 * @returns {string}
 */
const formatNumber = (n, padMin = 0, leadingZero = false) => {
  let number = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (padMin && number.length < padMin) {
    number = (number > 0 || leadingZero) ? _.padStart(n, padMin, 0) : 0;
  }

  return number;
};

/**
 * Provides bytes in multiple formats: bytes, kilobytes, megabytes, gigabytes, terabytes, petabytes, exabytes
 *
 * Each unit after byte is calculated in either decimal or binary:
 * Decimal: 10² = 1000
 * Binary: 2¹⁰ = 1024
 */
const getByteMultiples = (decimal = false) => {
  if (decimal) {
    return {
      b: 1,
      kb: 1e3,
      mb: 1e6,
      gb: 1e9,
      tb: 1e12,
      pb: 1e15,
      eb: 1e18,
    }
  }

  const kb = Math.pow(2, 10);

  return {
    b: 1,
    kb,
    mb: Math.pow(kb, 2),
    gb: Math.pow(kb, 3),
    tb: Math.pow(kb, 4),
    pb: Math.pow(kb, 5),
    eb: Math.pow(kb, 6),
  }
};

// Provides a map of values per multiplier. Assumes binary calculation.
const bytesToValues = (bytes, { baseUnit = 'b', decimal = false, precision = 2 }) => {
  if (baseUnit !== 'b') {
    bytes = valueToBytes(bytes, baseUnit, decimal);
  }

  const byteMultiples = getByteMultiples(decimal);

  return formatFloats({
    b: bytes,
    kb: bytes / byteMultiples.kb,
    mb: bytes / byteMultiples.mb,
    gb: bytes / byteMultiples.gb,
    tb: bytes / byteMultiples.tb,
    pb: bytes / byteMultiples.pb,
    eb: bytes / byteMultiples.eb,
  }, precision);
};

// Convert a value down to bytes
const valueToBytes = (value, baseUnit = 'b', decimal = false) => value * (getByteMultiples(decimal)[baseUnit] || 1);

/**
 * Attempts to provide an object containing the most value to display for a given number of bytes.
 *
 * (1000) => { value: 1, label: 'kb', ... }
 * (1000, 10, 10000) => { value: 1000, label: 'b', ... }
 * (2000, 1, 1000, 'mb') => { value: 2, label: 'gb', ... }
 *
 * @param value
 * @param lower
 * @param upper
 * @param baseUnit
 * BaseUnit provides instruction on what measurement value is. i.e if value = 2 and baseUnit = 'kb' then the
 * calculations are made on the basis that value = 2000 bytes
 *
 * @returns {{key: (*|string), label: string, value, allValues}}
 */
const bestBytes = (value, lower = 1, upper = 1000, byteOptions) => {
  const values = bytesToValues(value, byteOptions);

  const key = _.findKey(values, (value) => value >= lower && value < upper) || 'b';

  return {
    key: key,
    label: (key).toString().toUpperCase(),
    value: values[key],
    allValues: values,
  };
};

/**
 * Convert enums:
 * 0 = 'ok'
 * 1-5 = 'warning'
 * 6+ = 'error'
**/
const transformAlertLevel = (level) => {
  if (_.isFinite(level) && level > 0) {
    return (level <= 5) ? 'warning' : 'error';
  }

  return 'ok';
};

const diff = (obj1 = {}, obj2 = {}) => _.reduce(obj1, (curr, value, key) => {
  if (_.isPlainObject(value)) {
    const deepDiff = diff(obj1[key], obj2[key]);

    if(_.isPlainObject(deepDiff) && _.isEmpty(deepDiff)) {
      return curr;
    }
    curr[key] = deepDiff;
  } else if (!_.isEqual(value, obj2[key])) {
    curr[key] = [value, obj2[key]];
  }

  return curr;
}, {});

export default {
  formatFloats,
  formatNumber,
  bytesToValues,
  bestBytes,
  transformAlertLevel,
  diff,
};
