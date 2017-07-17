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
import _ from 'lodash';

/*
 * Utils
 */

// Returns an array of text angles and values for a given group and step.
function segmentAngle (d) {
  const start = d.startAngle / 2;
  const end = d.endAngle / 2;
  const item = parseInt(d.index, 10) + 1;
  const k = (end - start) / item;
  return [{ value: item, angle: item * k + d.startAngle }];
}

// Returns n as a float between lower and upper values
const permittedValue = (n, lower = 1, upper = 100) => _.clamp(parseFloat(n), parseFloat(lower), parseFloat(upper));

// Process a chord to have equal arc size & distribution, via startAngle/endAngle
const processChordAngle = (options, chord, percentage = 100, debug = false) => {
  const startAngle = chord.index * (options.nodeRad + options.arcPadding);
  const endAngle = startAngle + ((options.nodeRad / 100) * percentage);
  debug && console.debug('processChordAngle', startAngle, endAngle);

  return { ...chord, startAngle, endAngle };
};

// Return value in Radians for number of degrees in a circle
const getTotalRadians = (deg = 360) => {
  const value = permittedValue(deg, 0, 360);
  return value / ((value / 2) / Math.PI);
};

// Return value in Radians for each arc of a circle
const getArcRadian = (arcs = 1, arcPadding = 0) => (getTotalRadians() - arcPadding) / arcs;

// Process a chord's array-like object to have equal arc size & distribution
const processChords = (chords, { arcPadding }, ribbonWidths = {}) => {
  const options = {
    arcPadding,
    arcs: chords['groups'].length,
    totalRads: getTotalRadians(),
  };
  options.totalArcPadding = options.arcs * arcPadding;
  options.nodeRad = getArcRadian(options.arcs, options.totalArcPadding);

  _.each(chords, (chord, key) => {
    chords[key].source = processChordAngle(options, chord.source, ribbonWidths.source(chord.source.value) || chord.source.value);
    chords[key].target = processChordAngle(options, chord.target, ribbonWidths.target(chord.target.value) || chord.target.value);
  });

  // Handle groups
  chords.groups = _.map(chords.groups, (chord) => processChordAngle(options, chord));
  return chords;
};

const isArcActive = (activeId, d, _i) => activeId && activeId.logicalId === d.logicalId;

const isArcConnected = (arcsConnected = [], d) => !!_.find(arcsConnected, { logicalId: d.logicalId });

export {
  segmentAngle,
  permittedValue,
  getTotalRadians,
  getArcRadian,
  processChordAngle,
  processChords,
  isArcActive,
  isArcConnected,
};
