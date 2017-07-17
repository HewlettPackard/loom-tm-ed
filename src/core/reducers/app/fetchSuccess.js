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
import { login, logout, notify } from './helpers';

// Reducer
const fetchSuccess = (prevState, nextState, action) => {
  // Validation
  if (!action.meta || !action.meta.source) {
    return prevState;
  }

  switch (action.meta.source) {
    // Successful Login
    case API.LOOM.RESOURCES.LOGIN:
      nextState = login(nextState, action);

      return nextState;
      break;
    // Successful Logout
    case API.LOOM.RESOURCES.LOGOUT:
      nextState = notify(nextState, 'You have successfully signed out', NOTIFICATIONS.SUCCESS);
      nextState = logout(nextState);

      return nextState;
      break;
    // Successful GET Tapestry
    case API.LOOM.RESOURCES.TAPESTRY:
      nextState.nextAction = [ API.LOOM.RESOURCES.THREADS ];
      nextState.loom = {
        hasTapestry: true,
        shouldPollThreads: true,
      };

      return nextState;
      break;
    // Successful GET Tapestry
    case API.LOOM.RESOURCES.THREADS:
      // Clear up handled nextAction
      if (prevState.nextAction[0] === API.LOOM.RESOURCES.THREADS && nextState.nextAction[0] === API.LOOM.RESOURCES.THREADS) {
        nextState.nextAction = [];
        return nextState;
      }

      return prevState;
      break;
    default:
      return prevState;
      break;
  }
};

export default fetchSuccess;
