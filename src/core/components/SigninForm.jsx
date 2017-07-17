'use strict';

// Deps
import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'lodash';

// Helpers
import { metaProp, pageProp, classNamesProp } from '../propTypes';

// Grommet Components
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';

// Logos
const HPELogo = require('babel!svg-react!../../assets/logo-hpe-vert-centered-colour.svg?name=Logo');
const LogoLabs = require('file!../../assets/logo-hpe-created-by-hp-labs-sml.png');

class SigninForm extends Component {
  constructor (props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      provider: '',
      errors: {
        form: '',
        provider: '',
        email: '',
        password: ''
      }
    };
  }

  componentDidMount () {
    this.props.onGetProviders();
  }

  onSubmit (e) {
    let errors = this._validate();
    e.preventDefault();

    if (_.isEmpty(errors)) {
      this._doLogin();
    }

    this.setState({ errors: errors });
  }

  _doLogin () {
    let provider = {};
    if (this.state.provider.length === 0) {
      provider = this.props.providers[0];
    } else {
      provider = _.find(this.props.providers, { 'providerId': this.state.provider });
    }

    this.props.onLogin({
      provider: provider,
      username: this.state.email,
      password: this.state.password,
    });
  }

  handleChange (e) {
    const newState = {};
    const targetId = e.target.id.replace('signin-', '');
    newState[targetId] = e.target.value;

    this.setState(newState);
  }

  _renderProvidersField () {
    const fieldId = "signin-provider";
    return (
      <FormField label="Provider" htmlFor={ fieldId } error={ this.state.errors.provider }>
        <select id={ fieldId } name={ fieldId } defaultValue={ this.props.providers[0].providerId } onChange={ e => this.handleChange(e) }>
          {
            _.map(this.props.providers, (provider) => {
              const { providerId: id, name } = provider;
              return (
                <option key={ `${fieldId}-option-${id}` } value={ id }>{ name }</option>
              );
            })
          }
        </select>
      </FormField>
    );
  }

  _cloneErrors () {
    return Object.assign({}, this.state.errors);
  }

  _validate () {
    let errors = {};

    if (this.state.email.length === 0) {
      errors.email = 'Email address missing';
    }

    if (this.state.password.length === 0) {
      errors.password = 'Password missing';
    }

    return errors;
  }

  componentWillReceiveProps (nextProps) {
    let errors = this._cloneErrors();

    if (!nextProps.providers || nextProps.providers.length === 0) {
      errors.providers = 'No providers found';
    }

    if (nextProps.meta.apiErrorMsg && nextProps.meta.apiErrorMsg.length > 0) {
      errors.form = nextProps.meta.apiErrorMsg;
    }

    this.setState({errors: errors});
  }

  render() {
    const btnClassNames = {
      'login-form__submit': true,
      'grommetux-button': true,
      'grommetux-button--primary': true
    };

    return (
      <div className="form__wrapper">
        <HPELogo/>
        <Form onSubmit={ e => this.onSubmit(e) } className="login-form grommetux-login-form">
          <h1 className="grommetux-heading">{ this.props.page.subtitle }</h1>
          <fieldset>
            { this._renderProvidersField() }
            <FormField label="Email" htmlFor="signin-email" error={ this.state.errors.email }>
              <input id="signin-email" type="text" value={ this.state.email } onChange={ e => this.handleChange(e) } />
            </FormField>
            <FormField label="Password" htmlFor="signin-password" error={ this.state.errors.password }>
              <input id="signin-password" type="password" value={ this.state.password } onChange={ e => this.handleChange(e) } />
            </FormField>
          </fieldset>
          <p className="error">{ this.state.errors.form }</p>
          <button type="submit" className={ classnames(btnClassNames) } onSubmit={ e => this.onSubmit(e) }>Sign In</button>
        </Form>
        <div className="signin__footer">
          <div className="signin__footer-logo">
            <img src={ LogoLabs } alt="Created by Hewlett Packard Labs"/>
          </div>
        </div>
      </div>
    )
  }
}

SigninForm.propTypes = {
  onGetProviders: React.PropTypes.func.isRequired,
  onLogin: React.PropTypes.func.isRequired,
  classNames: classNamesProp,
  meta: metaProp.isRequired,
  page: pageProp.isRequired,
  providers: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    providerId: React.PropTypes.string.isRequired,
    providerType: React.PropTypes.string.isRequired
  })).isRequired
};

SigninForm.defaultProps = {
  providers: [{
    name: '',
    providerId: '',
    providerType: ''
  }]
};

export default SigninForm;
