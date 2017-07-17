'use strict';

// Deps
import React, { PropTypes } from 'react';
import _ from 'lodash';
import classnames from 'classnames';

// Helpers
import { classNamesProp } from '../../core/propTypes';

// App
import router from '../router';

// ED Components
import Link from './Link';

// Tab Render
const Tab = (value, index) => {
  const classNames = {
    tab: classnames({
      'tab__item': true,
      'tab__item--active': value.href === router.getActivePath()
    }),
    link: classnames({ 'tab__link': true })
  };

  return (
    <li className={ classNames.tab } key={ `tab-item-${index}` }>
      <Link href={ value.href } text={ value.text } className={ classNames.link } key={ `tab-link-${index}` } />
    </li>
  );
};

// Render
const Nav = (props) => {
  const classNames = {
    nav: classnames(props.classNames),
    tabs: classnames({ 'tabs': true }),
  };

  return (
    <nav className={ classNames.nav }>
      <ul className={ classNames.tabs }>
        { _.map(props.navItems, Tab) }
      </ul>
    </nav>
  );
};

Nav.propTypes = {
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  classNames: classNamesProp
};

export default Nav;
