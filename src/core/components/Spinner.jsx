'use strict';

import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import Modernizr from 'modernizr';

// Helpers
import { classNamesProp } from '../propTypes';

// Icon assets
const SvgSpinner = require('babel!svg-react!../../assets/icons/icon-spinner.svg?name=SvgSpinner');
const ImgSpinner = require('file!../../assets/icons/icon-spinner.gif');

const Spinner = (props) => {
  const classNames = {
    icon: true,
    'icon__spinner': true,
  };

  return (
    <span className={ classnames(_.merge({}, classNames, props.classNames)) }>
      { Modernizr.smil ? <SvgSpinner /> : <img src={ ImgSpinner } className="spinner" /> }
    </span>
  );
};

Spinner.propTypes = {
  classNames: classNamesProp
};

export default Spinner;
