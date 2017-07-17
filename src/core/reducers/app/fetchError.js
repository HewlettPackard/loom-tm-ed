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
import { logout, notify, resetLoomState } from './helpers';

// Reducer
const fetchError = (prevState, nextState, action) => {
  if (action.payload.name === 'RequestError') {
    console.warn('Fetch Request error', action);

    switch (action.meta.source) {
      case API.LOOM.RESOURCES.PROVIDERS:
        nextState = notify(nextState, 'There was a problem whilst obtaining providers', NOTIFICATIONS.WARNING);
        break;
      case API.LOOM.RESOURCES.LOGIN:
        nextState = notify(nextState, 'There was a problem whilst signing in', NOTIFICATIONS.WARNING);
        break;
      case API.LOOM.RESOURCES.LOGOUT:
        nextState = notify(nextState, 'There was a problem whilst signing out', NOTIFICATIONS.WARNING);
        nextState = logout(nextState);
        break;
      case API.LOOM.RESOURCES.TAPESTRY:
      case API.LOOM.RESOURCES.THREADS:
        nextState = notify(nextState, 'There was a problem whilst obtaining data, please sign out', NOTIFICATIONS.WARNING);
        nextState = resetLoomState(nextState);
        break;
    }

    return nextState;
  }

  // Fallback state
  return prevState;
};

export default fetchError;
