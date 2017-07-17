'use strict';

// Deps
import React from 'react';

// Helpers
import { pageProp } from '../../core/propTypes';

// Grommet
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';

// Render Switches
const MemoryMgmtInfo = (props) => (
  <div className="drawer__content">
    <Heading tag="h2">{ props.page.title }</Heading>
    <Paragraph>This tab shows the fabric-attached memory the way a processor sees it. Not chopped up into discrete parts on separate circuit boards but as a massive, flat address space.</Paragraph>
    <Paragraph>Memory is managed by a service called the Librarian. The name comes from the fact that memory is allocated in blocks called “books”, which are housed in larger areas of memory called “shelves”. The librarian has several functions:</Paragraph>
    <ul>
      <li>Keeps an inventory of physical components</li>
      <li>Allocates and deallocates memory at the request of apps running on CPUs</li>
      <li>Tracks permissions so that apps only access/read/write as allowed</li>
      <li>Maps physical to virtual addresses</li>
    </ul>
    <Paragraph>The schematic shows the state of each book. A summary of the total memory in each state is shown on the right. As a workload runs, you will see a change in data allocation across the memory.</Paragraph>
  </div>
);

// PropTypes
MemoryMgmtInfo.propTypes = {
  page: pageProp,
};

export default MemoryMgmtInfo;
