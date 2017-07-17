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
import { createSelector } from 'reselect';
import _ from 'lodash';

// Defaults
import defaultsAPI from '../defaults/api';

// Constants
import { API } from '../constants';

const getThreadResults = (state) => state.loom && state.loom.threadResults ? state.loom.threadResults : { loom: {} };

const mergeMetaData = (state) => _.merge({}, defaultsAPI.meta, state.loom.meta);

/**
 * Predicate Matchers
 * @param logicalId
 * @returns truthy
 */
const isEnclosureId = (logicalId) => /^[^\/]+\/[^\/]+\/(enclosures)/.test(logicalId);
const isShelfId = (logicalId) => /^[^\/]+\/[^\/]+\/(shelfs)/.test(logicalId);
const isNodeId = (logicalId) => /^[^\/]+\/[^\/]+\/(nodes)/.test(logicalId);
const isSocId = (logicalId) => /^[^\/]+\/[^\/]+\/(socs)/.test(logicalId);
const isMemoryBoardId = (logicalId) => /^[^\/]+\/[^\/]+\/(memoryboards)/.test(logicalId);
const isSwitchId = (logicalId) => /^[^\/]+\/[^\/]+\/(fabric_switchs)/.test(logicalId);

/**
 * Filter an array of Ids for matches
 * @param ids
 */
const getShelfIds = (ids) => _.filter(ids, isShelfId);
const getEnclosureIds = (ids) => _.filter(ids, isEnclosureId);
const getSocIds = (ids) => _.filter(ids, isSocId);

/**
 * Find the first entity from an array of entities, matched by LogicalId
 * @param logicalId
 * @param entity
 */
const findEntityByLogicalId = (logicalId, entities) => _.find(entities, { logicalId: logicalId });

/**
 * Find only related Memoryboards from an Entity
 *
 * @param relations
 * @returns Array
 */
const filterRelationsForMemoryboards = ({ relations }) => _.filter(relations, (relationId) => isMemoryBoardId(relationId));

/**
 * Find only related Nodes from an Entity
 *
 * @param relations
 * @returns Array
 */
const filterRelationsForNodes = ({ relations }) => _.filter(relations, (relationId) => isNodeId(relationId));

/**
 * Find only related Socs from an Entity
 *
 * @param relations
 * @returns Array
 */
const filterRelationsForSocs = ({ relations }) => _.filter(relations, (relationId) => isSocId(relationId));

/**
 * Find only related Socs from an Entity
 *
 * @param relations
 * @returns Array
 */
const filterRelationsForSwitches = ({ relations }) => _.filter(relations, (relationId) => isSwitchId(relationId));

/**
 * Find related Nodes from an Entity via SoCs, Shelves & MemoryBoards
 *
 * @param relations
 * @param nodes
 * @param socs
 * @param shelves
 * @returns Array
 *
 * @expensive
 */
const findNodesRelatedByMemory = ({ logicalId }, nodes, socs, shelves) => {
  // Find relationships
  const soc = _.filter(socs, soc => convertSocToNodeLogicalId(soc.logicalId) === logicalId)[0];
  const relatedShelves = soc ? _.compact(findRelatedShelves(soc, shelves)) : [];

  if (!relatedShelves.length) {
    return [];
  }

  const nodesRelatedByMemoryBoard = _.uniq(_.reduce(relatedShelves, (result, shelf) => {
    const memoryBoards = filterRelationsForMemoryboards(shelf);
    _.each(memoryBoards, (relatedMemoryBoardLogicalId) => {
      const relatedNodeLogicalId = convertMemoryBoardToNodeLogicalId(relatedMemoryBoardLogicalId);
      const relatedNode = findEntityByLogicalId(relatedNodeLogicalId, nodes);
      result.push(relatedNode);
    });
    return result;
  }, []));

  return _.filter(nodesRelatedByMemoryBoard, (node) => node && node.logicalId !== logicalId);
};

/**
 * Find Shelves from related LogicalIds on an entity.
 *
 * e.g. entity.relations = ['.../Shelf/1', '.../OtherEntity/1', '.../Shelf/2']
 *
 * => [{Shelf#1}, {Shelf#2}]
 * @param relations
 * @returns Array
 */
const findRelatedShelves = ({ relations }, shelves) => _.map(getShelfIds(relations), (targetShelfId) => _.find(shelves, (shelf) => shelf.entity['l.logicalId'] === targetShelfId));

/**
 * Find Enclosures from related LogicalIds on an entity.
 *
 * e.g. entity.relations = ['.../EncNum/1', '.../OtherEntity/1', '.../EncNum/2']
 *
 * => [{Enclosure#1}, {Enclosure#2}]
 *
 * @param relations
 * @returns Array
 */
const findRelatedEnclosures = ({ relations }, enclosures) => _.map(getEnclosureIds(relations), (targetEnclosureId) => _.find(enclosures, (enclosure) => enclosure.logicalId === targetEnclosureId));

/**
 * Find Socs from related LogicalIds on an entity.
 *
 * e.g. entity.relations = ['.../EncNum/1', '.../OtherEntity/1', '.../EncNum/2']
 *
 * => [{Enclosure#1}, {Enclosure#2}]
 *
 * @param relations
 * @returns Array
 */
const findRelatedSocs = ({ relations }, socs) => _.map(getSocIds(relations), (targetSocId) => _.find(socs, (soc) => soc.logicalId === targetSocId));

/**
 * Converts a Memoryboard Logical ID into a Node Logical ID
 *
 * e.g.
 * tm/tm/memoryboards//MachineVersion/1/Datacenter/BUK1/Rack/A1.AboveFloor/Enclosure/U13/EncNum/3/Node/5/MemoryBoard/1
 *
 * Would be converted to:
 * tm/tm/nodes//MachineVersion/1/Datacenter/BUK1/Rack/A1.AboveFloor/Enclosure/U13/EncNum/3/Node/5
 */
const convertMemoryBoardToNodeLogicalId = (logicalId) => logicalId.replace(/\/memoryboards\/\//, '/nodes//').replace(/(\/MemoryBoard\/[0-9]+)$/, '');

/**
 * Converts a Soc Logical ID into a Node Logical ID
 *
 * e.g.
 * tm/tm/socs//MachineVersion/1/Datacenter/BUK1/Rack/A1.AboveFloor/Enclosure/U13/EncNum/3/Node/5/SocBoard/1
 *
 * Would be converted to:
 * tm/tm/nodes//MachineVersion/1/Datacenter/BUK1/Rack/A1.AboveFloor/Enclosure/U13/EncNum/3/Node/5
 */
const convertSocToNodeLogicalId = (logicalId) => logicalId.replace(/\/socs\/\//, '/nodes//').replace(/(\/SocBoard\/[0-9]+)$/, '');

/**
 * Memoized Selectors
 */

// Meta
const getMetaData = createSelector([ mergeMetaData ], (meta) => meta);

// Instance
const getInstance = createSelector(
  [ getThreadResults ],
  (threads) => {
    const threadInstance = threads[API.LOOM.THREAD.INSTANCE];
    const instance = {
      fqdn: defaultsAPI.threadResults.fqdn,
      usage: defaultsAPI.threadResults.usage,
      librarian: defaultsAPI.threadResults.librarian,
      discrepancyCount: defaultsAPI.threadResults.discrepancyCount,
      updated: defaultsAPI.threadResults.updated,
    };

    return _.merge({}, instance, threadInstance);
  }
);

// Enclosures
const getEnclosures = createSelector(
  [ getThreadResults ],
  (threads) => !!threads[API.LOOM.THREAD.ENCLOSURE] ? threads[API.LOOM.THREAD.ENCLOSURE].enclosures : []
);

// Shelves
const getShelves = createSelector(
  [ getThreadResults ],
  (threads) => !!threads[API.LOOM.THREAD.SHELF] ? threads[API.LOOM.THREAD.SHELF].shelves : []
);

// Nodes
const getNodes = createSelector(
  [ getThreadResults ],
  (threads) => !!threads[API.LOOM.THREAD.NODE] ? threads[API.LOOM.THREAD.NODE].nodes : []
);

// Node By ID
const getNodeByLogicalId = createSelector(
  [ getNodes ],
  (nodes) => (logicalId) => nodes ? findEntityByLogicalId(logicalId, nodes) : null
);

// Socs
const getSocs = createSelector(
  [ getThreadResults ],
  (threads) => !!threads[API.LOOM.THREAD.SOC] ? threads[API.LOOM.THREAD.SOC].socs : []
);

const getSocByNode = createSelector(
  [ getSocs ],
  (socs) => (node) => {
    if (socs && node) {
      const relatedSocs = findRelatedSocs(node, socs);

      if (relatedSocs.length !== 1) {
        return null;
      }

      return relatedSocs[0];
    }

    return null;
  }
);

// Memoryboards
const getMemoryboards = createSelector(
  [ getThreadResults ],
  (threads) => !!threads[API.LOOM.THREAD.MEMORY] ? threads[API.LOOM.THREAD.MEMORY].memoryboards : []
);

// Switches
const getSwitches = createSelector(
  [ getThreadResults ],
  (threads) => !!threads[API.LOOM.THREAD.SWITCH] ? threads[API.LOOM.THREAD.SWITCH].switches : []
);

// Nodes By ID
const getEnclosureByNode = createSelector(
  [ getEnclosures ],
  (enclosures) => (node) => {
    if (enclosures && node) {
      const relatedEnclosures = findRelatedEnclosures(node, enclosures);

      if (relatedEnclosures.length !== 1) {
        return null;
      }

      return relatedEnclosures[0];
    }

    return null;
  }
);

/**
 * Composed Memoized Selectors
 */
// Nodes by Memory Relationships
const getNodesRelatedByMemory = createSelector(
  [ getNodes, getSocs, getShelves ],
  (nodes, socs, shelves) => (entity) => findNodesRelatedByMemory(entity, nodes, socs, shelves)
);

// Enclosures with Nodes
const getNodesAndComponents = createSelector(
  [ getNodes, getSocs, getMemoryboards ],
  (nodes, socs, memoryboards) => {
    return _.map(nodes, (node) => {
      const relatedSocsLogicalIds = filterRelationsForSocs(node);
      const relatedMemoryboardsLogicalIds = filterRelationsForMemoryboards(node);
      node.socs = _.map(relatedSocsLogicalIds, (relatedSocLogicalId) => findEntityByLogicalId(relatedSocLogicalId, socs));
      node.memoryboards = _.map(relatedMemoryboardsLogicalIds, (relatedMemoryboardLogicalId) => findEntityByLogicalId(relatedMemoryboardLogicalId, memoryboards));
      return node;
    });
  }
);

const _getEnclosuresWithNodes = (enclosures, nodes) => {
  if (enclosures && enclosures.length > 0 && nodes && nodes.length > 0) {
    return _.map(enclosures, (enclosure) => {
      const relatedNodesLogicalIds = filterRelationsForNodes(enclosure);
      enclosure.nodes = _.map(relatedNodesLogicalIds, (relatedNodeLogicalId) => findEntityByLogicalId(relatedNodeLogicalId, nodes));
      enclosure.nodes = _.sortBy(_.uniq(_.compact(enclosure.nodes)), (item) => item && parseInt(item.id));
      return enclosure;
    });
  }
  return [];
};

// Enclosures with Nodes
const getEnclosuresWithNodesAndComponents = createSelector(
  [ getEnclosures, getNodesAndComponents, getSwitches ],
  (enclosures, nodes, switches) => _.map(_getEnclosuresWithNodes(enclosures, nodes), (enclosure) => {
    const relatedSwitchIds = filterRelationsForSwitches(enclosure);
    const relatedSwitches = _.map(relatedSwitchIds, (relatedSwitchId) => findEntityByLogicalId(relatedSwitchId, switches));
    // @hack: Due to missing data in Loom API, duplicate the switch pair and order correctly.
    const relatedSwitchesClone = _.cloneDeep(relatedSwitches);
    enclosure.switches = _.sortBy(_.compact([...relatedSwitches, ...relatedSwitchesClone]), 'position').reverse();

    return enclosure;
  })
);

// Enclosures with Nodes
const getEnclosuresWithNodes = createSelector(
  [ getEnclosures, getNodes ],
  _getEnclosuresWithNodes
);

// Loom Matrix
const getMatrix = createSelector(
  [ getNodes, getSocs, getShelves ],
  (nodes, socs, shelves) => (rowMask = [], nodesRelatedByMemory = []) => _.map(nodes, (node, i) => {
    const empty = _.range(0, nodes.length, 0);
    let nodesRelatedToSelfByMemory = nodesRelatedByMemory.slice();

    /**
     * Simplify matrix data using rowMask. Useful for matrix overlay of active items
     * e.g. [1, 0, 0, 1] would output a matrix with entries at indexes 0 & 3
     * Output: [ [rowData], [], [], [rowData] ]
     */
    if (rowMask.length > 0 && !rowMask[i]) {
      return empty;
    }

    if (!nodesRelatedToSelfByMemory.length) {
      nodesRelatedToSelfByMemory = findNodesRelatedByMemory(node, nodes, socs, shelves);
    }

    // Generate the row items
    return _.map(nodes, (item) => {
      const relatedNodes = _.filter(nodesRelatedToSelfByMemory, (relatedNode) => relatedNode && relatedNode.logicalId === item.logicalId);
      return relatedNodes.length > 0 ? 1 : 0;
    });
  })
);

const getSelectors = () => ({
  getMetaData,
  getInstance,
  getEnclosures,
  getEnclosureByNode,
  getNodes,
  getNodeByLogicalId,
  getShelves,
  getSocs,
  getSocByNode,
  getMemoryboards,
  getNodesAndComponents,
  getNodesRelatedByMemory,
  getEnclosuresWithNodes,
  getEnclosuresWithNodesAndComponents,
  getMatrix,
});

export default getSelectors;
