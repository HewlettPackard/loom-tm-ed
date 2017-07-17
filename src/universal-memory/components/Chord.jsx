'use strict';

// Deps
import { Component, PropTypes } from 'react';
import ReactFauxDOM from 'react-faux-dom';

// Helpers
import { matricesProp } from '../../core/propTypes';

// D3 Elements
import d3chordWheel from '../../d3/d3-chord-wheel';

class Chord extends Component {
  render () {
    const d3node = ReactFauxDOM.createElement('svg');
    const svg = d3chordWheel(d3node, this.props.matrices, this.props.options);

    // Render it to React elements.
    return svg.toReact();
  }
}

Chord.propTypes = {
  options: PropTypes.shape({
    className: PropTypes.string,
    diameter: PropTypes.number,
    arcs: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.number.isRequired,
          PropTypes.shape({
            title: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired
          }),
        ]).isRequired
      ).isRequired
    ).isRequired
  }).isRequired,
  matrices: matricesProp.isRequired
};

export default Chord;
