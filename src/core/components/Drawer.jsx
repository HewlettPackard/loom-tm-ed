'use strict';

// Deps
import React, { PropTypes } from 'react';
import classnames from 'classnames';

// Grommet Components
import Button from 'grommet/components/Button';
import Layer from 'grommet/components/Layer';

// Higher-Order Components
import DrawerComposer from './DrawerComposer';

// Helpers
import { pageProp, classNamesProp, drawerProp, componentProp } from '../../core/propTypes';

const Drawer = (props) => (
  <div className={ classnames(props.classNames) }>
    <Button primary={ true } onClick={ () => props.onToggleDrawer() }>See more information</Button>
    <Layer hidden={ !props.drawer.isActive } onClose={ () => props.onToggleDrawer() } closer={ true } align="right">
      { props.component }
    </Layer>
  </div>
);

Drawer.propTypes = {
  onToggleDrawer: PropTypes.func.isRequired,
  page: pageProp.isRequired,
  classNames: classNamesProp,
  drawer: drawerProp,
  component: componentProp,
};

export default DrawerComposer(Drawer);
