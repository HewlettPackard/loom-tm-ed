'use strict';

// Deps
import React, { Component, PropTypes } from 'react';

// D3 Elements
import { GridCanvas } from '../../d3/d3-grid/';

class Grid extends Component {
  constructor (props) {
    super(props);
    this.d3node = null;
    this.gridCanvas = null;

    this.state = {
      shouldRender: true,
    }
  }

  componentDidMount () {
    this.gridCanvas = new GridCanvas(this.props.options, this.d3node);
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.shouldResize && nextProps.shouldResize) {
      this.setState({ shouldRender: true });
    }
  }

  componentDidUpdate (prevProps, _prevState) {
    if (prevProps.shouldResize && this.props.shouldResize) {
      this.gridCanvas.resize(this.d3node, this.props.options, true);
    }
  }

  render () {
    if (this.state.shouldRender) {
      return ( <div className="chart-grid__wrapper" ref={ (node) => this.d3node = node }/> );
    } else {
      return null;
    }
  }
}

Grid.propTypes = {
  options: PropTypes.shape({
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    cells: PropTypes.number.isRequired,
    cellSize: PropTypes.arrayOf(PropTypes.number.isRequired),
    scale: PropTypes.bool,
  }).isRequired,
};

export default Grid;
