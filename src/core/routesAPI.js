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

// API
import { API } from './constants/index';

const routesAPI = {
  loom: {
    providers: `${API.LOOM.ENDPOINT}/providers`,
    login: ({ provider }) => `${API.LOOM.ENDPOINT}/providers/${provider.providerType}/${provider.providerId}?operation=login`,
    logout: `${API.LOOM.ENDPOINT}/providers?operation=logout`,
    tapestries: `${API.LOOM.ENDPOINT}/tapestries`,
    threadResults: ({ tapestryId, thread }) => `${API.LOOM.ENDPOINT}/tapestries/${tapestryId}/threads/${thread.id}/results`
  }
};

const loom = routesAPI.loom;

export {
  loom
};
