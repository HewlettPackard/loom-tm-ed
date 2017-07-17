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

// ED Components
import Component from '../components/MemoryMgmtFocus';

const mapStateToProps = (state, _props) => ({
  meta: getSelectors().getMetaData(state),
  librarian: getSelectors().getInstance(state).librarian,
});

const MemoryMgmtFocus = connect(
  mapStateToProps
)(Component);

export default MemoryMgmtFocus;
