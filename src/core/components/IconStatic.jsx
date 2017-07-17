'use strict';

// Deps
import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

// Helpers
import { classNamesProp } from '../propTypes';

// Render
const IconStatic = (props) => (
  <span className={ classnames(_.merge({}, { icon: true }, props.classNames)) }>
    { props.children }
  </span>
);

// PropTypes
IconStatic.propTypes = {
  classNames: classNamesProp,
};

export default IconStatic;
