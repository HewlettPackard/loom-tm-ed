'use strict';

// Deps
import React, { PropTypes, Component } from 'react';

// Helpers
import { pageProp, metaProp, discrepanciesProp, drawerProp } from '../../core/propTypes';

// Grommet Components
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';

// ED Components
import Drawer from '../../core/components/Drawer';
import Spinner from '../../core/components/Spinner';
import IconStatic from '../../core/components/IconStatic';
import DeviationChart from './DeviationChart';
import DeclarativeMgmtInfo from './DeclarativeMgmtInfo';

// Icon assets
const SvgSOC = require('babel!svg-react!../../assets/icons/icon-soc.svg?name=SvgSOC');
const SvgFAM = require('babel!svg-react!../../assets/icons/icon-fam.svg?name=SvgFAM');
const SvgSwitch = require('babel!svg-react!../../assets/icons/icon-switch.svg?name=SvgSwitch');

class DeclarativeMgmtDetails extends Component {
  _renderLegends () {
    return (
      <div className="columns">
        <div className="column">
          <Heading tag="h5" className="legend__heading">Health</Heading>
          <ul className="legend">
            <li className="key key__ok">No errors</li>
            <li className="key key__warning">Warning</li>
            <li className="key key__error">Error</li>
          </ul>
        </div>
        <div className="column">
          <Heading tag="h5" className="legend__heading">Components</Heading>
          <ul className="legend">
            <li className="key key__icon">
              <IconStatic><SvgSOC /></IconStatic>
              <span className="label">System-on-Chip</span>
            </li>
            <li className="key key__icon">
              <IconStatic><SvgFAM /></IconStatic>
              <span className="label">Fabric Attached Memory</span>
            </li>
            <li className="key key__icon">
              <IconStatic><SvgSwitch /></IconStatic>
              <span className="label">Fabric Switch</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  render () {
    const { meta, page, discrepancies } = this.props;

    return (
      <aside className="dashboard__details">
        <div className="dashboard__details-info">
          <Heading tag="h4" strong={true}>Legend</Heading>
          { this._renderLegends() }
          <Paragraph>Blinking indicates the desired state has not yet been reached.</Paragraph>
        </div>
        <div className="dashboard__details-info dashboard__details-info--stretch">
          <Heading tag="h4" strong={true}>Deviation from desired state</Heading>
          { meta.isReady ? <DeviationChart discrepancies={ discrepancies } /> : <Spinner /> }
        </div>
        <Drawer classNames={ { 'dashboard__details-info': true } } component={ <DeclarativeMgmtInfo page={ page } /> } { ...this.props } />
      </aside>
    );
  }
}

DeclarativeMgmtDetails.propTypes = {
  onToggleDrawer: PropTypes.func.isRequired,
  page: pageProp.isRequired,
  meta: metaProp.isRequired,
  forceUpdate: PropTypes.bool,
  discrepancies: discrepanciesProp,
  drawer: drawerProp,
};

export default DeclarativeMgmtDetails;
