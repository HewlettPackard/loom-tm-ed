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

// Selectors
import getSelectors from '../../core/selectors';

// Actions
import { toggleDrawer } from '../../core/actions';
import { toggleNode } from '../actions';

// ED Components
import Component from '../components/UniversalMemoryDetails';

const mapStateToProps = (state, _props) => {
  const nodeActive = getSelectors().getNodeByLogicalId(state)(state.universalMemory.nodeActiveLogicalID);
  const nodeActiveSoc = getSelectors().getSocByNode(state)(nodeActive);

  return {
    meta: getSelectors().getMetaData(state),
    drawer: state.drawer || {},
    forceUpdate: state.app.forceUpdate,
    enclosures: getSelectors().getEnclosuresWithNodes(state),
    nodeActive,
    nodeActiveEnclosure: getSelectors().getEnclosureByNode(state)(nodeActive),
    nodeActiveSoc
  };
};

const mapDispatchToProps = (dispatch) => ({
  onToggleDrawer: () => dispatch(toggleDrawer()),
  onToggleNode: (logicalId) => dispatch(toggleNode(logicalId))
});

const UniversalMemoryDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);

export default UniversalMemoryDetails;
