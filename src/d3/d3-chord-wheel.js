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
import * as d3 from 'd3';
import _ from 'lodash';

// Helpers
import { segmentAngle, permittedValue, getTotalRadians, processChords, isArcActive, isArcConnected } from './d3-utils';

// D3 functions
const generateArc = ({ inner, outer }) => d3.arc().innerRadius(inner).outerRadius(outer);

const generateArcValue = (radius, value, d) => generateArc({
  inner: radius.inner,
  outer: radius.inner + ((radius.size / 100) * permittedValue(value, 10, 100))
})(d);

const createClassName = (className) => `${rootClassName}__${className}`;

let rootClassName = '';

// Chord Wheel Element
const d3chordWheel = (rootNode, matrices, options) => {
  // Options
  const { className = rootClassName, diameter = 500, arcs = [], arcActive = {}, arcsConnected = [], groupings = [], onSelectSegment } = options;

  rootClassName = className;

  // Values: Sizes, Radius, Spacing, Angles
  const arcPadding = 0.015; // Space between arcs in Radians, for conversion to px see arcSpacing
  const arcSizeMin = 25;
  const arcSizeMax = 35;
  const arcSize = _.clamp(diameter / 20, arcSizeMin, arcSizeMax); // Depth of the arcs in pixels
  const arcCount = _.filter(arcs, arc => !!arc.length).length;
  const groupingAngle = 360 / groupings.length;
  const groupingArcWidth = 1;
  const groupingArcEndCapLength = arcSize / 3;
  const groupingArcSize = groupingArcEndCapLength * 2;
  const groupingArcSpacing = groupings.length > 0 ? groupingArcSize * 1.5 : 0;
  const groupingArcEndCapIndent = (groupingArcSpacing / 2) - (groupingArcEndCapLength / 2);
  const outerRadius = Math.ceil(diameter / 2);
  const outerSpacing = groupings.length > 0 ? groupingArcSpacing : 0;
  const arcSpacing = Math.ceil(Math.max(1, outerRadius * arcPadding));
  const innerRadius = outerRadius - ((arcSize * arcCount) + (arcSpacing * (arcCount - 1)) + outerSpacing);
  const isMatrixActive = !!matrices.active.length;

  let svg, chordsDefault, chordsActive, svgChord, svgChordActive, segmentNodes, segmentGroups;

  // SVG
  if (!rootNode) {
    svg = d3.select('body').append('svg');
  } else {
    svg = d3.select(rootNode);
  }

  svg.attr('class', className)
    .attr('width', diameter)
    .attr('height', diameter);

  // Chord data
  chordsDefault = d3.chord().padAngle(arcPadding).sortSubgroups(d3.descending)(matrices.default);
  chordsDefault = processChords(chordsDefault, { arcPadding }, {
    source: () => 1,
    target: () => 1
  });

  // Active Chord data
  if (isMatrixActive) {
    chordsActive = d3.chord().padAngle(arcPadding).sortSubgroups(d3.descending)(matrices.active);
    chordsActive = processChords(chordsActive, { arcPadding }, {
      source: (value) => permittedValue(value, 1, 100 / matrices.active.length),
      target: (value) => permittedValue(value, 25, 25)
    });
  }

  // Arcs
  const getArcRadius = (i) => {
    const arcSpacers = arcSpacing * i;
    return {
      inner: innerRadius + arcSpacers + (arcSize * i),
      outer: innerRadius + (arcSize * (i + 1)) + arcSpacers
    };
  };

  const chordsGroupsWithArcIds = _.map(arcs[0], (arc, i) => {
    if (!!arc && !!arc.logicalId) {
      chordsDefault.groups[i].logicalId = arc.logicalId;
    }

    return chordsDefault.groups[i];
  });

  chordsDefault.groups = chordsGroupsWithArcIds;

  // Default Chord data
  svgChord = svg.append('g')
    .attr('class', createClassName('wrapper'))
    .attr('transform', `translate(${outerRadius}, ${outerRadius})`)
    .datum(chordsDefault);

  // Default Ribbons
  svgChord.append('g')
    .attr('class', createClassName('ribbons'))
    .selectAll('path')
    .data(chordsDefault => chordsDefault)
    .enter().append('path')
    .attr('class', createClassName('ribbon'))
    .attr('d', d3.ribbon().radius(innerRadius - arcSpacing));

  // Active Chord data
  if (isMatrixActive) {
    svgChordActive = svgChord
      .append('g')
      .attr('class', createClassName('ribbons'))
      .attr('class', createClassName('ribbons--active'))
      .datum(chordsActive);

    // Active Ribbons
    svgChordActive.selectAll('path')
      .data(chordsActive => chordsActive)
      .enter().append('path')
      .attr('class', createClassName('ribbon'))
      .attr('d', d3.ribbon().radius(innerRadius - arcSpacing));
  }

  /**
   * Wheel
   */
  if (arcCount > 0) {
    // Segments
    segmentNodes = svgChord.append('g')
        .attr('class', 'segments')
        .selectAll('g')
        .data(chordsDefault => chordsDefault.groups)
        .enter().append('g')
        .attr('class', 'segment')
        .classed(createClassName('segment--active'), isArcActive.bind(this, arcActive))
        .classed(createClassName('segment--connected'), isArcConnected.bind(this, arcsConnected));

    if (_.isFunction(onSelectSegment)) {
      segmentNodes.on('click touchend', (e) => {
        d3.event.preventDefault();
        d3.select(this);
        return onSelectSegment(e.logicalId);
      })
    }

    segmentGroups = svgChord.append('g').attr('class', createClassName('segment-groups'));

    /**
     * Segment Arcs
     */
    _.each(arcs, (arcLayer, arcLayerIndex, arcLayers) => {
      if (arcLayer.length === 0) {
        return;
      }

      // Fix scenarios where the middle arc is not displayed. Result should be neat arcs with no gaps
      const arcLayerIndexRadius = (arcLayerIndex > 0 && arcLayers[arcLayerIndex-1].length === 0) ? arcLayerIndex - 1 : arcLayerIndex;

      const arcRadius = getArcRadius(arcLayerIndexRadius, arcLayers.length);
      const layer = arcLayerIndex + 1;
      const segmentArc = segmentNodes.append('g').attr('class', `segment__arc segment__arc--layer-${layer}`);

      let segmentArcText;

      // Segment Arc: Background
      segmentArc.append('path')
        .attr('d', generateArc(arcRadius))
        .attr('class', `segment__arc-bg`);

      segmentArc
        .filter((_d, i) => !!arcLayer[i])
        .append('path')
        .attr('d', (d, i) => generateArcValue(Object.assign(arcRadius, { size: arcSize }), arcLayer[i] || 0, d))
        .attr('class', `segment__arc-value`);

      segmentArcText = segmentArc.selectAll(`.segment__arc-text--layer-${layer}`)
        //.filter((d, i) => !!arcLayer[d.value-1].text)
        .data(segmentAngle)
        .enter().append('g')
        .attr('class', `segment__arc-text`)
        .attr('transform', d => {
          const rotate = ((d.angle * 180) / Math.PI) -90;
          const translate = arcRadius.inner + (arcSize/2);

          return `rotate(${rotate}) translate(${translate},0)`;
        });

      segmentArcText
        .filter((d, _i) => !!arcLayer[d.value-1].text)
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '.35em')
        .attr('transform', d => `rotate(${90-(d.angle*180/Math.PI)})`)
        .style('text-anchor', 'middle')
        .text((d, _i) => arcLayer[d.value-1].text);
    });
  }

  /**
   * Segment Groups
   */
  let segmentGroupNodes = segmentGroups.selectAll('.segment-group')
    .data(groupings)
    .enter().append('g')
    .attr('transform', (_d, i) => `rotate(${groupingAngle*i})`)
    .attr('class', 'segment-group');

  // Arc line
  segmentGroupNodes.append('path')
    .attr('id', (_d, i) => `segment-group__arc--item-${i+1}`)
    .attr('class', 'segment-group__arc')
    .attr('d', (_d, _i, coll) => d3.arc()({
      innerRadius: outerRadius - groupingArcSize,
      outerRadius: outerRadius - (groupingArcSize - groupingArcWidth),
      startAngle: 0,
      endAngle: (getTotalRadians() / coll.length) - arcPadding
    }))
    .attr('clip-path', (_d, i) => `#segment-group__text--item-${i+1}`);

  // Segment group rotated by 90 deg
  let segmentGroupNodesRotated = segmentGroups.selectAll('.segment-group--rotated')
    .data(groupings)
    .enter().append('g')
    .attr('transform', (_d, i) => `rotate(${groupingAngle*(i+1)})`)
    .attr('class', 'segment-group--rotated');

  // Arc line end-caps
  segmentGroupNodes
    .append('line')
    .attr('x1', 0)
    .attr('y1', groupingArcEndCapIndent)
    .attr('x2', 0)
    .attr('y2', groupingArcEndCapIndent + groupingArcEndCapLength)
    .attr('stroke-width', '1')
    .attr('transform', `translate(1, -${outerRadius-5})`)
    .attr('class', 'segment-group__arc-endcap');

  segmentGroupNodesRotated
    .append('line')
    .attr('x1', 0)
    .attr('y1', groupingArcEndCapIndent)
    .attr('x2', 0)
    .attr('y2', groupingArcEndCapIndent + groupingArcEndCapLength)
    .attr('stroke-width', '1')
    .attr('transform', `translate(-${arcSpacing}, -${outerRadius-5})`)
    .attr('class', 'segment-group__arc-endcap');

  // Arc line text
  segmentGroupNodes.append('text')
    .attr('id', (_d, i) => `segment-group__text--item-${i+1}`)
    .attr('class', 'segment-group__arc-text')
    .attr('dx', 0)
    .attr('dy', -5)
    .attr('text-anchor', 'middle')
    .append('textPath')
    .text(d => d.title)
    .attr('xlink:href', (_d, i) => `#segment-group__arc--item-${i+1}`)
    .attr('class', 'segment-group__arc-text-path')
    .attr('startOffset', '25%');

  return svg.node();
};

export default d3chordWheel;
