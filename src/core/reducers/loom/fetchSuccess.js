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

// App Deps
import _ from 'lodash';

// Defaults & Handlers
import { API } from '../../constants';
import defaults from '../../defaults/';

// Temporary State
let results = [];
let discrepancies = [];

// Reducer
const fetchSuccess = (prevState, nextState, action) => {
  // Validation
  if (!action.meta || !action.meta.source) {
    return prevState;
  }

  switch (action.meta.source) {
    // Successful GET Providers
    case API.LOOM.RESOURCES.PROVIDERS:
      nextState.providers = action.payload.providers || prevState.providers;
      return _.merge({}, prevState, nextState);
      break;
    // Successful POST Login
    case API.LOOM.RESOURCES.LOGIN:
      // Nothing to do.
      return prevState;
      break;
    // Successful POST Logout
    case API.LOOM.RESOURCES.LOGOUT:
      // Revert to initial state
      return _.cloneDeep(defaults.loom);
      break;
    // Successful POST Tapestry
    case API.LOOM.RESOURCES.TAPESTRY:
      nextState.tapestry = action.payload;
      return _.merge({}, prevState, nextState);
      break;
    // Successful GET Threads
    case API.LOOM.RESOURCES.THREADS:
      nextState.meta.isReady = action.payload.status === API.LOOM.STATUS.READY;
      nextState.meta.hasNewData = false;

      // No data can be processed yet.
      if (!nextState.meta.isReady) {
        return prevState;
      }

      // Update results collection.
      results.push(action.payload);

      // Update discrepancies collection.
      if (action.payload.id === API.LOOM.THREAD.INSTANCE) {
        discrepancies.push({ updated: action.payload.updated, value: action.payload.discrepancyCount });
      }

      /**
       * Wait until all results are returned before updating nextState.threadResults
       */
      if (prevState.tapestry.threads.length === results.length) {
        nextState.threadResults = prevState.threadResults;

        nextState.meta.hasNewData = true;
        // @todo: it would be possible to trim the length of the discrepancies array here if above a certain limit
        nextState.threadResults.discrepancies = discrepancies;

        // Update threadResults
        _.each(results, (result) => {
          nextState.threadResults[result.id] = result;
        });

        // Reset results collection.
        results = [];

        return _.merge({}, prevState, nextState);
      }

      // Batched data not ready yet.
      return prevState;
      break;
    default:
      return prevState;
      break;
  }
};

export default fetchSuccess;
