'use strict';

// Deps
import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

// Constants
import { APP, API } from '../constants';

// Routing
import router from '../router';

// Helpers
import { appProp, metaProp, navigateProp, apiTapestryProp, demoModeProp, lastInteractionProp } from '../propTypes';

// Grommet Components
import Toast from 'grommet/components/Toast';

class UserBehaviours extends Component {
  constructor(props) {
    super(props);

    // Timer IDs
    this.getThreadResultsIntervalId = 0;
    this.demoModeTimeoutId = 0;

    // Bind methods
    this.bound_onClickAnywhere = (e) => this.onClickAnywhere(e);
    this.onCloseNotice = this.onCloseNotice.bind(this);
    this._renderNotice = this._renderNotice.bind(this);

    this._clearDemoModeTimer = this._clearDemoModeTimer.bind(this);
    this._clearGetThreadResultsTimers = this._clearGetThreadResultsTimers.bind(this);
    this._clearTimers = this._clearTimers.bind(this);
    this._redirect = this._redirect.bind(this);
    this._validateUserStatus = this._validateUserStatus.bind(this);

    this.listenForInteractions = this.listenForInteractions.bind(this);
  }

  componentDidMount () {
    this._validateUserStatus();

    document.addEventListener('click', this.bound_onClickAnywhere, false);
    document.addEventListener('touchstart', this.bound_onClickAnywhere, false);

    if (this.props.meta.isReady) {
      this.listenForInteractions();
    }
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.bound_onClickAnywhere, false);
    document.removeEventListener('touchstart', this.bound_onClickAnywhere, false);
    this._clearTimers();
  }

  componentWillReceiveProps (nextProps) {
    // Check that API should be polled
    if (this.getThreadResultsIntervalId && (!nextProps.app.loom.hasTapestry || !nextProps.app.loom.shouldPollThreads)) {
      this._clearTimers();
    }

    // Handle App nextAction
    if (nextProps.app.nextAction.length > 0 && this.props.app.nextAction !== nextProps.app.nextAction) {
      switch (nextProps.app.nextAction[0]) {
        case API.LOOM.RESOURCES.TAPESTRY:
          this.props.onPostTapestries();
          break;
        case API.LOOM.RESOURCES.THREADS:
          // Only getThreadResults if an Interval is not already running
          if (!this.getThreadResultsIntervalId && nextProps.app.loom.hasTapestry && nextProps.app.loom.shouldPollThreads) {
            const tapestryId = nextProps.tapestry.id;
            const threads = nextProps.tapestry.threads;

            // Make initial call to getThreadResults
            this.props.onGetThreadResults({ tapestryId, threads });
            // Set Interval for getThreadResults. Store intervalID to allow clearing of interval
            this.getThreadResultsIntervalId = setInterval(() => this.props.onGetThreadResults({ tapestryId, threads}), API.LOOM.POLL_INTERVAL);
          }
          break;
      }
    }

    // DemoMode
    if (this.demoModeTimeoutId && nextProps.meta.isReady) {
      if (!this.props.demoMode && nextProps.demoMode) {
        // Entering demoMode
        this._clearDemoModeTimer();
      } else if (this.props.demoMode && !nextProps.demoMode) {
        // Leaving demoMode
        this.listenForInteractions();
      } else if (this.props.app.lastInteraction !== nextProps.app.lastInteraction) {
        // User Interaction happened
        this._clearDemoModeTimer();
        this.listenForInteractions();
      }
    } else if (nextProps.meta.isReady) {
      this.listenForInteractions();
    }

    // Navigate user
    if (nextProps.navigate && nextProps.navigate.path) {
      this._redirect({
        path: nextProps.navigate.path,
        search: nextProps.navigate.search
      });
    }
  }

  _clearDemoModeTimer () {
    clearTimeout(this.demoModeTimeoutId);
    this.demoModeTimeoutId = null;
  }

  _clearGetThreadResultsTimers () {
    clearInterval(this.getThreadResultsIntervalId);
    this.getThreadResultsIntervalId = 0;
  }

  _clearTimers () {
    this._clearDemoModeTimer();
    this._clearGetThreadResultsTimers();
  }

  _redirect (route) {
    if (route.path && !router.isActivePath(route.path)) {
      router.redirect({
        path: route.path,
        search: route.search || null
      });
    }
  }

  _validateUserStatus () {
    const { app, meta } = this.props;
    const defaultRoute = router.getDefaultRoute();
    // Handle auth failure
    // @todo: make this usable for componentWillMount && componentWillReceiveProps

    if (!app.isAuthenticated && router.getActivePath() !== defaultRoute.path) {
      console.warn(`_redirectToDefault: user is not Authenticated, Active Router: ${router.getActivePath()}. Signin path: ${defaultRoute.path}`, meta);

      this._clearTimers();

      // @todo: is any state needed for signin page?
      // @fixme: this causes a flicker from dashboard page to signin
      // Timeout required to move redirect onto nextTick of event loop if the page is refreshed.
      setTimeout(() => this._redirect({ path: defaultRoute.path }), 0);
      return;
    }
  }

  onCloseNotice (id) {
    this.props.onCloseNotification(id);
  }

  /**
   * This handler should be used for custom click handling at the highest level in the app.
   * Common use cases might be:
   *
   *  1. DemoMode toggling (an interaction anywhere on the screen would pause/reset a DemoMode timer)
   *  2. Closing modal/drawer/notification UI patterns
   *  3. Trapping and reporting user interaction for analytical reasons.
   *
   *  The time property is UTC
   *
   * @param event
   */
  onClickAnywhere (event) {
    const payload = {
      source: event.type,
      time: Date.now(),
      event,
    };

    this.props.onRecordUser(payload);
  }

  listenForInteractions () {
    this.demoModeTimeoutId = setTimeout(() => this.props.onStartDemoMode(), APP.DEMO_MODE_TIMEOUT);
  }

  /**
   * @fixme: Grommet doesn't call the onClose handler with the React Synthetic event data,
   * therefore this.onCloseNotice cannot stop the event from bubbling - causing side effects from click handlers
   * bound higher up the DOM tree.
   **/
  _renderNotice (notice, index) {
    return (
      <Toast key={ `notification-item-${index}` } status={ notice.type } onClose={ () => this.onCloseNotice(notice.id) } >{ notice.message }</Toast>
    );
  }

  render () {
    return (
      <div className="user__notications">
        { _.map(_.filter(this.props.notifications, 'message'), this._renderNotice) }
      </div>
    );
  }
}

UserBehaviours.propTypes = {
  onCloseNotification: PropTypes.func.isRequired,
  onNavigateUser: PropTypes.func.isRequired,
  onRecordUser: PropTypes.func.isRequired,
  onStartDemoMode: PropTypes.func.isRequired,
  onPostTapestries: PropTypes.func.isRequired,
  onGetThreadResults: PropTypes.func.isRequired,
  meta: metaProp.isRequired,
  app: appProp.isRequired,
  notifications: PropTypes.array.isRequired,
  navigate: navigateProp.isRequired,
  lastInteraction: lastInteractionProp,
  demoMode: demoModeProp,
  tapestry: apiTapestryProp,
};

export default UserBehaviours;
