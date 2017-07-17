'use strict';

// Deps
import React, { Component } from 'react';

// Grommet Components
import Box from 'grommet/components/Box';

class MonitoringDetails extends Component {
  render () {
    return (
      <aside className="dashboard__details">
        <Box size="full" pad="medium" colorIndex="grey-2">
        </Box>
        <Box size="full" pad="medium" colorIndex="grey-2">
          { this.props.page.title }
        </Box>
      </aside>
    );
  }
}

MonitoringDetails.propTypes = {
  page: React.PropTypes.shape({
      title: React.PropTypes.string.isRequired
    }).isRequired
};

export default MonitoringDetails;
