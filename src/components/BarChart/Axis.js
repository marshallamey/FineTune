import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3Axis from 'd3-axis';
import { select as d3Select } from 'd3-selection';

import '../../css/index.css';

export default class Axis extends Component {
  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    const { orient, scale, tickSize } = this.props;
    const axisType = `axis${orient}`;
    const axis = d3Axis[axisType]()
      .scale(scale)
      .tickSize(-tickSize)
      .tickPadding([12])
      .ticks([4]);

    d3Select(this.axisElement).call(axis);
  }

  render() {
    const { orient, translate } = this.props;
    return (
      <g
        className={`Axis Axis-${orient}`}
        ref={(el) => { this.axisElement = el; }}
        transform={translate}
      />
    );
  }
}

Axis.propTypes = {
  orient: PropTypes.string.isRequired,
  scale: PropTypes.func.isRequired,
  translate: PropTypes.string.isRequired,
  tickSize: PropTypes.number.isRequired,
};
