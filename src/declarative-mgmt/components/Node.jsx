'use strict';

// Deps
import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

// Helpers
import { classNamesProp, nodeProp } from '../../core/propTypes';

// Grommet
import Heading from 'grommet/components/Heading';

// ED Components
import IconStatic from '../../core/components/IconStatic';

// Icon assets
const SvgSOC = require('babel!svg-react!../../assets/icons/icon-soc.svg?name=SvgSOC');
const SvgFAM = require('babel!svg-react!../../assets/icons/icon-fam.svg?name=SvgFAM');

// Render SoC
const _renderSoc = (soc = {}, i) => {
  const classNames = {
    'component': true,
    'component__soc': true,
    'component--undesirable': soc.hasDiscrepancies
  };

  classNames[`component--${soc.alertLevel}`] = true;

  return (
    <IconStatic key={ `component-soc-${i}` } classNames={ classNames }>
      <SvgSOC />
    </IconStatic>
  );
};

// Render MemoryBoard
const _renderMemoryboard = (memoryboard = {}, i) => {
  const classNames = {
    'component': true,
    'component__memoryboard': true,
    'component--undesirable': memoryboard.hasDiscrepancies
  };

  classNames[`component--${memoryboard.alertLevel}`] = true;

  return (
    <IconStatic key={ `component-memoryboard-${i}` } classNames={ classNames }>
      <SvgFAM />
    </IconStatic>
  );
};

// Render Node
const Node = (props) => {
  const { node = {} } = props;

  const classNames = _.merge({}, {
    node: {
      'enclosure__node': true,
      'enclosure__item': true,
      'enclosure__item--undesirable': node.hasDiscrepancies
    }
  }, props.classNames);

  if (node.alertLevel) {
    classNames.node[`enclosure__item--${node.alertLevel}`] = true;
  }

  return (
    <div className={ classnames(classNames.node) }>
      <Heading tag="h5" className="enclosure__item-title">{ node.id }</Heading>
      <div className="enclosure__item-components">
        { (node.socs && node.socs.length > 0) ? _.map(node.socs, _renderSoc) : null }
        { (node.memoryboards && node.memoryboards.length > 0) ? _.map(node.memoryboards, _renderMemoryboard) : null }
      </div>
    </div>
  );
};

// PropTypes
Node.propTypes = {
  node: nodeProp,
  classNames: classNamesProp,
};

export default Node;
