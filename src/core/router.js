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
import _ from 'lodash';
import createHistory from 'history/createHashHistory';

// App Deps
import { APP } from './constants'
import routes from './routes';

/**
 * History API wrapper
 *
 * N.B. The hash history behaviour is legacy to support the current Jetty server behaviour.
 * It can and probably should be improved to support any client side routing pattern, e.g. History API PushState
 *
 * @returns {History}
 */
const history = createHistory({ hashType: 'slash' });

/**
 * Provides the default route for authenticated or unauthenticated usage.
 * @param isAuth
 * @returns {*}
 */
const getDefaultRoute = (isAuth = false) => _.find(routes, { auth: isAuth, default: true });

/**
 * Sets the document title in a formatted manner:
 * setPageTitle() => 'App Name'
 * setPageTitle('Home page') => 'App Name | Home page'
 *
 * @param title
 */
const setPageTitle = (title = '') => {
  if (title.length > 0) {
    title = `${title} | `;
  }

  document.title = `${title}${APP.NAME}`;
};

/**
 * Resolves the route location and renders the app
 * @param location
 * @param callback
 * @param isAuth
 *  User is authenticated?
 * @returns {Promise.<TResult>}
 */
const resolve = (location, callback, isAuth = false) => {
  let route = getRoute(location);

  // Non-existent routes and authentication check failures
  if (!route || (route.auth && !isAuth)) {
    route = getDefaultRoute(isAuth);
    console.warn('Route not accessible, using', route);
    redirect(route);
  }

  return _resolve(route, location)
    .then(callback)
    .catch(error => {
      const defaultRoute = getDefaultRoute();
      const location = { pathname: defaultRoute.path, error };
      console.warn(error);
      return _resolve(defaultRoute, location).then(callback)
    });
};

/**
 * Updates the history state's location. Falls back to the default route if none is provided.
 * @param route
 * @param state
 * @private
 */
const redirect = (route) => {
  // Update history state with default route
  history.push({
    pathname: route.path || getDefaultRoute().path,
    search: route.search || null
  });
};

/**
 * Internal route resolver
 * @param route
 * @param context
 * @returns {*}
 * @private
 */
async function _resolve(route, context) {
  const result = await route.action(context);

  if (result) {
    const { page = {} } = result;
    setPageTitle(page.title);
    return result;
  }
}

/**
 * Obtains the route object with a path that matches the location's pathname.
 * If location is not provided it will use the current location from the history dependency.
 * @param location
 * @returns {*}
 */
const getRoute = (location = history.location) => _.find(routes, { path: location.pathname });

/**
 * Obtains the path value from the currently active route.
 * @returns {string}
 */
const getActivePath = () => getRoute().path;

/**
 * Asserts if the path is currently active.
 * @returns {string}
 */
const isActivePath = (path) => path === getActivePath();

export default {
  getDefaultRoute,
  getRoute,
  getActivePath,
  history,
  isActivePath,
  redirect,
  resolve,
};
