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
import { PropTypes } from 'react';

// Defaults
import { APP } from './constants/';

// PropTypes

/**
 * Special Props
 */
const pageProp = PropTypes.shape({
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  classNames: classNamesProp,
});

const metaProp = PropTypes.shape({
  apiErrorMsg: PropTypes.string,
  isReady: PropTypes.bool.isRequired,
  hasNewData: PropTypes.bool.isRequired,
  source: PropTypes.string,
});

const loomProp = PropTypes.shape({
  hasTapestry: PropTypes.bool,
  shouldPollThreads: PropTypes.bool,
});

const notificationProp = PropTypes.shape({
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  repeat: PropTypes.bool,
});

const notificationsProp = PropTypes.arrayOf(notificationProp);

const navigateProp = PropTypes.shape({
  path: PropTypes.string,
  search: PropTypes.string,
});

const appProp = PropTypes.shape({
  isAuthenticated: PropTypes.bool.isRequired,
  nextAction: PropTypes.arrayOf(PropTypes.string).isRequired,
  demoMode: PropTypes.bool,
  forceUpdate: PropTypes.bool,
  lastInteraction: PropTypes.number,
  navigate: navigateProp.isRequired,
  notifications: notificationsProp.isRequired,
  loom: loomProp.isRequired,
});

const componentProp = PropTypes.element;

const componentsProp = PropTypes.arrayOf(componentProp);

/**
 * API Props
 */
const apiTapestryProp = PropTypes.shape({
  id: PropTypes.string,
  threads: PropTypes.array,
});

const apiThreadResultsProp = PropTypes.array;

const relationsProp = PropTypes.arrayOf( PropTypes.string.isRequired );

/**
 * UI Props
 */
const classNamesProp = PropTypes.objectOf(PropTypes.bool);

const checkboxProp = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  checked: PropTypes.bool,
});

const demoModeProp = PropTypes.bool;

const lastInteractionProp = PropTypes.number;

const drawerProp = PropTypes.shape({
  isActive: PropTypes.bool.isRequired,
});

/**
 * Value Props
 */
const titleValueProp = PropTypes.shape({
  title: PropTypes.string.isRequired,
  value: PropTypes.number,
});

const usageProp = PropTypes.shape({
  cpu: PropTypes.number.isRequired,
  fam: PropTypes.number,
  fabric: PropTypes.number.isRequired,
});

const usagePropWithTitles = PropTypes.shape({
  cpu: titleValueProp.isRequired,
  fam: titleValueProp,
  fabric: titleValueProp.isRequired,
});

const librarianProp = PropTypes.shape({
  books: PropTypes.number.isRequired,
  shelves: PropTypes.number.isRequired,
  memory: {
    allocated: PropTypes.number.isRequired,
    available: PropTypes.number.isRequired,
    notReady: PropTypes.number.isRequired,
    offline: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }.isRequired,
});

const discrepancyProp = PropTypes.shape({
  updated: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
});

const discrepanciesProp = PropTypes.arrayOf( discrepancyProp );

// @fixme: create a prop for Nodes with components (SoC & FAM)
const nodeProp = PropTypes.shape({
  logicalId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  relations: relationsProp,
  usage: usageProp.isRequired,
});

const socProp = PropTypes.shape({
  logicalId: PropTypes.string.isRequired,
  alertLevel: PropTypes.string.isRequired,
  hasDiscrepancies: PropTypes.bool.isRequired,
  powerState: PropTypes.string.isRequired,
  runningOsManifest: PropTypes.string.isRequired,
  dramUtilisation: PropTypes.number.isRequired,
  networkIn: PropTypes.number.isRequired,
  networkOut: PropTypes.number.isRequired,
  shelvesAccessing: PropTypes.number.isRequired,
  booksAccessing: PropTypes.number.isRequired,
});

const switchProp = PropTypes.shape({
  logicalId: PropTypes.string.isRequired,
  alertLevel: PropTypes.string.isRequired,
  hasDiscrepancies: PropTypes.bool.isRequired,
  position: PropTypes.string.isRequired,
});

const nodesProp = PropTypes.arrayOf(nodeProp);

const switchesProp = PropTypes.arrayOf(switchProp);

const matrixProp = PropTypes.arrayOf(
  PropTypes.arrayOf(
    PropTypes.number.isRequired,
  )
);

// @fixme: create an enclosureProp using nodesWithComponents & Switches
const enclosureProp = PropTypes.shape({
  logicalId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  relations: relationsProp,
  nodes: nodesProp,
  switches: switchesProp,
});

const enclosuresProp = PropTypes.arrayOf( enclosureProp );

const matricesProp = PropTypes.shape({
  default: matrixProp.isRequired,
  active: matrixProp,
});


export {
  appProp,
  loomProp,
  pageProp,
  metaProp,
  navigateProp,
  componentProp,
  componentsProp,
  apiTapestryProp,
  apiThreadResultsProp,
  classNamesProp,
  checkboxProp,
  demoModeProp,
  lastInteractionProp,
  drawerProp,
  titleValueProp,
  usageProp,
  usagePropWithTitles,
  librarianProp,
  discrepanciesProp,
  matricesProp,
  enclosuresProp,
  nodesProp,
  nodeProp,
  socProp,
  switchesProp,
  switchProp,
}
