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

// Constants
import { API } from '../../constants';

// Defaults & Handlers
import initialState from '../../defaults/api';
import fetchSuccess from './fetchSuccess';
import fetchFailure from './fetchFailure';

const mergeMetaData = (action) => _.merge({}, action.meta, {
  apiErrorMsg: initialState.meta.apiErrorMsg,
  hasNewData: initialState.meta.hasNewData,
});

const mergeState = (prevState, action) => _.merge({}, prevState, {
  meta: mergeMetaData(action),
});

const loom = (prevState, action) => {
  if (typeof prevState === 'undefined') {
    return initialState;
  }

  const nextState = mergeState(prevState, action);

  switch (action.type) {
    // Handle Requests
    case API.REQUEST:
      return prevState;
      break;
    // Handle Successes
    case API.SUCCESS:
      return fetchSuccess(prevState, nextState, action);
      break;
    // Handle Failures
    case API.FAILURE:
      return fetchFailure(prevState, nextState, action);
      break;
    default:
      // Fallback state
      return prevState;
      break;
  }
};

export default loom;
