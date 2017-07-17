'use strict';

// Deps
import React, { PropTypes } from 'react';
import classnames from 'classnames';

// Helpers
import { nodeProp } from '../../core/propTypes';

// ED Components
import NodeButton from '../../core/components/NodeButton';

// Render Node
const Node = (props) => {
  const classNames = {
    'node': true,
    'node__btn': true,
    'node__btn--active': !!props.isActive
  };

  return (
    <NodeButton
      node={ props.node }
      className={ classnames(classNames) }
      onClick={ props.onSelectNode }
    />
  );
};

// PropTypes
Node.propTypes = {
  onSelectNode: PropTypes.func,
  node: nodeProp,
  isActive: PropTypes.bool,
  className: React.PropTypes.string,
};

export default Node;
