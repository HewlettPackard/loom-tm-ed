'use strict';

// Deps
import React from 'react';

// Helpers
import { pageProp } from '../../core/propTypes';

// Grommet
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';

// Render Switches
const DeclarativeMgmtInfo = (props) => (
  <div className="drawer__content">
    <Heading tag="h2">{ props.page.title }</Heading>
    <Paragraph>Traditional management systems are imperative. Administrators describe in a workflow how the system has to behave.</Paragraph>
    <Paragraph>Manageability for The Machine is declarative. Tell the system what needs to be done and the system calculates automatically what steps need to be taken to get there. Automation drives to and maintains the desired state through constant monitoring and course corrections.</Paragraph>
    <Paragraph>Automation is key to enabling massively complex systems to be configured and then kept up and running without needing an army of human experts.</Paragraph>
    <Paragraph>This tab shows a schematic of all the nodes in the system, showing the state of each compute, memory and fabric element, and indicating how far the system is from the desired state.</Paragraph>
  </div>
);

// PropTypes
DeclarativeMgmtInfo.propTypes = {
  page: pageProp,
};

export default DeclarativeMgmtInfo;
