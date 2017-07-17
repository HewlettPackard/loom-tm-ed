'use strict';

// Deps
import React, { PropTypes, Component } from 'react';
import keymaster from 'keymaster';

// Helpers
import { drawerProp } from '../../core/propTypes';

const DrawerComposer = Drawer => class extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount () {
    keymaster('esc', 'drawer', () => {
      this.props.drawer.isActive && this.props.onToggleDrawer();
    });
  }

  componentWillUnmount() {
    keymaster.deleteScope('drawer');
  }

  onToggleDrawer () {
    this.props.drawer.isActive ? keymaster.setScope('all') : keymaster.setScope('drawer');
    this.props.onToggleDrawer();
  }

  render() {
    // @note: onToggleDrawer must be specified AFTER {...this.props} as it overloads this.props.onToggleDrawer
    // coming from the Container
    return <Drawer {...this.props} onToggleDrawer={ () => this.onToggleDrawer() } {...this.state} />;
  }
};

DrawerComposer.propTypes = {
  onToggleDrawer: PropTypes.func.isRequired,
  drawer: drawerProp,
};

export default DrawerComposer;
