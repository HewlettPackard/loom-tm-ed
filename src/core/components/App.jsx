'use strict';

// Deps
import React, { Component } from 'react';

// ED Deps
import _ from 'lodash';
import router from '../router';

// ED Components
import Basic from '../templates/Basic';

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      route: props.route || {}
    };

    this.getStoreState = this.props.store.getState;
  }

  componentDidMount () {
    const callback = (route) => this.setState({ route });

    // Bind Route Listener to subsequent history state changes
    router.history.listen((location) => router.resolve(location, callback, this.getStoreState().app.isAuthenticated));
  }

  handleRoute (route) {
    const { template = { component: Basic }, system = [], children = {}, page = {} } = route;

    let childComponents = {};
    let systemComponents = [];

    // Create React Elements from system components
    _.each(system, item => {
      item.props = item.props || {};
      item.props.key = item.key;
      item.props.page = page;
      !!item.component && systemComponents.push(React.createElement(item.component, item.props));
    });

    // Create React Elements from child components
    _.each(children, (child, key) => {
      child.props = child.props || {};
      child.props.key = key;
      child.props.page = page;
      childComponents[key] = !!child.component ? React.createElement(child.component, child.props) : null;
    });

    return { template, childComponents, systemComponents };
  }

  render () {
    const { template, childComponents, systemComponents } = this.handleRoute(this.state.route);
    const Template = template.component;

    /**
     * By storing all child components in an obj literal which forms the only item in the props.children array,
     * we can pick and choose how to display & wrap components at the template layer. e.g.
     *
     * <Template>
     *   { this.props.children[0].childA }
     *   <div class="some__wrapper">
     *     { this.props.children[0].childB }
     *   </div>
     * </Template>
     */
    return (
      <div className="app">
        <Template { ...template.props }>
          { [childComponents] }
        </Template>
        { systemComponents }
        <div className="grommetux-app__announcer"></div>
      </div>
    );
  }
}

// @todo: add propTypes

export default App;
