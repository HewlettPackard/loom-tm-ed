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

// Defaults & Handlers
import { API, NOTIFICATIONS } from '../../constants';
import { logout, notify } from './helpers';

// Reducer
const fetchFailure = (prevState, nextState, action) => {
  // Validation
  if (!action.meta || !action.meta.source) {
    return prevState;
  }

  switch (action.meta.source) {
    case API.LOOM.RESOURCES.LOGOUT:
      nextState = notify(nextState, 'There was a problem whilst signing out', NOTIFICATIONS.WARNING);
      nextState = logout(nextState);
      return nextState;
      break;
    case API.LOOM.RESOURCES.TAPESTRY:
    case API.LOOM.RESOURCES.THREADS:
      if (action.payload.status === '401') {
        nextState = notify(nextState, 'Your session has expired, please sign in again', NOTIFICATIONS.WARNING);
        nextState = logout(nextState);
        return nextState;
      }

      nextState = notify(nextState, 'There was a problem whilst obtaining data, please sign out', NOTIFICATIONS.WARNING);
      return nextState;
      break;
    default:
      // Fallback state
      return prevState;
      break;
  }
};

export default fetchFailure;
