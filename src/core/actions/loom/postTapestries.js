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

// Deps
import { getJSON, CALL_API } from 'redux-api-middleware';

// API
import { API } from '../../constants';
import { loom } from '../../routesAPI';

const source = API.LOOM.RESOURCES.TAPESTRY;

const postTapestries = (data) => ({
  [CALL_API]: {
    endpoint: loom.tapestries,
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    body: JSON.stringify(data),
    types: [
      {
        type: API.REQUEST,
        meta: { source }
      },
      {
        type: API.SUCCESS,
        payload: (_action, _state, res) => getJSON(res).then(json => json),
        meta: { source }
      },
      {
        type: API.FAILURE,
        payload: (_action, _state, res) => getJSON(res).then(json => json),
        meta: { source }
      }
    ]
  }
});

export { postTapestries };
