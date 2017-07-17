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
/**
 * d3-grid - GridSvg
 *
 * Created by nijk on 13/09/2016.
 */

'use strict';

import * as d3 from 'd3';
import classnames from 'classnames';

import Grid from './grid';

// GridSvg
export default class GridSvg extends Grid {
  /**
   * DOM elements
   * @returns {GridSvg}
   */
  setDOM () {
    const selector = this.opts.selector || 'body';
    this.$parent = this.$parent || document.querySelector(selector);
    this.$grid = d3.select(selector).append('svg');

    return this;
  }

  /**
   * HTML5 Canvas Context from D3 selection
   * @param elem
   * @returns {*|CanvasRenderingContext2D}
   */
  getContext (elem) {
    return elem.node().getContext('2d');
  }

  /**
   * Build the Grid
   * @returns {GridSvg}
   * @private
   */
  _buildGrid () {
    const { width, height, classes } = this.opts;

    this.$grid.attr('class', classnames(classes.grid))
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    return this;
  }

  /**
   * Build the container and the cells for each square/circle
   * @returns {GridSvg}
   * @private
   */
  _buildContainer () {
    const { width, height, classes } = this.opts;

    this.$container = this.$grid.append('g');

    this.$container.attr('class', classnames(classes.container))
      .attr('width', width)
      .attr('height', height);
  }

  /**
   * Build the squares/circles
   * @returns {GridSvg}
   * @private
   */
  _buildContents () {
    const { shape, data, cellSize } = this.opts;

    const calcX = this.calculateCellX.bind(this, this.cellOffset.x);
    const calcY = this.calculateCellY.bind(this, this.cellOffset.y);

    switch (shape) {
      case 'circle':
        const radius = cellSize[0] / 2;

        this.$container.selectAll('circle')
          .data(data)
          .enter().append('circle')
          .attr('cx', calcX)
          .attr('cy', calcY)
          .attr('r', radius)
          .style("fill", random.colour);

        break;
      default:
        this.$container.selectAll('rect')
          .data(data)
          .enter().append('rect')
          .attr('x', calcX)
          .attr('y', calcY)
          .attr('width', cellSize[0])
          .attr('height', cellSize[1])
          .style("fill", random.colour);
        break;
    }

    return this;
  }
}
