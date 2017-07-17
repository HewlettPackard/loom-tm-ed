'use strict';

// Deps
import React, { PropTypes } from 'react';

// Helpers
import { nodeProp } from '../../core/propTypes';

// Render
const NodeButton = (props) => (
  <button className={ props.className } onClick={ props.onClick.bind(this, props.node.logicalId) } >
    { props.node.id }
  </button>
);

NodeButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  node: nodeProp.isRequired
};

export default NodeButton;
