'use strict';

// Deps
import React, { PropTypes, PureComponent } from 'react';
import _ from 'lodash';

// Helpers
import utils from '../../core/helpers/utils';
import apiDefaults from '../../core/defaults/api';
import { pageProp, metaProp, drawerProp, librarianProp } from '../../core/propTypes';

// Grommet Components
import Heading from 'grommet/components/Heading';
import Meter from 'grommet/components/Meter';
import Value from 'grommet/components/Value';

// ED Components
import Drawer from '../../core/components/Drawer';
import Spinner from '../../core/components/Spinner';
import MemoryMgmtInfo from './MemoryMgmtInfo';

class MemoryMgmtDetails extends PureComponent {
  constructor (props) {
    super(props);

    const byteOptions = {
      baseUnit: 'gb',
      decimal: false
    };
    const memoryDefaults = apiDefaults.threadResults.librarian.memory;

    let bestBytes = utils.bestBytes(memoryDefaults.total, 1, 1000, byteOptions);

    this.defaults = {
      byteOptions,
      meter: {
        units: bestBytes.label,
        value: bestBytes.value,
        label: 'Total',
      },
      meterSeries: [
        { id: 'allocated', name: 'Allocated', colorIndex: 'graph-1', value: utils.bytesToValues(memoryDefaults.allocated, byteOptions)[bestBytes.key] },
        { id: 'available', name: 'Available', colorIndex: 'graph-3', value: utils.bytesToValues(memoryDefaults.available, byteOptions)[bestBytes.key] },
        { id: 'notReady', name: 'Not Ready', colorIndex: 'graph-2', value: utils.bytesToValues(memoryDefaults.notReady, byteOptions)[bestBytes.key] },
        { id: 'offline', name: 'Offline', colorIndex: 'graph-4', value: utils.bytesToValues(memoryDefaults.offline, byteOptions)[bestBytes.key] },
      ],
      cells: []
    };

    this.state = {
      meter: this.defaults.meter,
      meterSeries: this.defaults.meterSeries,
    };
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps !== this.props) {
      const bestBytes = utils.bestBytes(nextProps.librarian.memory.total, 1, 1000, this.defaults.byteOptions);

      this.defaults.meter.units = bestBytes.label;
      this.defaults.meter.value = bestBytes.value;

      let meterSeries = _.map(this.state.meterSeries, (item) => _.merge({}, item, {
        value: utils.bytesToValues(nextProps.librarian.memory[item.id], this.defaults.byteOptions)[bestBytes.key]
      }));

      this.setState({
        meterSeries,
        meter: _.merge({}, this.state.meter, {
          value: this.defaults.meter.value,
          units: this.defaults.meter.units
        }),
      });
    }
  }

  onMeterActive (i) {
    if (i >= 0 && this.defaults.meter.value > 0) {
      this.setState({
        meter: {
          label: this.state.meterSeries[i].name,
          value: this.state.meterSeries[i].value,
          units: this.state.meter.units,
        },
      });
    } else if (this.state.meter !== this.defaults.meter) {
      this.setState({
        meter: this.defaults.meter,
      })
    }
  }

  _renderLegendItem (item) {
    return ( <li key={ `legend-${item.id}` } className={ `key key__${item.colorIndex}` }>{ item.name }</li> );
  }

  _renderLegends () {
    const legendSplit = this.state.meterSeries.length > 3 ? Math.ceil(this.state.meterSeries.length / 2) : null;

    // Render as two columns if more than 3 items. This could be done with CSS but would have x-browser issues.
    if (legendSplit) {
      return (
        <div className="columns">
          <div className="column">
            <ul className="legend">
              { _.map(this.state.meterSeries.slice(0, legendSplit), this._renderLegendItem) }
            </ul>
          </div>
          <div className="column">
            <ul className="legend">
            { _.map(this.state.meterSeries.slice(legendSplit), this._renderLegendItem) }
            </ul>
          </div>
        </div>
      );
    } else {
      return (
        <div className="columns">
          <div className="column">
            <ul className="legend">
              { _.map(this.state.meterSeries, this._renderLegendItem) }
            </ul>
          </div>
        </div>
      );
    }
  }

  _renderMeter () {
    return (
      <div className="meter__wrapper">
        <Meter
          series={ this.state.meterSeries }
          type="circle"
          label={ <Value value={ this.state.meter.value } units={ this.state.meter.units } /> }
          max={ this.defaults.meter.value }
          stacked={ true }
          onActive={ (i) => this.onMeterActive(i) }
        />
        <Heading tag="h4" align="center" strong={ true } uppercase={ true }>{ this.state.meter.label }</Heading>
        { this._renderLegends() }
      </div>
    );
  }

  _renderMetric (value, title) {
    return (
      <div className="value__wrapper">
        <Value value={ utils.formatNumber(value, 2) } align="center" size="large" />
        <Heading tag="h4" align="center" strong={ true } uppercase={ true }>{ title }</Heading>
      </div>
    );
  }

  render () {
    const { page, meta, librarian } = this.props;

    return (
      <aside className="dashboard__details">
        <div className="dashboard__details-info">
          <Heading tag="h4" align="center" strong={ true }>Memory breakdown</Heading>
          { meta.isReady ? this._renderMeter() : <Spinner /> }
        </div>
        <div className="dashboard__details-info dashboard__details-info--stretch">
          { meta.isReady ? this._renderMetric(librarian.shelves, 'Active Shelves') : <Spinner /> }
        </div>
        <div className="dashboard__details-info dashboard__details-info--stretch">
          { meta.isReady ? this._renderMetric(librarian.maxBooks, 'Books') : <Spinner /> }
        </div>
        <Drawer classNames={ { 'dashboard__details-info': true } } component={ <MemoryMgmtInfo page={ page } /> } { ...this.props } />
      </aside>
    );
  }
}

MemoryMgmtDetails.propTypes = {
  onToggleDrawer: PropTypes.func.isRequired,
  page: pageProp.isRequired,
  meta: metaProp.isRequired,
  forceUpdate: PropTypes.bool,
  drawer: drawerProp,
  librarian: librarianProp,
};

export default MemoryMgmtDetails;
