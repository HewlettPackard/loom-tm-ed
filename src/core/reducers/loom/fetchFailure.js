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

// Reducer
const fetchFailure = (prevState, nextState, action) => {
  // Validation
  if (!action.meta || !action.meta.source) {
    return prevState;
  }

  switch (action.meta.source) {
    case API.LOOM.RESOURCES.PROVIDERS:
      nextState.meta.apiErrorMsg = 'Could not find providers';
      nextState.meta.source = '';
      return nextState;
      break;
    case API.LOOM.RESOURCES.LOGIN:
      switch (action.payload.status) {
        case '401':
          nextState.meta.apiErrorMsg = 'Incorrect email and/or password';
          return nextState;
          break;
        default:
          nextState.meta.apiErrorMsg = 'Server/client error';
          return nextState;
          break;
      }
      break;
    case API.LOOM.RESOURCES.LOGOUT:
      // Revert to initial state
      return _.cloneDeep(defaults.loom);
      break;
    default:
      return prevState;
      break;
  }
};

export default fetchFailure;
