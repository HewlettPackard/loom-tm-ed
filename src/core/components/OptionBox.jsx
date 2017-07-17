'use strict';

// Deps
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import _ from 'lodash';

// Helpers
import { classNamesProp, checkboxProp } from '../propTypes';

// Grommet
import CheckBox from 'grommet/components/CheckBox';

const baseClassName = 'option-box';

// Render
const OptionBox = (props) => (
  <div className={ classnames(_.merge({}, props.classNames, { [`${baseClassName}--active`]: !!props.field.checked })) } >
    <CheckBox
      id={ props.field.id }
      name={ props.field.name || props.field.id }
      onChange={ props.onChange }
      checked={ !!props.field.checked }
      label={ <span className={ `${baseClassName}__label` }>
        <span className={ `${baseClassName}__label-text` }>{ props.label }</span>
        <span className={ `${baseClassName}__label-description` }>{ props.description }</span>
      </span> }
    />
  </div>
);

OptionBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  field: checkboxProp.isRequired,
  classNames: classNamesProp,
};

export default OptionBox;
