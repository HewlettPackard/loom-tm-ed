'use strict';

// Deps
import React, { PureComponent } from 'react';
import _ from 'lodash';
import classnames from 'classnames';

// Helpers
import { metaProp, usagePropWithTitles, classNamesProp } from '../propTypes';

// Grommet Components
import Meter from 'grommet/components/Meter';
import Value from 'grommet/components/Value';
import Heading from 'grommet/components/Heading';
//import Button from 'grommet/components/Button';

// Grommet Icons
//import NextIcon from 'grommet/components/icons/base/Next';

class Usage extends PureComponent {
  _renderUsageMeter (meter, i) {
    const { title, value, units = "%" } = meter;

    return (
      <div className="dashboard__usage-info" key={`usage-${i}`}>
        <Meter value={ value >= 0 ? value : undefined } label={ <Value value={ value } units={ units } /> } type="circle" />
        <Heading tag="h4" align="center" strong={true}>{ title }</Heading>
        {/*<Button label={<NextIcon type="control" size="medium" colorIndex="light-1" />} primary={true} onClick={console.log.bind(this, 'More button clicked')} />*/}
      </div>
    );
  }

  render() {
    const classNames = classnames(this.props.classNames || {});

    return (
      <aside className={ classNames }>
        { _.map(this.props.usage, this._renderUsageMeter) }
      </aside>
    );
  }
}

Usage.propTypes = {
  classNames: classNamesProp,
  meta: metaProp.isRequired,
  usage: usagePropWithTitles.isRequired
};

export default Usage;
