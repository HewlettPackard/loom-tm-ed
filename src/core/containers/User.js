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

// Actions
import *  as actions from '../actions';

// ED Components
import UserBehaviours from '../components/UserBehaviours';

// Payloads
import * as queryTapestries from '../queries/tapestries';

const mapStateToProps = (state, props) => {
  // Handle routing change with state
  let hasPageState = props.page && props.page.router && props.page.router.state && props.page.router.state.meta;
  let pageState = hasPageState ? props.page.router.state : { meta: {} };

  // Clear down router
  if (hasPageState) {
    props.page.router = {};
  }

  return {
    app: state.app,
    meta: _.merge({}, state.loom.meta, pageState.meta),
    navigate: state.app.navigate, // @todo: move this to app state?
    notifications: state.app.notifications, // @todo: move this to app state?
    lastInteraction: state.app.lastInteraction, // @todo: move this to app state?
    demoMode: state.app.demoMode, // @todo: move this to app state?
    tapestry: state.loom.tapestry,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onNavigateUser: () => dispatch(actions.app.navigate()),

  onCloseNotification: id => dispatch(actions.app.closeNotification(id)),

  onRecordUser: data => dispatch(actions.app.record(data)),

  onStartDemoMode: () => dispatch(actions.app.startDemoMode()),

  onPostTapestries: () => dispatch(actions.loom.postTapestries(queryTapestries)),

  onGetThreadResults: ({ tapestryId, threads }) => _.each(threads, thread => dispatch(actions.loom.getThreadResults({ tapestryId, thread }))),
});

const User = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserBehaviours);

export default User;
