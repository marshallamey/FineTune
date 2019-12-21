import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scaleLinear } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';

export default class Bars extends Component {
  constructor(props) {
    super(props);
    const { maxValue } = this.props;
    this.colorScale = scaleLinear()
      .domain([0, maxValue])
      .range(['#880000', '#ff2525'])
      .interpolate(interpolateLab);
  }

  render() {
    const {
      scales, margins, data, svgDimensions,
    } = this.props;
    const { xScale, yScale } = scales;
    const { height } = svgDimensions;

    const bars = (
      data.map(datum => (
        <rect
          key={datum.feature}
          x={xScale(datum.feature)}
          y={yScale(datum.value)}
          height={height - margins.bottom - scales.yScale(datum.value)}
          width={xScale.bandwidth()}
          fill={this.colorScale(datum.value)}
        />))
    );

    return (
      <g>{bars}</g>
    );
  }
}

Bars.propTypes = {
  maxValue: PropTypes.number.isRequired,
  scales: PropTypes.shape({}).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape([])).isRequired,
  margins: PropTypes.shape({}).isRequired,
  svgDimensions: PropTypes.shape({}).isRequired,
};
