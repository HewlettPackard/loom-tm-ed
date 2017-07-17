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
 * d3-grid - GridCanvas
 *
 * Created by nijk on 13/09/2016.
 */

'use strict';

import * as d3 from 'd3';
import classnames from 'classnames';

import Grid from './grid';

// GridCanvas
export default class GridCanvas extends Grid {
  /**
   * DOM elements
   * @returns {GridCanvas}
   */
  setDOM () {
    const selector = this.opts.selector || 'body';
    this.$grid = this.$rootNode ? d3.select(this.$rootNode).append('canvas') : d3.select(selector).append('canvas');

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
   * @returns {GridCanvas}
   * @private
   */
  _buildGrid () {
    const { width, height, classes } = this.opts;
    const context = this.getContext(this.$grid);

    this.$grid
      .attr('class', classnames(classes.grid))
      .attr('width', width)
      .attr('height', height);

    context.clearRect(0, 0, width, height);

    return this;
  }

  /**
   * Build the container and the cells for each square/circle
   * @returns {GridCanvas}
   * @private
   */
  _buildContainer () {
    const { data, cellSize } = this.opts;
    this.$container = d3.select(document.createElement('grid'));

    const calcX = this.calculateCellX.bind(this, this.cellOffset.x);
    const calcY = this.calculateCellY.bind(this, this.cellOffset.y);

    this.$container.selectAll('cell')
      .data(data)
      .attr('x', calcX)
      .attr('y', calcY)
      .attr('width', cellSize[0])
      .attr('height', cellSize[1]);

    this.$container.selectAll('grid')
      .data(data)
      .enter()
      .append('cell')
      .attr('x', calcX)
      .attr('y', calcY)
      .attr('width', cellSize[0])
      .attr('height', cellSize[1])
      .attr('fillStyle', (d) => d.colour);

    return this;
  }

  /**
   * Build the squares/circles
   * @returns {GridCanvas}
   * @private
   */
  _buildContents () {
    const context = this.getContext(this.$grid);
    const { shape, cellSize } = this.opts;

    switch (shape) {
      case 'circle':
        const endAngle = 2 * Math.PI;
        const radius = cellSize[0] / 2;

        this.$container.selectAll('cell').each((_d, i, nodes) => {
          const node = d3.select(nodes[i]);

          context.beginPath();
          context.fillStyle = node.attr('fillStyle');
          context.arc(node.attr('x'), node.attr('y'), radius, 0, endAngle);
          context.fill();
          context.closePath();
        });
        break;
      default:
        this.$container.selectAll('cell').each((_d, i, nodes) => {
          const node = d3.select(nodes[i]);

          context.beginPath();
          context.fillStyle = node.attr('fillStyle');
          context.fillRect(node.attr('x'), node.attr('y'), cellSize[0], cellSize[1]);
          context.closePath();
        });
        break;
    }

    return this;
  }
}
