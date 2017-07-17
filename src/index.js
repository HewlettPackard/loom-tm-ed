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
import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'core/configureStore';

// ED Deps
import router from 'core/router';

// ED Components
import App from './core/components/App';

// Store
const initialState = {};
const store = configureStore(initialState);

// DOM
let domContainerNode;

// Mount the App using the template & components specified in the route
const mountApp = (route) => {
  if (domContainerNode) {
    ReactDOM.unmountComponentAtNode(domContainerNode);
  } else {
    domContainerNode = document.getElementById('content');
  }

  ReactDOM.render(
    <Provider store={ store }>
      <App route={ route } store={ store }/>
    </Provider>,
    domContainerNode
  );

  document.body.classList.remove('loading');
};

// Route the current URL
// Resolve calls mountApp with the resolved route obtained from history.location and falls back to (auth)default route.
router.resolve(router.history.location, mountApp, store.getState().app.isAuthenticated);
