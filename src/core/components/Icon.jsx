'use strict';

// Deps
import React, { PropTypes } from 'react';

// Render
const Icon = (props) => {
  props.onClick = !!props.onClick ? props.onClick : (e) => console.warn('No click handler passed to the Icon component', e);

  return (
    <span className={ props.className } onClick={ (e) => props.onClick(e) }>
      { props.children }
    </span>
  );
};

// PropTypes
Icon.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Link;
