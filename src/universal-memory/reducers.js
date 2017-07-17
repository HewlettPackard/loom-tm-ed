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
import { API } from '../core/constants/';
import { ACTIONS } from './constants';

// State
const initialState = {
  nodeActiveLogicalID: null,
  nodes: [],
  isFabricSelected: false,
  isCPUSelected: false,
};

const universalMemory = (prevState, action) => {
  if (typeof prevState === 'undefined') {
    return initialState;
  }

  let nextState = {};

  switch (action.type) {
    case ACTIONS.CHORD.TOGGLE_NODE:
      nextState.nodeActiveLogicalID = action.payload;

      // Deselect nodeActive
      if (nextState.nodeActiveLogicalID === prevState.nodeActiveLogicalID) {
        nextState.nodeActiveLogicalID = null;
      }

      return _.merge({}, prevState, nextState);
      break;
    case ACTIONS.CHORD.TOGGLE_FABRIC:
      nextState.isFabricSelected = !prevState.isFabricSelected;

      return _.merge({}, prevState, nextState);
      break;
    case ACTIONS.CHORD.TOGGLE_CPU:
      nextState.isCPUSelected = !prevState.isCPUSelected;

      return _.merge({}, prevState, nextState);
      break;
    case API.SUCCESS:
    case API.FAILURE:
      if (action.meta.source === API.LOOM.RESOURCES.LOGOUT) {
        // Revert to initial state
        return initialState;
      }

      return prevState;
      break;
    default:
      return prevState;
    break;
  }
};

export default universalMemory;
