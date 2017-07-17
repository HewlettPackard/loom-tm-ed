'use strict';

// Deps
import React, { Component, PropTypes } from 'react';

// Helpers
import { APP } from '../../core/constants';
import { metaProp, enclosuresProp, nodeProp, socProp, drawerProp } from '../../core/propTypes';

// Grommet Components
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';

// ED Components
import Drawer from '../../core/components/Drawer';
import Spinner from '../../core/components/Spinner';
import Enclosures from '../../core/components/Enclosures';
import UniversalMemoryInfo from './UniversalMemoryInfo';
import Node from './Node';

class UniversalMemoryDetails extends Component {
  onSelectNode (onToggleNode, logicalId) {
    onToggleNode(logicalId);
  }

  _renderNodeInfo () {
    const { nodeActive, nodeActiveEnclosure, nodeActiveSoc } = this.props;

    if (!nodeActive) {
      return ( <Paragraph tag="h4" strong={true}>Select a node from the Chord diagram or Rack overview.</Paragraph> );
    }

    return (
      <div className="node-info">
        <Heading key="node-info-id" tag="h4" strong={true}>Node { nodeActive.id } ({ nodeActiveEnclosure.title })</Heading>
        <div className="columns node-info__list">
          <div className="column">
            <Heading key="node-info-power-state-title" tag="h6" strong={true}>Power State</Heading>
            <Paragraph key="node-info-power-state">{ nodeActiveSoc.powerState || APP.UNKNOWN }</Paragraph>
            <Heading key="node-info-cpu-usage-title" tag="h6" strong={true}>CPU Usage</Heading>
            <Paragraph key="node-info-cpu-usage">{ nodeActive.usage.cpu }%</Paragraph>
            <Heading key="node-info-fabric-usage-title" tag="h6" strong={true}>Fabric Usage</Heading>
            <Paragraph key="node-info-fabric-usage">{ nodeActive.usage.fabric }%</Paragraph>
            <Heading key="node-info-shelves-title" tag="h6" strong={true}>No. of Shelves</Heading>
            <Paragraph key="node-info-shelves">{ nodeActiveSoc.shelvesAccessing }</Paragraph>
            <Heading key="node-info-books-title" tag="h6" strong={true}>No. of Books</Heading>
            <Paragraph key="node-info-books">{ nodeActiveSoc.booksAccessing }</Paragraph>
          </div>
          <div className="column">
            <Heading key="node-info-dram-usage-title" tag="h6" strong={true}>DRAM Usage</Heading>
            <Paragraph key="node-info-dram-usage">{ nodeActiveSoc.dramUtilisation }%</Paragraph>
            <Heading key="node-info-network-in-title" tag="h6" strong={true}>Network In</Heading>
            <Paragraph className="case-literal" key="node-info-network-in">{ nodeActiveSoc.networkIn } b/sec</Paragraph>
            <Heading key="node-info-network-out-title" tag="h6" strong={true}>Network Out</Heading>
            <Paragraph className="case-literal" key="node-info-network-out">{ nodeActiveSoc.networkOut } b/sec</Paragraph>
            <Heading key="node-info-running-os-manifest-title" tag="h6" strong={true}>OS Manifest</Heading>
            <Paragraph key="node-info-running-os-manifest">{ nodeActiveSoc.runningOsManifest }</Paragraph>
          </div>
        </div>
      </div>
    );
  }

  render () {
    const { meta, page, enclosures, nodeActive, onToggleNode } = this.props;

    return (
      <aside className="dashboard__details">
        <div className="dashboard__details-info">
          <Heading tag="h4" strong={true}>Rack overview</Heading>
          {
            meta.isReady ?
              <Enclosures
                key="universal-memory-enclosures"
                enclosures={ enclosures }
                nodeActive={ nodeActive }
                nodeComponent={ Node }
                onSelectNode={ this.onSelectNode.bind(this, onToggleNode) }
              />
            :
              <Spinner />
          }
        </div>
        <div className="dashboard__details-info dashboard__details-info--stretch">
          { this._renderNodeInfo.bind(this)() }
        </div>
        <Drawer classNames={ { 'dashboard__details-info': true } } component={ <UniversalMemoryInfo page={ page } /> } { ...this.props } />
      </aside>
    );
  }
}

UniversalMemoryDetails.propTypes = {
  onToggleDrawer: PropTypes.func.isRequired,
  onToggleNode: PropTypes.func.isRequired,
  meta: metaProp.isRequired,
  page: React.PropTypes.shape({
    title: React.PropTypes.string.isRequired
  }).isRequired,
  forceUpdate: PropTypes.bool,
  enclosures: enclosuresProp,
  nodeActive: nodeProp,
  nodeActiveSoc: socProp,
  drawer: drawerProp,
};

export default UniversalMemoryDetails;
