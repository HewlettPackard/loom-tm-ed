'use strict';

// Deps
import React, { PureComponent, PropTypes } from 'react';
import _ from 'lodash';

// Helpers
import { APP } from '../../core/constants';
import { getSiblings, getAvailableWidth, getAvailableHeight } from '../../core/helpers/dom';
import { pageProp, metaProp, demoModeProp, matricesProp, enclosuresProp, nodesProp, nodeProp } from '../../core/propTypes';

// Grommet
import Heading from 'grommet/components/Heading';

// Components
import Spinner from '../../core/components/Spinner';
import OptionBox from '../../core/components/OptionBox';
import Chord from './Chord';

class UniversalMemoryFocus extends PureComponent {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      isMounted: false,
      canDisplayChart: false,
      isChartDataReady: false
    };
    
    // Demo Mode IntervalId
    this.demoModeIntervalId = null;

    // Bind these methods for use in add/removeEventListener calls. See https://gist.github.com/Restuta/e400a555ba24daa396cc
    this.bound_forceUpdate = this.forceUpdate.bind(this);
    this.bound_onResize = _.debounce(this.onResize.bind(this), 150);
    this.bound_demoMode = this._demoMode.bind(this);

    // Bind
    this.onSelectSegment = this.onSelectSegment.bind(this);
    this.setDemoMode = this.setDemoMode.bind(this);
    this.clearDemoMode = this.clearDemoMode.bind(this);
  }

  onChangeOptionBox (e) {
    const type = e.target.id.replace('option-', '');
    this.props.onToggleUsage(type);
  }

  onSelectSegment (logicalId) {
    this.props.onToggleNode(logicalId);
  }

  onResize (_e) {
    return this.bound_forceUpdate();
  }

  componentDidMount () {
    window.addEventListener('resize', this.bound_onResize, false);
    // Force update to render Chord Chart at the correct size
    this.setState({ isMounted: true });
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.bound_onResize, false);
    this.clearDemoMode();
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.forceUpdate) {
      return nextProps.forceUpdate;
    }

    return nextProps.meta.hasNewData && nextState.isChartDataReady/* && !(this.props.demoMode && nextProps.meta.hasNewData)*/;
  }
  
  componentWillReceiveProps (nextProps) {
    if (!this.state.isChartDataReady) {
      const isChartDataReady = !!nextProps.enclosures && nextProps.enclosures.length > 0 && nextProps.nodes.length > 0 && nextProps.matrices.default && nextProps.matrices.default.length > 0;
      
      this.setState({ isChartDataReady });
    }
  }

  componentWillUpdate (nextProps) {
    if ((!this.props.demoMode && nextProps.demoMode) || (nextProps.demoMode && !this.demoModeIntervalId)) {
      this.setDemoMode();
    } else if (this.props.demoMode && !nextProps.demoMode) {
      this.clearDemoMode();
    }
  }

  componentDidUpdate (_prevProps, prevState) {
    if (!prevState.isChartDataReady && this.state.isChartDataReady) {
      this.setState({
        canDisplayChart: true
      });
    }
  }

  _demoMode () {
    const { nodes, nodeActive } = this.props;
    let nodeToActivate = nodes[0];

    if (nodeActive) {
      const index = _.findIndex(nodes, { logicalId: nodeActive.logicalId });
      const nextIndex = (nodes.length > index + 1) ? index + 1 : 0;
      nodeToActivate = nodes[nextIndex];
    }

    if (nodeToActivate) {
      this.onSelectSegment(nodeToActivate.logicalId);
    }
  }

  setDemoMode () {
    this.demoModeIntervalId = setInterval(this.bound_demoMode, APP.DEMO_MODE_INTERVAL);
  }

  clearDemoMode () {
    clearInterval(this.demoModeIntervalId);
    this.demoModeIntervalId = null;
  }

  _renderChord (classNames) {
    const { enclosures, nodes, nodeActive, nodesConnectedToActive, matrices, isFabricSelected, isCPUSelected } = this.props;
    const $wrapper = document.querySelector(`.${classNames.chart.wrapper}`);
    const $chart = document.querySelector(`.${classNames.chart.chord}`);
    const $spinner = document.querySelector(`.${classNames.chart.wrapper} .icon__spinner`);
    const chartSiblings = getSiblings($chart ? $chart : $spinner);
    const chartSpacing = 50;
    const chartDiameterMin = 400;
    const chartDiameter = Math.min(getAvailableWidth($wrapper), getAvailableHeight($wrapper, chartSiblings)) - (chartSpacing * 2);

    const chordOptions = {
      className: classNames.chart.chord,
      diameter: (chartDiameter > chartDiameterMin) ? chartDiameter : chartDiameterMin,
      arcs: [
        _.map(nodes, (node) => ({ logicalId: `${node.logicalId}`, title: `${node.name}`, text: `${node.id}` })),
        (isFabricSelected) ? _.map(nodes, (node) => node.usage.fabric) : [],
        (isCPUSelected) ? _.map(nodes, (node) => node.usage.cpu) : []
      ],
      arcActive: nodeActive,
      arcsConnected: nodesConnectedToActive,
      groupings: enclosures,
      onSelectSegment: this.onSelectSegment
    };

    return ( <Chord matrices={ matrices } options={ chordOptions } /> );
  }

  _renderChordTitle () {
    const { nodeActive } = this.props;

    return (
      <div className="focus__node-active floating">
        {
          nodeActive && nodeActive.id ?
            ( <Heading tag="h4" strong={ true }>Fabric Attached Memory used by System-on-Chip on Node { nodeActive.id }</Heading> )
          :
            null
        }
      </div>
    );
  }

  _renderOptionBoxes (classNames) {
    const { isFabricSelected, isCPUSelected } = this.props;

    return (<div className="chart__footer option-boxes">
      <OptionBox
        classNames={ classNames.optionBoxes.fabric }
        onChange={ e => this.onChangeOptionBox(e) }
        label="Fabric Usage"
        description="Amount of traffic to/from the Fabric Attached Memory of each node"
        field={{ id: 'option-fabric', checked: isFabricSelected }}/>
      <OptionBox
        classNames={ classNames.optionBoxes.cpu }
        onChange={ e => this.onChangeOptionBox(e) }
        label="CPU Usage"
        description="Amount of CPU Utilisation of the SoC on each node"
        field={{ id: 'option-cpu', checked: isCPUSelected }}/>
    </div>);
  }

  render () {
    const { page } = this.props;
    const shouldRender = this.state.isMounted && this.state.isChartDataReady;
    const shouldRenderChart = this.state.isMounted && this.state.canDisplayChart;

    const defaultClassNames = {
      chart: {  wrapper: 'chart__wrapper', chord: 'chart-chord' },
      optionBoxes: { 'option-box': true, 'option-box--active': false }
    };

    const classNames = {
      chart: defaultClassNames.chart,
      optionBoxes: {
        fabric: Object.assign({}, defaultClassNames.optionBoxes, { 'option-box--fabric': true }),
        cpu: Object.assign({}, defaultClassNames.optionBoxes, { 'option-box--cpu': true }),
      }
    };

    return (
      <div className="focus">
        { !!page.subtitle ? <Heading tag="h4" strong={ true }>{ page.subtitle }</Heading> : null }
        <div className="focus__center">
          <div className={ classNames.chart.wrapper }>
            { shouldRender ? this._renderChordTitle.bind(this)() : null }
            { shouldRenderChart ? this._renderChord.bind(this)(classNames) : ( <Spinner /> ) }
            { shouldRender ? this._renderOptionBoxes.bind(this)(classNames) : null }
          </div>
        </div>
      </div>
    );
  }
}

UniversalMemoryFocus.propTypes = {
  onToggleNode: PropTypes.func.isRequired,
  onToggleUsage: PropTypes.func.isRequired,
  page: pageProp.isRequired,
  meta: metaProp.isRequired,
  forceUpdate: PropTypes.bool,
  demoMode: demoModeProp,
  matrices: matricesProp,
  enclosures: enclosuresProp,
  nodes: nodesProp,
  nodeActive: nodeProp,
  nodesConnectedToActive: nodesProp,
  isFabricSelected: PropTypes.bool.isRequired,
  isCPUSelected: PropTypes.bool.isRequired
};

export default UniversalMemoryFocus;
