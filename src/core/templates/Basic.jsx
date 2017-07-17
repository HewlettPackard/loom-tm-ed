'use strict';

// Deps
import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';

// Helpers
import { classNamesProp, componentsProp } from '../propTypes';

class Basic extends Component {
  render () {
    const { children } = this.props;

    const classNames = _.merge({}, {
      container: {
        'grommet': true,
        'grommetux-app': true,
        'container': true,
        'template__basic': true
      },
      main: {
        'main': true,
      }
    }, this.props.classNames);

    return (
      <div className={ classnames(classNames.container) }>
        { children[0].header }
        <main className={ classnames(classNames.main) }>
          <div className="main__inner">
            { children[0].focus }
          </div>
        </main>
      </div>
    );
  }
}

Basic.propTypes = {
  classNames: PropTypes.shape({
    container: classNamesProp,
    main: classNamesProp
  }),
  system: componentsProp,
  children: PropTypes.arrayOf(PropTypes.object),
};

export default Basic;
