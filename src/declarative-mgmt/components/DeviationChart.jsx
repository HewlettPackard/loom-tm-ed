'use strict';

// Deps
import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

// Helpers
import { API } from '../../core/constants';
import { discrepanciesProp } from '../../core/propTypes';

// Grommet Components
import Paragraph from 'grommet/components/Paragraph';

// Grommet Chart Components
import Chart from 'grommet/components/chart/Chart';
import Axis from 'grommet/components/chart/Axis';
import MarkerLabel from 'grommet/components/chart/MarkerLabel';
import Base from 'grommet/components/chart/Base';
import Layers from 'grommet/components/chart/Layers';
import Grid from 'grommet/components/chart/Grid';
import Marker from 'grommet/components/chart/Marker';
import Line from 'grommet/components/chart/Line';
import HotSpots from 'grommet/components/chart/HotSpots';
import Value from 'grommet/components/Value';

class DeviationChart extends Component {
  constructor (props) {
    super(props);

    // Initial state
    this.state = {
      chartItemActive: null
    };

    this.getDiscrepancyValue = this.getDiscrepancyValue.bind(this);
    this.getDiscrepancyValues = this.getDiscrepancyValues.bind(this);
  }

  onActive (i) {
    this.setState({ chartItemActive: (typeof i === 'undefined') ? null : i });
  }

  getDiscrepancyValue (i) {
    // Handle invalid indexes
    if (!_.isFinite(i) || !_.isArray(this.props.discrepancies) || i < 0 || i >= this.props.discrepancies.length) {
      return 0;
    }

    return this.props.discrepancies[i].value;
  }

  getDiscrepancyValues (limit = 50) {
    let beginIndex = this.props.discrepancies.length - limit;
    beginIndex = (beginIndex >= 0) ? beginIndex : 0;

    return _.map(this.props.discrepancies.slice(beginIndex), (_value, i) => this.getDiscrepancyValue(beginIndex + i));
  }

  getXAxis (values, modulo = 1) {
    const interval = API.LOOM.POLL_INTERVAL / 1000;

    const labels = _.reduce(values, (result, _v, i) => {
      if (!(i % modulo)) {
        const index = (values.length - 1) - i;
        const label = i > 0 ? `-${(interval * i)}s` : 'now';
        result.push({ index, label });
      }

      return result;
    }, []);

    return { labels };
  }

  getYAxis (values) {
    const highestValue = _.max(values);
    const rows = 5;
    const labels = [];

    let interval = Math.ceil(highestValue / (rows - 1));
    let limit = 0;

    if (interval >= 5) {
      interval = Math.ceil(interval / 5) * 5;
    }

    for (let i = 0; i < rows; i++) {
      const value = Math.max(i, (interval * i));
      labels.push({ index: i, label: `${value}` });

      if (i === (rows - 1)) {
        limit = value;
      }
    }

    return { labels, rows, limit };
  }

  render () {
    // @todo: if minutes/hours then Filter by (60 [* 60] / (API.LOOM.POLL_INTERVAL / 1000)) = 360|60 / 15 = 24|4
    const values = this.getDiscrepancyValues(20);
    const count = values.length;
    const xAxis = this.getXAxis(values, 4);
    const yAxis = this.getYAxis(values);
    // Set last item if no index arg is provided
    const activeIndex = _.isFinite(this.state.chartItemActive) ? this.state.chartItemActive : count - 1;
    const activeValue = values[activeIndex];

    return (
      <div className="chart">
        <Chart full={true}>
          <Axis className="chart__axis--vertical" vertical={ true } ticks={ false } count={ yAxis.labels.length } labels={ yAxis.labels } />
          <Chart vertical={ true } full={ true }>
            { count > 0 ? <MarkerLabel count={ count } index={ activeIndex } label={ <Value value={`${activeValue}`} /> } /> : null }
            <Base height="small" width="full" />
            <Layers>
              <Grid rows={ yAxis.rows } />
              { count > 0 ? <Marker vertical={ true } count={ count } index={ activeIndex } /> : null }
              <Line values={ values } max={ yAxis.limit } activeIndex={ activeIndex } points={ true } />
              { count > 0 ? <HotSpots count={ count } index={ activeIndex } activeIndex={ activeIndex } onActive={ (i) => this.onActive(i) }/> : null }
            </Layers>
            <Axis className="chart__axis--horizontal" ticks={ false } tickAlign="end" count={ xAxis.labels.length } labels={ xAxis.labels } />
          </Chart>
        </Chart>

        <Paragraph className="chart__desired-state">{ `Desired state ${(activeValue > 0) ? 'not yet ' : ''}achieved` }</Paragraph>
      </div>
    );
  }
}

DeviationChart.propTypes = {
  discrepancies: discrepanciesProp,
};

export default DeviationChart;
