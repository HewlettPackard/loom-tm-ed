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
import _ from 'lodash';

// API
import { APP, API } from '../../constants';
import defaultAPI from '../../defaults/api';
import { loom } from '../../routesAPI';

// Helpers
import utils from '../../helpers/utils';

const hasDiscrepancyCount = (entity) => !!(entity['core.dmaDiscrepancyCount'] || 0);

// @hack: This is used to calculate the discrepancies for soc, memoryboard & fabric_switch where the child components
// report discrepancies but these are not displayed in the UI, therefore the total number of discrepancies should be
// used to assert if these components are discrepant.
const hasComponentDiscrepancyCount = (entity) => !!(entity['core.dmaTotalDiscrepancyCount'] || 0);

const source = API.LOOM.RESOURCES.THREADS;

const getThreadResults = ({ tapestryId, thread }) => ({
  [CALL_API]: {
    endpoint: loom.threadResults({ tapestryId, thread }),
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    types: [
      {
        type: API.REQUEST,
        meta: { source }
      },
      {
        type: API.SUCCESS,
        payload: (_action, _state, res) => getJSON(res).then(json => {
          const isReady = json.status === API.LOOM.STATUS.READY;
          const hasElements = !!json.elements.length;

          let thread = {
            id: json.itemType.id,
            logicalId: json.logicalId,
            name: json.name,
            status: json.status
          };

          // @fixme: hasElements check causes thread to be missing essential props if API returns empty elements array
          if (!isReady/* || !hasElements*/) {
            return thread;
          }

          switch (thread.id) {
            case API.LOOM.THREAD.INSTANCE:
              const entity = hasElements ? json.elements[0].entity || {} : {};

              thread.fqdn = entity['core.fqdn'] || defaultAPI.threadResults.fqdn;

              thread.usage = _.merge({}, defaultAPI.threadResults.usage, {
                cpu: entity.cpuUtilisation,
                fam: entity['core.famUtilisation'],
                fabric: entity.fabricUtilisation,
              });

              thread.librarian =  _.merge({}, defaultAPI.threadResults.librarian, {
                books: entity['core.libBooks'],
                shelves: entity['core.libShelves'],
                maxBooks: entity['core.libMaxBooks'],
                memory: {
                  allocated: entity['core.memoryAllocated'],
                  available: entity['core.memoryAvailable'],
                  notReady: entity['core.memoryNotReady'],
                  offline: entity['core.memoryOffline'],
                  total: entity['core.memoryTotal'],
                }
              });

              thread.updated = entity['l.updated'] || defaultAPI.threadResults.updated;
              thread.discrepancyCount = entity['core.dmaTotalDiscrepancyCount'] || defaultAPI.threadResults.discrepancyCount;

              break;
            case API.LOOM.THREAD.ENCLOSURE:
              const pattern = /^EncNum\/([0-9]+)/;

              thread.enclosures = _.map(json.elements, (element, _i) => {
                const entity = element.entity || {};
                const matches = entity.name.match(pattern);

                return {
                  logicalId: entity['l.logicalId'],
                  name: entity.name || APP.UNKNOWN,
                  title: (matches.length >= 2) ? `Enclosure ${matches[1]}` : entity.name,
                  relations: element['l.relations'] || [],
                  alertLevel: utils.transformAlertLevel(entity['l.alertLevel']),
                  hasDiscrepancies: hasDiscrepancyCount(entity)
                };
              });
              break;
            case API.LOOM.THREAD.NODE:
              thread.nodes = _.map(json.elements, (element, i) => {
                const entity = element.entity || {};
                const id = utils.formatNumber(i+1, 2); // @todo: numbered ids based on index is fine for now
                const name = entity.name || '';
                const logicalId = element.entity['l.logicalId'];
                const alertLevel = utils.transformAlertLevel(entity['l.alertLevel']);
                const hasDiscrepancies = hasDiscrepancyCount(entity);
                const relations = element['l.relations'] || [];
                const usage = utils.formatFloats({
                  cpu: entity.cpuUtilisation || 0,
                  fabric: entity.bridgeFabricUtilisation || 0,
                }, 2);

                return { id, name, usage, relations, logicalId, alertLevel, hasDiscrepancies };
              });
              break;
            case API.LOOM.THREAD.SHELF:
              thread.shelves = _.map(json.elements, (element) => {
                const entity = element.entity || {};
                const relations = element['l.relations'] || [];
                return { entity, relations };
              });
              break;
            case API.LOOM.THREAD.SOC:
              thread.socs = _.map(json.elements, (element) => {
                const entity = element.entity || {};

                return {
                  logicalId: element.entity['l.logicalId'],
                  alertLevel: utils.transformAlertLevel(entity['l.alertLevel']),
                  hasDiscrepancies: hasComponentDiscrepancyCount(entity),
                  powerState: entity['core.powerState'] || APP.UNKNOWN,
                  runningOsManifest: entity['core.runningOsManifest'] || APP.UNKNOWN,
                  dramUtilisation: entity['core.dramUtilisation'] || 0,
                  networkIn: entity['core.netInBytesSec'] || 0,
                  networkOut: entity['core.netOutBytesSec'] || 0,
                  shelvesAccessing: entity.shelvesAccessing || 0,
                  booksAccessing: entity.booksAccessing || 0,
                  relations: element['l.relations'] || []
                }
              });
              break;
            case API.LOOM.THREAD.MEMORY:
              thread.memoryboards = _.map(json.elements, (element) => {
                const entity = element.entity || {};

                return {
                  logicalId: element.entity['l.logicalId'],
                  alertLevel: utils.transformAlertLevel(entity['l.alertLevel']),
                  hasDiscrepancies: hasComponentDiscrepancyCount(entity),
                }
              });
              break;
            case API.LOOM.THREAD.SWITCH:
              thread.switches = _.map(json.elements, (element) => {
                const entity = element.entity || {};

                return {
                  logicalId: element.entity['l.logicalId'],
                  alertLevel: utils.transformAlertLevel(entity['l.alertLevel']),
                  hasDiscrepancies: hasComponentDiscrepancyCount(entity),
                  position: entity['core.position'] || APP.UNKNOWN
                }
              });
              break;
          }

          //console.debug('getThreadResults', thread);

          return thread;
        }),
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

export { getThreadResults };
