'use strict';

// Deps
import React, { Component } from 'react';

// Helpers
import { metaProp, pageProp, enclosuresProp } from '../../core/propTypes';

// Grommet
import Heading from 'grommet/components/Heading';

// ED Components
import Spinner from '../../core/components/Spinner';
import Enclosures from '../../core/components/Enclosures';
import Node from './Node';
import Switches from './Switches';

class DeclarativeMgmtFocus extends Component {
  _renderEnclosures () {
    const { meta, enclosures } = this.props;
    const classNames = {
      enclosures: {
        'enclosures__declarative': true
      },
      enclosure: {}
    };

    if (meta.isReady) {
      return (
        <Enclosures
          key="declarative-mgmt-enclosures"
          classNames={ classNames }
          enclosures={ enclosures }
          nodeComponent={ Node }
          switchesComponent={ Switches }
        />
      );
    } else {
      return ( <Spinner/> );
    }
  }

  render () {
    const { page, enclosures } = this.props;

    return (
      <div className="focus">
        { !!page.subtitle ? <Heading tag="h4" strong={true}>{ page.subtitle }</Heading> : null }
        { enclosures ? this._renderEnclosures.bind(this)() : ( <Spinner /> ) }
      </div>
    );
  }
}

DeclarativeMgmtFocus.propTypes = {
  meta: metaProp.isRequired,
  page: pageProp.isRequired,
  enclosures: enclosuresProp
};

export default DeclarativeMgmtFocus;
