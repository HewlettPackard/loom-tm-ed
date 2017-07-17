'use strict';

// Deps
import React, { PropTypes } from 'react';
import _ from 'lodash';
import classnames from 'classnames';

// Helpers
import { classNamesProp, enclosuresProp, nodeProp } from '../propTypes';

// Grommet
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';

// ED Components
import Spinner from './Spinner';

// Render Node Component
const Node = (props, node, i) => {
  const { nodeActive, onSelectNode } = props;
  const NodeComponent = props.nodeComponent;

  return NodeComponent ? (
    <NodeComponent
      key={ `enclosure-node-${i}` }
      node={ node }
      isActive={ nodeActive && node.logicalId === nodeActive.logicalId }
      onSelectNode={ onSelectNode }
    />
  ) : null;
};
// Render Node Component
const Switches = (props, switches, i) => {
  const SwitchesComponent = props.switchesComponent;

  return SwitchesComponent ? (
    <SwitchesComponent key={ `enclosure-switches-${i}` } switches={ switches } />
  ) : null;
};

// Render Enclosure
const Enclosure = (props, classNames, enclosure, i) => {
  classNames = _.merge({}, {
    enclosure: true,
    'enclosure--undesirable': enclosure.hasDiscrepancies
  }, classNames.enclosure);

  classNames[`enclosure--${enclosure.alertLevel}`] = true;

  return (
    <div key={`enclosure-${i+1}`} className={ classnames(classNames)}>
      <Heading tag="h5" className="enclosure__title">{ enclosure.title }</Heading>
      <div className="enclosure__items">
        { enclosure.nodes ? _.map(enclosure.nodes, Node.bind(this, props)) : ( <Paragraph>Loading</Paragraph> ) }
        { enclosure.switches ? Switches(props, enclosure.switches) : null }
      </div>
    </div>
  );
};

// Render
const Enclosures = (props) => {
  const { enclosures } = props;
  const classNames = _.merge({}, {
    enclosures: {
      enclosures: true
    }
  }, props.classNames);

  return (
    <div className={ classnames(classNames.enclosures) }>
      { enclosures.length > 0 ? _.map(enclosures, Enclosure.bind(this, props, classNames)) : <Spinner /> }
    </div>
  );
};

// PropTypes
Enclosures.propTypes = {
  onSelectNode: PropTypes.func,
  enclosures: enclosuresProp.isRequired,
  nodeComponent: PropTypes.func.isRequired,
  nodeActive: nodeProp,
  switchesComponent: PropTypes.func,
  classNames: PropTypes.shape({
    enclosures: classNamesProp,
    enclosure: classNamesProp
  }),
};

export default Enclosures;
