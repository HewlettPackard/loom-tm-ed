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

// Constants
import { ACTIONS } from '../constants';

// State
const initialState = {
  isActive: false,
};

const drawer = (prevState = initialState, action) => {
  switch (action.type) {
    case ACTIONS.DRAWER.TOGGLE:
      return { isActive: !prevState.isActive };
      break;
  }

  return prevState;
};

export default drawer;