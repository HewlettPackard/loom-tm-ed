/*******************************************************************************
 * (c) Copyright 2017 Hewlett Packard Enterprise Development LP Licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance with the License. You
 * may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 *******************************************************************************/
'use strict';

// Deps
import { connect } from 'react-redux';
import _ from 'lodash';

// Helpers & Defaults
import utils from '../helpers/utils';
import defaultUsageWithTitles from '../defaults/usageWithTitles';

// Selectors
import getSelectors from '../selectors';

// ED Components
import UsageMeters from '../components/UsageMeters';

import $ from 'jquery';

var fabric = 0;

const mapStateToProps = (state, _props) => {
   var usage = utils.formatFloats(getSelectors().getInstance(state).usage, 2);

    let BASEREF = "http://localhost:58580/";
    $.ajaxSetup({
      headers : {
        'Accept' : 'application/json; version=1.0',
      },
    });

    $.getJSON(BASEREF + 'fab/', {}, function(resp) {
        fabric = resp.fabric.percentage;
    });

    if(fabric != -1){
        usage.fabric = fabric;
        usage = utils.formatFloats(usage, 2);
    }else{
        usage.fabric = "No traffic";
    }


  return {
    meta: state.loom.meta,
    usage: _.merge({}, defaultUsageWithTitles, {
      cpu: { value: usage.cpu },
      fam: { value: usage.fam },
      fabric: { value: usage.fabric }
    }),
  };
};

const Usage = connect(
  mapStateToProps
)(UsageMeters);

export default Usage;
