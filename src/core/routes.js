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

// Constants
import { APP } from './constants/';

// ED Templates
import Basic from './templates/Basic';
import Main from './templates/Main';

// ED Generic Components
import Signin from './containers/Signin';
import User from './containers/User';
import Usage from './containers/Usage';
import Nav from './components/Nav';

// ED Page Components
import UniversalMemoryFocus from '../universal-memory/containers/UniversalMemoryFocus';
import UniversalMemoryDetails from '../universal-memory/containers/UniversalMemoryDetails';
import DeclarativeMgmtFocus from '../declarative-mgmt/containers/DeclarativeMgmtFocus';
import DeclarativeMgmtDetails from '../declarative-mgmt/containers/DeclarativeMgmtDetails';
import MonitoringFocus from '../monitoring/components/MonitoringFocus';
import MonitoringDetails from '../monitoring/components/MonitoringDetails';
import MemoryMgmtFocus from '../memory-mgmt/containers/MemoryMgmtFocus';
import MemoryMgmtDetails from '../memory-mgmt/containers/MemoryMgmtDetails';

/**
 * Path Config
 *
 * Each path can be declared as auth: true/false.
 *
 * There be exactly one path with auth:true && default:true.
 * And exactly one path with auth:false && default:true
 */
export const paths = {
  signin: {
    auth: false,
    default: true,
    path: '/signin'
  },
  universalMemory: {
    auth: true,
    default: true,
    path: '/overview'
  },
  declarativeMgmt: {
    auth: true,
    path: '/declarative-management'
  },
  monitoring: {
    auth: true,
    path: '/monitoring'
  },
  memoryMgmt: {
    auth: true,
    path: '/memory-management'
  }
}; 

// Config
const tabs = [
  { href: paths.universalMemory.path, text: 'Overview'},
  { href: paths.declarativeMgmt.path, text: 'Declarative Management'},
  /*{ href: paths.monitoring.path, text: 'Monitoring'},*/
  { href: paths.memoryMgmt.path, text: 'Memory Management'},
];

const mainPage = {
  page: {},
  template: {
    component: Main,
    props: {},
  },
  system: [
    { key: 'user', component: User }
  ],
  children: {
    nav: {
      component: Nav,
      props: {
        navItems: tabs,
        classNames: {
          'dashboard__tabs': true
        }
      }
    },
    summary: {
      component: Usage,
      props: {
        classNames: {
          'dashboard__usage': true
        }
      }
    },
    focus: { component: null },
    details: { component: null },
  },
};

const basicPage = {
  page: {},
  template: {
    component: Basic,
    props: {}
  },
  system: [
    { key: 'user', component: User }
  ],
  children: {
    focus: { component: Signin },
  },
};

const routes = [
  {
    ...paths.signin,
    action: () => _.merge({}, basicPage, {
      template: {
        props: {
          classNames: {
            container: {
              'container--centre': true,
              'page__signin': true
            }
          }
        }
      },
      page: {
        title: 'Sign In',
        subtitle: APP.NAME
      },
      children: {
        focus: { component: Signin }
      }
    })
  },
  {
    ...paths.universalMemory,
    action: (data) => {
      return _.merge({}, mainPage, {
          template: {
            props: {
              classNames: {
                container: {
                  'page__universal-memory': true
                }
              }
            }
          },
          page: {
            title: 'Overview',
            subtitle: '',
            router: data || {},
          },
          children: {
            focus: { component: UniversalMemoryFocus },
            details: { component: UniversalMemoryDetails }
          }
        })
      }
    },
  {
    ...paths.declarativeMgmt,
    action: (data) => _.merge({}, mainPage, {
      template: {
        props: {
          classNames: {
            container: {
              'page__declarative-mgmt': true
            }
          }
        }
      },
      page: {
        title: 'Declarative Management',
        subtitle: 'Machine Instance',
        router: data || {},
      },
      children: {
        focus: { component: DeclarativeMgmtFocus },
        details: { component: DeclarativeMgmtDetails }
      }
    })
  },
  {
    ...paths.monitoring,
    action: (data) => _.merge({}, mainPage, {
      template: {
        props: {
          classNames: {
            container: {
              'page__monitoring': true
            }
          }
        }
      },
      page: {
        title: 'Monitoring',
        subtitle: '',
        router: data || {},
      },
      children: {
        focus: { component: MonitoringFocus },
        details: { component: MonitoringDetails }
      }
    })
  },
  {
    ...paths.memoryMgmt,
    action: (data) => _.merge({}, mainPage, {
      template: {
        props: {
          classNames: {
            container: {
              'page__memory-mgmt': true
            }
          }
        }
      },
      page: {
        title: 'Memory management',
        subtitle: '',
        router: data || {},
      },
      children: {
        focus: { component: MemoryMgmtFocus },
        details: { component: MemoryMgmtDetails }
      }
    })
  }
];

export default routes;
