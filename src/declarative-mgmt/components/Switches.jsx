'use strict';

// Deps
import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

// Helpers
import { classNamesProp, switchesProp } from '../../core/propTypes';

// Grommet
import Heading from 'grommet/components/Heading';

// ED Components
import IconStatic from '../../core/components/IconStatic';

// Icon assets
const SvgSwitch = require('babel!svg-react!../../assets/icons/icon-switch.svg?name=SvgSwitch');

// Render Switch
const _renderSwitch = (item, i) => {
  const classNames = {
    'component': true,
    'component__switch': true,
    'component--undesirable': item.hasDiscrepancies,
    [`component--${item.alertLevel}`]: true,
    [`component--position-${item.position.toLowerCase()}`]: true
  };

  return (
    <IconStatic key={ `component-switch-${i}` } classNames={ classNames }>
      <SvgSwitch />
    </IconStatic>
  );
};

// Render Switches
const Switches = (props) => {
  const classNames = _.merge({}, {
    switches: {
      'enclosure__item': true,
      'enclosure__switches': true
    }
  }, props.classNames);

  return (
    <div className={ classnames(classNames.switches) }>
      <Heading tag="h5" className="enclosure__item-title">Fabric Switches</Heading>
      <div className="enclosure__item-components">
        { (props.switches && props.switches.length > 0) ? _.map(props.switches, _renderSwitch) : null }
      </div>
    </div>
  );
};

// PropTypes
Switches.propTypes = {
  switches: switchesProp,
  classNames: classNamesProp,
};

export default Switches;
