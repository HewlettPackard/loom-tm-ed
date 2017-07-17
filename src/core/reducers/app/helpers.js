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

//Deps
import _ from 'lodash';
import uuid from 'uuid/v1';

// Routes
import router from '../../router';
import { paths } from '../../routes';

// Defaults & Handlers
import { API, NOTIFICATIONS } from '../../constants';
import defaultsApp from '../../defaults/app';

// Helper functions

const notify = (nextState, message = '', type = NOTIFICATIONS.SUCCESS, repeat = false) => {
  return _.merge({}, nextState, { notifications: [{ id: uuid(), type, message, repeat }] });
};

const login = (nextState, action) => {
  return _.merge({}, nextState, {
    isAuthenticated: true,
    nextAction: [ API.LOOM.RESOURCES.TAPESTRY ],
    navigate: {
      path: router.getDefaultRoute(true).path,
      query: null,
      state: {
        meta: action.meta,
        payload: action.payload,
      }
    },
  });
};

const logout = (nextState) => {
  return _.merge({}, nextState, {
    isAuthenticated: false,
    loom: defaultsApp.loom,
    navigate: {
      path: paths.signin.path,
      query: null,
      state: {},
    }
  });
};

const resetLoomState = (nextState) => _.merge({}, nextState, { loom: defaultsApp.loom });

export {
  login,
  logout,
  notify,
  resetLoomState,
};
