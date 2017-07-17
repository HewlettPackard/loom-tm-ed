'use strict';

// Deps
import React, { PropTypes, PureComponent } from 'react';

// Grommet Components
import Heading from 'grommet/components/Heading';
import ExpandIcon from 'grommet/components/icons/base/Expand';
import ContractIcon from 'grommet/components/icons/base/Contract';
//import LogoutIcon from 'grommet/components/icons/base/Logout';

// ED Components
import Fullscreen from 'react-html5-fullscreen';

const Logo = require('babel!svg-react!../../assets/logo-hpe-horiz-flat.svg?name=Logo');

class DashboardHeader extends PureComponent {
  render () {
    return (
      <header className="header">
        <div className="header__brand">
          <Logo className="header__logo" />
        </div>
        <div className="header__app">
          <Heading tag="h4" strong={ true } className="header__title">{ this.props.title }</Heading>
        </div>
        <div className="header__utility">
          <Heading tag="h4" className="header__instance-name">{ this.props.instanceName }</Heading>
          <Heading tag="h4" className="header__icons">
            <Fullscreen
              contentEnter={
                <span>
                  {/*<span className="btn__text">Full screen</span>*/}
                  <ExpandIcon colorIndex="light-1" />
                </span>
              }
              contentExit={
                <span>
                  {/*<span className="btn__text">Exit full screen</span>*/}
                  <ContractIcon colorIndex="light-1" />
                </span>
              }
              target="body"
              className="grommetux-button btn__fullscreen"
            />
            <a className="grommetux-button grommetux-anchor link__logout" onClick={ () => this.props.onLogout() }>
              <span className="btn__text">Sign Out</span>
              {/*<LogoutIcon colorIndex="light-1" />*/}
            </a>
          </Heading>
        </div>
      </header>
    );
  }
}

DashboardHeader.propTypes = {
  onLogout: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  instanceName: PropTypes.string.isRequired,
};

export default DashboardHeader;
