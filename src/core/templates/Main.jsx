'use strict';

// Deps
import React, { PropTypes, PureComponent } from 'react';
import _ from 'lodash';
import classnames from 'classnames';

// Constants & Helpers
import { APP } from '../constants/';
import { classNamesProp, componentsProp } from '../propTypes';

// ED Components
import AppHeader from '../containers/AppHeader';

// Styles
import 'scss/index';

class Main extends PureComponent {
  constructor (props) {
    super(props);

    // Initial State
    this.state = {
      title: APP.NAME,
    };
  }

  _renderAnnouncer () {
    // @hack: add no-op announcer to fix: https://github.com/grommet/grommet/issues/995
    return (
      <div className="grommetux-app__announcer"></div>
    );
  }

  render () {
    const { children } = this.props;

    const classNames = _.merge({}, {
      container: {
        'grommet': true,
        'grommetux-app': true,
        'container': true,
        'container--inverse': true,
        'template__main': true,
      },
      main: {
        'main': true,
        'dashboard': true,
      }
    }, this.props.classNames);

    return (
      <div className={ classnames(classNames.container) }>
        <AppHeader title={ this.state.title } subtitle={ this.state.subtitle } />
        <main className={ classnames(classNames.main) }>
          { children[0].summary }
          <article className="dashboard__focus">
            { children[0].nav }
            { children[0].focus }
          </article>
          { children[0].details }
        </main>
      </div>
    );
  }
}

Main.propTypes = {
  classNames: PropTypes.shape({
    container: classNamesProp,
    main: classNamesProp
  }),
  system: componentsProp,
  children: PropTypes.arrayOf(PropTypes.object),
};

export default Main;
