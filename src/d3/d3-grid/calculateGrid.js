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

import _ from 'lodash';

export default class CalculateGrid {
  constructor (window = window) {
    this.window = window;
    
    this.defaults = {
      width: 100,
      height: 100,
      cellSize: [8, 8, 2],
      minCellSize: [4, 4, 1],
      cells: 100,
      scale: false,      
    };
    
    this.$el = null;
    this.opts = {};

    return this;
  }

  /**
   * Set Options
   * @param opts
   * @returns {CalculateGrid}
   */
  setOpts (opts) {
    this.opts = _.merge({}, this.opts, opts);
    return this;
  }

  /**
   * Set Size props
   * @returns {CalculateGrid}
   */
  setSize () {
    const computedStyle = this.window.getComputedStyle(this.$el);
    const padding = {
      x: parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight),
      y: parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)
    };

    let { width, height, scale } = this.opts;
    let elWidth, elHeight;

    elWidth = this.$el.clientWidth;
    elHeight = this.$el.clientHeight;

    elWidth -= padding.x;
    elHeight -= padding.y;

    width = (scale || width > elWidth) ? elWidth : width || this.defaults.width;
    height = (scale || height > elHeight) ? elHeight : height || this.defaults.height;

    return this.setOpts({ width, height, scale });
  }

  /**
   * Set Grid props
   * @returns {CalculateGrid}
   */
  setGrid () {
    let { cells, width, height, grid, cellSize } = this.opts;
    let side, cols, rows;

    if (cellSize.length === 3) {
      cols = Math.floor((width - cellSize[2]) / (cellSize[0] + cellSize[2]));
      rows = Math.floor((height - cellSize[2]) / (cellSize[1] + cellSize[2]));
    } else {
      side = Math.sqrt(cells);
      side = side > 1 ? Math.floor(side) : 1;
      cols = rows = side;
    }

    grid = [cols, rows];

    return this.setOpts({ cells, width, height, grid, cellSize });
  }

  /**
   * Set Cell props
   * @returns {CalculateGrid}
   */
  setCell () {
    let { cells, width, height, grid, cellSize } = this.opts;
    const cellWidth = Math.floor((width / grid[0]) * 0.9);
    const cellHeight = Math.floor((height / grid[1]) * 0.9);
    const cellGutter = Math.ceil(cellWidth * 0.1);
    cellSize = [cellWidth, cellHeight, cellGutter];

    return this.setOpts({ cells, width, height, grid, cellSize });
  }

  recalculateCellSize () {
    let { cells, width, height, cellSize, minCellSize } = this.opts;
    let cell, gutter;

    const pixels = width * height;
    const totalCell = Math.floor(Math.sqrt(pixels / cells));

    if (totalCell > (minCellSize[0] + minCellSize[2])) {
      gutter = Math.floor(_.clamp((totalCell * 0.2), minCellSize[2], cellSize[2]));
      cell = Math.floor(_.clamp((totalCell - gutter), minCellSize[0], cellSize[0]));
    } else {
      gutter = minCellSize[2];
      cell = minCellSize[0];
    }

    return this.setOpts({
      cellSize: [cell, cell, gutter]
    });
  }

  /**
   * Calculate all props
   * @param $el
   * @param opts
   * @returns {*}
   */
  calculate ($el, opts, force = false) {
    // Set properties
    this.$el = $el;
    this.opts = _.merge({}, this.defaults, opts);

    // Set width & height
    this.setSize();

    // Set columns & rows
    if (force || !this.opts.grid || (this.opts.grid && this.opts.grid.length !== 2)) {
      this.setGrid();
    }

    // Set cellSize
    if (!this.opts.cellSize || (this.opts.cellSize && this.opts.cellSize.length !== 3)) {
      this.setCell();
    }

    // Recalculate cellSize
    if (this.opts.grid[0] * this.opts.grid[1] < this.opts.cells) {
      this.recalculateCellSize();
      this.setGrid();
    }

    if (!this.opts.data) {
      this.setOpts({
        data: _.range(0, this.opts.cells, 0),
      });
    }

    return this.opts;
  }
}
