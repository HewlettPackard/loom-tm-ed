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
import * as compact from 'lodash/compact';
import * as clamp from 'lodash/clamp';
import * as cloneDeep from 'lodash/cloneDeep';
import * as debounce from 'lodash/debounce';
import * as each from 'lodash/each';
import * as filter from 'lodash/filter';
import * as find from 'lodash/find';
import * as findIndex from 'lodash/findIndex';
import * as findKey from 'lodash/findKey';
import * as isArray from 'lodash/isArray';
import * as isEmpty from 'lodash/isEmpty';
import * as isEqual from 'lodash/isEqual';
import * as isFunction from 'lodash/isFunction';
import * as isPlainObject from 'lodash/isPlainObject';
import * as map from 'lodash/map';
import * as max from 'lodash/max';
import * as merge from 'lodash/merge';
import * as isFinite from 'lodash/isFinite';
import * as padStart from 'lodash/padStart';
import * as random from 'lodash/random';
import * as range from 'lodash/range';
import * as reduce from 'lodash/reduce';
import * as remove from 'lodash/remove';
import * as sortBy from 'lodash/sortBy';
import * as uniq from 'lodash/uniq';

const _ = {
  compact: compact.default,
  clamp: clamp.default,
  cloneDeep: cloneDeep.default,
  debounce: debounce.default,
  each: each.default,
  filter: filter.default,
  find: find.default,
  findIndex: findIndex.default,
  findKey: findKey.default,
  isArray: isArray.default,
  isEmpty: isEmpty.default,
  isEqual: isEqual.default,
  isFunction: isFunction.default,
  isPlainObject: isPlainObject.default,
  map: map.default,
  max: max.default,
  merge: merge.default,
  isFinite: isFinite.default,
  padStart: padStart.default,
  range: range.default,
  random: random.default,
  reduce: reduce.default,
  remove: remove.default,
  sortBy: sortBy.default,
  uniq: uniq.default
};

export default _;
