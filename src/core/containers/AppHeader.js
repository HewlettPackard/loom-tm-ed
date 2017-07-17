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
import { loom } from '../actions';

// Selectors
import getSelectors from '../selectors';

// ED Components
import DashboardHeader from '../components/DashboardHeader';

const mapStateToProps = (state, _props) => ({
  // @fixme: Multiple issues: have API return a name prop, don't use string matching, don't hardcode values like this.
  instanceName: getSelectors().getInstance(state).fqdn.replace('.labs.hpecorp.net', ''),
  message: state.loom.message,
});

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => dispatch(loom.postLogout())
});

const AppHeader = connect(mapStateToProps, mapDispatchToProps)(DashboardHeader);

export default AppHeader;
