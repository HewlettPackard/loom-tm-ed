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

const LOOM = {
  NS: 'api.loom', // Namespace
  PATH: '/loom',
  POLL_INTERVAL: 15000,
  STATUS: {
    PENDING: 'PENDING',
    READY: 'READY'
  },
  THREAD: {
    INSTANCE: 'tm-instance',
    ENCLOSURE: 'tm-enclosure',
    NODE: 'tm-node',
    SOC: 'tm-soc',
    MEMORY: 'tm-memoryboard',
    SHELF: 'tm-shelf',
    SWITCH: 'tm-fabric_switch',
  },
};

export default (() => {
  const port = window.location.port ? `:${window.location.port}` : '';
  LOOM.AUTHORITY = (process.env.NODE_ENV === 'production') ? `//${window.location.hostname}${port}` : 'http://localhost:9099';

    // Allow Endpoint override via LOOM_SERVER variable
  LOOM.ENDPOINT = process.env.LOOM_SERVER || (LOOM.AUTHORITY + LOOM.PATH);

  // Resources
  LOOM.RESOURCES = {
    PROVIDERS: `${LOOM.NS}.getProviders`,
    LOGIN: `${LOOM.NS}.postLogin`,
    LOGOUT: `${LOOM.NS}.postLogout`,
    TAPESTRY: `${LOOM.NS}.postTapestries`,
    THREADS: `${LOOM.NS}.getThreadResults`,
  };

  return LOOM;
})();
