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
import { ACTIONS, API } from '../../constants';
import defaultsApp from '../../defaults/app';
import fetchSuccess from './fetchSuccess';
import fetchFailure from './fetchFailure';
import fetchError from './fetchError';

// State
const initialState = defaultsApp;

const mergeState = (prevState) => _.merge({}, prevState, {
  // Clean any non-persistent state values
  navigate: initialState.navigate,
  nextAction: (prevState.nextAction.length > 1) ? prevState.nextAction.slice(1) : initialState.nextAction,
  notifications: _.cloneDeep(_.filter(prevState.notifications, (notice) => !!notice.repeat)),
});

// Reducer
const app = (prevState, action) => {
  if (typeof prevState === 'undefined') {
    return initialState;
  }

  const nextState = mergeState(prevState);

  switch (action.type) {
    case ACTIONS.APP.CLOSE_NOTIFICATION:
      if (action.payload && action.payload) {
        nextState.notifications = _.filter(prevState.notifications, (notice) => notice.id !== action.payload);
        return nextState;
      }

      return prevState;
      break;
    case ACTIONS.APP.NAVIGATE:
      // Clear down prevState.navigate
      nextState.navigate = initialState.navigate;

      return nextState;
      break;
    case ACTIONS.APP.RECORD:
      if (!!action.payload && action.payload.time) {
        nextState.lastInteraction = action.payload.time;
        nextState.demoMode = false;
      }

      return nextState;
      break;
    case ACTIONS.APP.START_DEMO:
      nextState.demoMode = true;

      return nextState;
      break;
    case API.REQUEST:
      // Handle Request Errors
      if (action.error) {
        return fetchError(prevState, nextState, action);
      }

      return prevState;
      break;
    case API.SUCCESS:
      // Handle Successes
      return fetchSuccess(prevState, nextState, action);
      break;
    case API.FAILURE:
      // Handle Successes
      return fetchFailure(prevState, nextState, action);
      break;
    default:
      // Fallback state
      return prevState;
      break;
  }
};

export default app;
