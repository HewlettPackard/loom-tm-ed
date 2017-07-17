'use strict';

// Deps
import React, { PropTypes } from 'react';

// App
import router from '../router';

// OnClick
const transition = (event) => {
  event.preventDefault();
  router.redirect({
    path: event.currentTarget.pathname,
    search: event.currentTarget.search,
  });
};

// Render
const Link = (props) => (
  <a href={ props.href } onClick={ transition } className={ props.className }>{ props.text }</a>
);

// PropTypes
Link.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Link;
