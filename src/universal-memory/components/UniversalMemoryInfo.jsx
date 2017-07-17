'use strict';

// Deps
import React from 'react';

// Helpers
import { pageProp } from '../../core/propTypes';

// Grommet
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';

// Render Switches
const UniversalMemoryInfo = (props) => (
  <div className="drawer__content">
    <Heading tag="h2">{ props.page.title }</Heading>
    <Paragraph>At the heart of our Memory-Driven Computing architecture is a web of high-speed, low-latency interconnects that we call the fabric. Each physical node consists of a CPU (part of the SoC - System on Chip) and a block of memory, independently connected to the fabric.</Paragraph>
    <Paragraph>This tab shows activity across the fabric in real time as applications are run.</Paragraph>
    <Paragraph>The three dials on the left show overall system activity.</Paragraph>
    <Paragraph>The “Rack Overview” on the right shows the physical arrangement of nodes in a rack. The graphic in the middle shows the nodes arranged in a ring.</Paragraph>
    <Paragraph>If you click on a specific node in either place, you can see how the CPU in that node is accessing fabric-attached memory across the system. You can click the check boxes to overlay more data about the amount of traffic on the fabric at each node and the CPU utilization. Detailed information about the stage of the selected node is shown below the rack overview.</Paragraph>
    <Paragraph>Note that because the CPU and memory are independently connected to the fabric, the CPU is not involved in servicing incoming remote memory accesses and so the CPU utilization only reflects local processing.</Paragraph>
  </div>
);

// PropTypes
UniversalMemoryInfo.propTypes = {
  page: pageProp,
};

export default UniversalMemoryInfo;
