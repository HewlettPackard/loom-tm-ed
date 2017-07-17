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
import { connect } from 'react-redux';
import _ from 'lodash';

// Selectors
import getSelectors from '../../core/selectors';

// Constants
import { ACTIONS } from '../constants';

// Actions
import { toggleNode, toggleUsage } from '../actions';

// ED Components
import Component from '../components/UniversalMemoryFocus';

const mapStateToProps = (state, _props) => {
  const getNodeActive = getSelectors().getNodeByLogicalId(state);
  const getMatrix = getSelectors().getMatrix(state);

  const nodeActive = getNodeActive(state.universalMemory.nodeActiveLogicalID);
  const matrixDefault = getMatrix();

  let matrixMask = _.range(0, 40, 0);
  let matrixActive = [];
  let nodesRelatedByMemory = [];

  if (state.loom.meta.isReady && nodeActive && nodeActive.id) {
    nodesRelatedByMemory = getSelectors().getNodesRelatedByMemory(state)(nodeActive);
    matrixMask[parseInt(nodeActive.id) - 1] = 1;
    matrixActive = getMatrix(matrixMask, nodesRelatedByMemory);
  }

  return {
    demoMode: state.app.demoMode,
    forceUpdate: state.app.forceUpdate,
    meta: getSelectors().getMetaData(state),
    matrices: {
      default: matrixDefault,
      active: matrixActive
    },
    enclosures: getSelectors().getEnclosures(state),
    nodes: getSelectors().getNodes(state),
    nodeActive,
    nodesConnectedToActive: nodesRelatedByMemory,
    isFabricSelected: state.universalMemory.isFabricSelected,
    isCPUSelected: state.universalMemory.isCPUSelected
  }
};

const mapDispatchToProps = (dispatch) => ({
  onToggleNode: (logicalId) => dispatch(toggleNode(logicalId)),

  onToggleUsage: (type) => {
    const typeAction = ACTIONS.CHORD[`TOGGLE_${type.toUpperCase()}`];

    if (type) {
      dispatch(toggleUsage(typeAction));
    } else {
      console.warn(`Could not find action ${`TOGGLE_${type.toUpperCase()}`} in:`, ACTIONS);
    }
  }
});

const UniversalMemoryFocus = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);

export default UniversalMemoryFocus;
