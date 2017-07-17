'use strict';

// Deps
import React, { Component } from 'react';
import _ from 'lodash';

// Helpers
import { metaProp, librarianProp } from '../../core/propTypes';

// Grommet
import Heading from 'grommet/components/Heading';

// ED Components
import Spinner from '../../core/components/Spinner';
import Grid from './Grid';

class MemoryMgmtFocus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldRender: false,
      shouldResize: false,
    };
    this.loadInterval = null;

    // Bind this method for use in add/removeEventListener calls.
    // See https://gist.github.com/Restuta/e400a555ba24daa396cc
    this.bound_onResize = _.debounce(this.onResize.bind(this), 150);
  }

  onResize (_e) {
    return this.setState({
      shouldRender: true,
      shouldResize: true,
    });
  }

  componentDidMount () {
    window.addEventListener('resize', this.bound_onResize, false);

    this.loadInterval = setInterval(() => {
      // Render only if data isReady and we allow a render
      if (this.props.meta.isReady && !this.state.shouldRender) {
        clearInterval(this.loadInterval);
        this.setState({ shouldRender: true });
      }
    }, 2000);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.bound_onResize, false);

    clearInterval(this.loadInterval);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.meta.isReady && nextState.shouldRender;
  }

  componentDidUpdate (_prevProps, prevState) {
    if ((prevState.shouldRender && this.state.shouldRender) || (prevState.shouldResize && this.state.shouldResize)) {
      // Reset shouldRender state
      this.setState({
        shouldRender: false,
      });
    } else {
      this.setState({
        shouldRender: true,
        shouldResize: true,
      });
    }
  }

  _generateCellData (cellCount, cellDistribution) {
    const cells = _.range(0, cellCount, 0);
    const distribution = _.reduce(cellDistribution, (prev, curr, i) => {
      const min = prev.length > 0 ? prev[i - 1].max : 0;
      prev.push({ ...curr, min, max: (min + curr.count) });
      return prev;
    }, []);

    return _.map(cells, () => {
      const selector = Math.random();
      const { colour = '' } = _.find(distribution, (item) => (selector >= item.min && selector < item.max)) || {};
      return { colour };
    });
  };

  getMemoryProportion (value) {
    return value / this.props.librarian.memory.total;
  }

  render () {
    const { meta, librarian } = this.props;
    const cells = librarian.maxBooks;
    const cellDistribution = [
      { id: 'allocated', colour: '#2AD2C9', count: this.getMemoryProportion(librarian.memory.allocated) },
      { id: 'available', colour: '#865cd6', count: this.getMemoryProportion(librarian.memory.available) },
      { id: 'notReady', colour: '#fd9a69', count: this.getMemoryProportion(librarian.memory.notReady) },
      { id: 'offline', colour: '#dc2878', count: this.getMemoryProportion(librarian.memory.offline) },
    ];

    const classNames = {
      wrapper: 'focus__center',
      chart: {
        wrapper: { 'chart-grid': true },
        grid: { 'chart-grid__canvas': true },
      },
    };

    const gridOptions = {
      cells: cells,
      cellSize: [6, 6, 2],
      data: this._generateCellData(cells, cellDistribution),
      scale: true,
      selector: `.chart-grid__wrapper`,
      classNames: classNames.chart
    };

    return (
      <div className="focus">
        <div className={ classNames.wrapper }>
          <Heading tag="h4" strong={ true }>Librarian book map</Heading>
          { meta.isReady && this.state.shouldRender ? <Grid options={ gridOptions } shouldResize={ this.state.shouldResize } /> : <Spinner /> }
        </div>
      </div>
    );
  }
}

MemoryMgmtFocus.propTypes = {
  meta: metaProp.isRequired,
  librarian: librarianProp.isRequired,
};

export default MemoryMgmtFocus;
